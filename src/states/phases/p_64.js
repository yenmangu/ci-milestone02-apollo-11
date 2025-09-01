import { TelemetryController } from '../../telemetry/telemetryController.js';
import { makeV06N64 } from '../../util/dskyRegisters.js';
import { secondsFromGet } from '../../util/GET.js';
import {
	createAltitudeRateCalculator,
	createApollo11RedesigCounter,
	getLpdAngleForAltitude
} from '../../util/telemetry.js';
import { BasePhase } from './basePhase.js';

export class P_64 extends BasePhase {
	constructor(simState, phaseMeta) {
		super(simState, phaseMeta);
		this.altRateCalc = createAltitudeRateCalculator(0.35);
		/** @type {(nowSec: number) => number} */ this.getRedesigSec = () => 0;
	}

	onEnter() {
		this.log('P_64 Entered');
		this.getRedesigSec = createApollo11RedesigCounter(this.currentGETSeconds);
		if (this.telemetryController) {
			this.telemetryController.exit();
			this.telemetryController = null;
		}
		this.telemetryController = new TelemetryController(
			this.phaseMeta.initialState,
			this.phaseMeta.endState,
			telemetry => {
				this.setUiData({
					altitude: telemetry.altitude,
					velocity: telemetry.velocity,
					vUnits: telemetry.vUnits,
					fuel: telemetry.fuel
				});

				let altRateFps = null;

				const altFeet =
					typeof telemetry.altitude.feet === 'number' ? telemetry.altitude.feet : 0;

				if (this.altRateCalc) {
					const tNow = this.currentGETSeconds;
					altRateFps = this.altRateCalc.update(altFeet, tNow);
				}

				const redesignationSeconds = this.getRedesigSec(this.currentGETSeconds);

				if (redesignationSeconds <= 0) {
					this.uiController.hud.updatePrompt(
						'Landing point redesignation window passed'
					);
				}

				const altRate = typeof altRateFps === 'number' ? altRateFps : 0;

				const burnRegisters = makeV06N64({
					altitudeFeet: telemetry.altitude.feet,
					lpdAngle: getLpdAngleForAltitude(telemetry.altitude.feet),
					altitudeRateFps: altRate,
					redesignationSeconds
				});
				this.driveDskyRegisters(burnRegisters);
			}
		);
		this.telemetryController.init();
		this.continueTelemetryInterpolation();
	}

	/**
	 *
	 * @param {import('../../types/clockTypes.js').TickPayload} tick
	 */
	onTick(tick) {}

	continueTelemetryInterpolation() {
		const duration =
			secondsFromGet(this.phaseMeta.endGET) -
			secondsFromGet(this.phaseMeta.startGET);
		this.triggerInterpolation({
			interpolationStartGET: this.phaseMeta.startGET,
			durationSec: duration
		});
	}

	/**
	 *
	 * @param {import('../../types/uiTypes.js').RegisterTypeMap} regs
	 */
	driveDskyRegisters(regs) {
		const d = this.uiController?.dsky?.segmentDisplays;
		if (!d) return;
		this.uiController.dsky.segmentDisplays.bulkWrite({
			prog: regs.prog,
			verb: regs.verb,
			noun: regs.noun,
			p_1: regs.p_1 ?? ' ',
			r_1: regs.r_1 ?? '',
			p_2: regs.p_2 ?? ' ',
			r_2: regs.r_2 ?? '',
			p_3: regs.p_3 ?? ' ',
			r_3: regs.r_3 ?? ''
		});
	}

	onExit() {
		this.log('P_64 completed');
	}
}
