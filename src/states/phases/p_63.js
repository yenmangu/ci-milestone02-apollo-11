/**
 * @typedef {import('../../types/runtimeTypes.js').RuntimePhaseState} TelemetryRaw
 * @typedef {import('../../types/clockTypes.js').TickPayload} TickPayload
 *
 */

import { TelemetryController } from '../../telemetry/telemetryController.js';
import { PhaseIds } from '../../types/timelineTypes.js';
import { makeV06N63 } from '../../util/dskyRegisters.js';
import { getFromSeconds, secondsFromGet } from '../../util/GET.js';
import {
	createAltitudeRateCalculator,
	formatTelemetryForUI
} from '../../util/telemetry.js';
import { BasePhase } from './basePhase.js';

export class P_63 extends BasePhase {
	constructor(simState, phaseMeta) {
		super(simState, phaseMeta);
		this.tenPercentTime = 26;
		this.burnStartGetString = this.phaseMeta.startGET;
		this.altRate = createAltitudeRateCalculator(0.35);
	}

	async onEnter() {
		this.log('P_63 Entered');
		// Start telemetry interpolation
		// Clear existing telemetry controller
		if (this.telemetryController) {
			this.telemetryController.exit();
			this.telemetryController = null;
		}

		this.setupTenPercentController();
		this.handleTenPercentBurn();

		const finished = await this.waitForInterpolationFinish();
		if (finished && this.telemetryController) {
			// console.log('Finished ten percent');
			this.telemetryController.exit();
			this.telemetryController = null;
			this.setUpMainBurnController();
			this.handleMainBurn();
			const mainFinished = await this.waitForInterpolationFinish();
			if (mainFinished) {
				console.log('Main burn finished');
				this.simulationState.fsm.transitionTo(PhaseIds.P_64);
			}
		}
	}

	setUpMainBurnController() {
		if (this.telemetryController) {
			this.telemetryController.exit();
			this.telemetryController = null;
		}

		this.createTelemetryController(
			this.endOfTenPercentState,
			this.phaseMeta.endState,
			(telemetry, { altRateFps }) => {
				const mainBurnRegisters = makeV06N63(
					telemetry.velocity,
					altRateFps ?? null,
					telemetry.altitude.feet
				);
				this.driveDskyRegisters(mainBurnRegisters);
			},
			true
		);
	}

	setupTenPercentController() {
		/** @type {TelemetryRaw} */ this.endOfTenPercentState = {
			velocity: 5559.7,
			vUnits: 'fps',
			altitude: {
				miles: 9.45,
				feet: 49914
			},
			fuel: 94.5
		};
		// this.altRate = 2.2;
		this.altRatePolarity = 'minus';
		// Instance a new telemetry controller, overriding super prop

		this.createTelemetryController(
			this.phaseMeta.initialState,
			this.endOfTenPercentState,
			(telemetry, { altRateFps }) => {
				const tenPercentBurnRegisters = makeV06N63(
					telemetry.velocity,
					altRateFps ?? null,
					telemetry.altitude.feet
				);
				this.driveDskyRegisters(tenPercentBurnRegisters);
			},
			true
		);
	}

	/**
	 *
	 * @param {TelemetryRaw} initialState
	 * @param {TelemetryRaw} endState
	 * @param {(telemetry: TelemetryRaw, rates?: {altRateFps: number|null }) => void} [onTelemetry]
	 * @param {boolean} [calcRates=false]
	 * @returns {void}
	 */
	createTelemetryController(
		initialState,
		endState,
		onTelemetry = () => {},
		calcRates = false
	) {
		if (this.telemetryController) {
			this.telemetryController.exit();
			this.telemetryController = null;
		}

		const altRateCalc = calcRates ? createAltitudeRateCalculator(0.35) : null;

		this.telemetryController = new TelemetryController(
			initialState,
			endState,
			/** @param {TelemetryRaw} telemetry  */
			telemetry => {
				this.setUiData({
					altitude: telemetry.altitude,
					velocity: telemetry.velocity,
					vUnits: telemetry.vUnits,
					fuel: telemetry.fuel
				});

				/** @type {number|null} */
				let altRateFps = null;

				if (calcRates && altRateCalc) {
					const tNow = this.currentGETSeconds;

					const altFeet = telemetry.altitude.feet;

					if (typeof altFeet === 'number') {
						altRateFps = altRateCalc.update(altFeet, tNow);
					}
				}

				if (typeof onTelemetry === 'function') {
					onTelemetry(telemetry, { altRateFps });
				}
			}
		);
		this.telemetryController.init();
	}

	/**
	 *
	 * @param {import('../../types/uiTypes.js').RegisterTypeMap} regs
	 */
	driveDskyRegisters(regs) {
		this.uiController.dsky.segmentDisplays.bulkWrite({
			prog: regs.prog,
			verb: regs.verb,
			noun: regs.noun,
			p_1: regs.p_1,
			r_1: regs.r_1 ?? '',
			p_2: regs.p_2,
			r_2: regs.r_2 ?? '',
			p_3: regs.p_3,
			r_3: regs.r_3 ?? ''
		});
	}

	handleTenPercentBurn() {
		console.log('Ten pecent burn triggered');
		this.triggerInterpolation({
			interpolationStartGET: this.burnStartGetString,
			durationSec: this.tenPercentTime
		});
		this.uiController.hud.renderPrompt('Throttle at 10%');
	}

	handleMainBurn() {
		console.log('Main burn started');

		const mainBurnStartGETSeconds =
			secondsFromGet(this.burnStartGetString) + this.tenPercentTime;
		const mainBurnStartGETString = getFromSeconds(mainBurnStartGETSeconds);
		const endGetSeconds = secondsFromGet(this.phaseMeta.endGET);
		const duration = endGetSeconds - mainBurnStartGETSeconds;

		this.triggerInterpolation({
			interpolationStartGET: mainBurnStartGETString,
			durationSec: duration
		});
		this.uiController.hud.renderPrompt('Throttle at 94%');
	}

	/**
	 *
	 * @param {TickPayload} tick
	 */
	onTick(tick) {
		this.currentGETSeconds;
	}

	onExit() {
		this.log('P_63 completed');
	}
}
