/**
 * @typedef {import("../types/clockTypes.js").TickPayload} TickPayload
 *
 *
 * @typedef {'linear'|'exp'|'spring'|'step'} EasingKind
 *
 * @typedef {Object} ChannelConfig
 * @property {EasingKind} easingKind
 * @property {number} [rate]
 * @property {number} [speed]
 * @property {number} [stiffness]
 * @property {number} [damping]
 * @property {(current: number, target: number) => number } [wrapDiff]
 * @property {[number,number]} [clamp]
 *
 * @typedef {Record<string, ChannelConfig>} SmootherConfig
 *
 * @typedef {{value: number, velocity: number}} ChannelState
 */

import { normaliseRaw } from './normalise.js';

export class TelemetrySmoother {
	/**
	 *
	 * @param {SmootherConfig} config
	 * @param {{devMode: boolean}} opts
	 */
	constructor(config, opts = { devMode: false }) {
		/** @type {SmootherConfig} */
		this.config = config;

		/** @type {boolean} */
		this.devMode = !opts.devMode;

		/** @type {Map<string, ChannelState>} */
		this.stateByKey = new Map();

		/** @type {Map<string, number>} */
		this.targetsByKey = new Map();

		this.lastTickGetSeconds = null;
	}

	/**
	 * Update raw targets from the SimState stream
	 *
	 * @param {Record<string, number>} rawTargets
	 */
	ingest(rawTargets) {
		for (const [key, value] of Object.entries(rawTargets)) {
			if (typeof value === 'number' && Number.isFinite(value)) {
				this.targetsByKey.set(key, value);
			}
		}
	}

	/**
	 * Tick the smoother and return eased values
	 * Channels without current target are skipped
	 *
	 * @param {{elapsedSeconds?: number, getSeconds: number}} tick
	 * @returns {Record<string, number>} eased snapshot at current tick
	 */
	tick(tick) {
		const deltaTime = this.deriveDeltaTime(tick);

		/** @type {Record<string, number>} */
		const eased = {};

		// First tick (dt=0) initialises state to targets without movement.
		// Subsequent ticks integrate towards targets
		for (const [key, config] of Object.entries(this.config)) {
			if (!this.targetsByKey.has(key)) continue;

			const target = /** @type {number} */ (this.targetsByKey.get(key));

			const prev = this.stateByKey.get(key) ?? { value: target, velocity: 0 };

			const next =
				deltaTime > 0
					? this.updateState(prev, target, config, deltaTime)
					: { value: target, velocity: 0 };

			const clamped = this.applyClamp(next.value, config.clamp);

			this.stateByKey.set(key, { value: clamped, velocity: next.velocity });
			eased[key] = clamped;

			// Update time AFTER processing to keep first-tick deltaTime=0 behaviour consistent
		}
		this.lastTickGetSeconds = tick.getSeconds;
		return eased;
	}

	/**
	 *
	 * @param {{getSeconds: number}} tick
	 * @returns {number}
	 */
	deriveDeltaTime(tick) {
		if (this.lastTickGetSeconds == null) return 0;
		const deltaTime = tick.getSeconds - this.lastTickGetSeconds;
		return deltaTime > 0 ? deltaTime : 0;
	}

	/**
	 * Advance (integrate) one time step for a telemetry channel.
	 * Given pevious state, target, config and delta time,
	 * returns the next {value, velocity} according to the policy:
	 * - 'exp' uses closed-form first-order step,
	 * - 'linear' enforces a slew-rate bound,
	 * - 'spring' uses a semi-implicit Euler on the mass-spring-damper ODE (Ordinary Differential Equation),
	 *
	 * and default behaviour snaps instantly to the target.
	 *
	 * @param {ChannelState} state
	 * @param {number} target
	 * @param {ChannelConfig} config
	 * @param {number} deltaTime
	 */
	updateState(state, target, config, deltaTime) {
		const current = state.value;

		switch (config.easingKind) {
			case 'exp': {
				const rate = Math.max(0, config.rate ?? 0);
				if (rate === 0) return { value: target, velocity: 0 };

				const diff = this.diff(current, target);

				// Alpha is exponential smoothing factor for this tick
				const alpha = 1 - Math.exp(-rate * deltaTime);

				const nextValue = current + diff * alpha;
				// Prevent division by 0 with a tiny epsilon
				const nextVelocity = (nextValue - current) / Math.max(deltaTime, 1e-6);
				return { value: nextValue, velocity: nextVelocity };
			}
			case 'linear': {
				const speed = Math.max(0, config.speed ?? 0);
				if (speed === 0) return { value: target, velocity: 0 };

				const diff = this.diff(current, target);
				const maxStep = speed * deltaTime;
				const step = Math.abs(diff) <= maxStep ? diff : Math.sign(diff) * maxStep;
				const nextValue = current + step;
				const nextVelocity = step / Math.max(deltaTime, 1e-6);
				return { value: nextValue, velocity: nextVelocity };
			}
			case 'spring': {
				const k = config.stiffness ?? 120;
				const c = config.damping ?? 20;

				const diff = this.diff(current, target);

				const accel = -k * diff - c * (state.velocity ?? 0);

				const nextVelocity = (state.velocity ?? 0) + accel * deltaTime;
				const nextValue = current + nextVelocity * deltaTime;
				return { value: nextValue, velocity: nextVelocity };
			}
			default: {
				// Fallback: snap
				return { value: target, velocity: 0 };
			}
		}
	}

	/**
	 * Signed difference between target and current
	 * - Positive -> increase
	 * - Negative -> decrease
	 *
	 * @param {number} current - Current eased value
	 * @param {number} target - Latest target value
	 * @returns {number} Signed difference toward target
	 */
	diff(current, target) {
		return target - current;
	}

	/**
	 *
	 * @param {number} value
	 * @param {[number,number] | undefined} clamp
	 */
	applyClamp(value, clamp) {
		if (!clamp) return value;
		const [min, max] = clamp;
		return Math.min(max, Math.max(min, value));
	}

	snapToTargets() {}
}
