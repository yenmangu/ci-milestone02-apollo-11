import { TelemetrySmoother } from '../telemetrySmoother.js';
import { jest } from '@jest/globals';

/** @type {import("../telemetrySmoother.js").SmootherConfig} */
const baseConfig = {
	altitudeFeet: { easingKind: 'exp', rate: 4, clamp: [0, 400000] },
	velocityFps: { easingKind: 'linear', speed: 800 },
	fuel: { easingKind: 'exp', rate: 2, clamp: [0, 100] }
};
const t0 = 10.0;
/**
 *
 * @param {number} t
 * @returns {{elapsedSeconds: number, getSeconds: number}}
 */
const tickAt = t => ({ getSeconds: t, elapsedSeconds: t - t0 });

const normalisedIntialTargets = {
	altitudeFeet: 316800,
	velocityFps: 5320,
	fuel: 100
};

describe('TelemetrySmoother, 3 channels', () => {
	/** @type {TelemetrySmoother} */ let smoother = null;
	beforeEach(() => {
		smoother = new TelemetrySmoother(baseConfig);
	});

	test('first tick snaps to targets (deltaTime = 0)', () => {
		smoother.ingest(normalisedIntialTargets);

		const eased = smoother.tick(tickAt(10.0));

		expect(eased.altitudeFeet).toBe(316800);
		expect(eased.velocityFps).toBe(5320);
		expect(eased.fuel).toBe(100);
	});

	test('exp easing (alt and fuel) and linear cap (velocity) for dt > 0', () => {
		smoother.ingest(normalisedIntialTargets);
		// Initialise snapshot
		smoother.tick(tickAt(t0));
		const newTargets = { altitudeFeet: 306800, velocityFps: 5020, fuel: 98 };
		smoother.ingest(newTargets);

		const dt = 0.25;
		const eased = smoother.tick(tickAt(t0 + dt));

		const rateAlt = baseConfig.altitudeFeet.rate;
		// Alpha is exponential smoothing factor for current tick
		const alphaAlt = 1 - Math.exp(-rateAlt * dt);
		const expextedAlt = 316800 + (306800 - 316800) * alphaAlt;
		const rateFuel = baseConfig.fuel.rate;
		const alphaFuel = 1 - Math.exp(-rateFuel * dt);
		const expectedFuel = 100 + (98 - 100) * alphaFuel;
		const expectedVelocity = 5320 - 200; // 800 * 0.25 = 200

		expect(eased.altitudeFeet).toBe(expextedAlt);
		expect(eased.fuel).toBe(expectedFuel);
		expect(eased.velocityFps).toBe(expectedVelocity);
	});

	test('linear cap reaches target on subsequent step when within max step', () => {
		smoother.ingest({ altitudeFeet: 316800, velocityFps: 5320, fuel: 100 });
		smoother.tick(tickAt(t0));

		smoother.ingest({ altitudeFeet: 306800, velocityFps: 5020, fuel: 98 });

		smoother.tick(tickAt(t0 + 0.25)); // 5320 -> 5120
		const eased2 = smoother.tick(tickAt(t0 + 0.5)); // 5120 -> 5020

		expect(eased2.velocityFps).toBeCloseTo(5020, 6);
	});

	test('snapToTargets applies immediately (no animation)', () => {
		smoother.ingest({ altitudeFeet: 316800, velocityFps: 5320, fuel: 100 });
		smoother.tick(tickAt(t0));

		smoother.ingest({ altitudeFeet: 300000, velocityFps: 5200, fuel: 99 });
		smoother.tick(tickAt(t0 + 0.2));

		smoother.ingest({ altitudeFeet: 305000, velocityFps: 5100, fuel: 98.5 });
		smoother.snapToTargets();

		const eased = smoother.tick(tickAt(t0 + 0.2)); // dt = 0

		expect(eased.altitudeFeet).toBeCloseTo(305000, 6);
		expect(eased.velocityFps).toBeCloseTo(5100, 6);
		expect(eased.fuel).toBeCloseTo(98.5, 6); // ← renamed
	});

	test('clamp is enforced after update', () => {
		/** @type {import('../telemetrySmoother.js').SmootherConfig} */
		const clampedConfig = {
			...baseConfig,
			altitudeFeet: { easingKind: 'exp', rate: 4, clamp: [300000, 400000] }
		};
		smoother = new TelemetrySmoother(clampedConfig);

		smoother.ingest({ altitudeFeet: 316800, velocityFps: 5320, fuel: 100 });
		smoother.tick(tickAt(t0));

		smoother.ingest({ altitudeFeet: 250000 });
		const eased = smoother.tick(tickAt(t0 + 0.5));

		expect(eased.altitudeFeet).toBe(300000);
	});
});
