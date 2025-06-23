const instructionData = {
	doi: {
		line_1: `The crew are now awaiting the Apollo Guidance Computer (AGC)
    to initiate the Descent Orbit Insertion burn.`,
		line_2: `Please verify the burn below, which will skip forward
    to a few seconds before the actual Burn Ignition Ground Elapsed Time (GET)
    of "101:36:14", and watch the DSKY initiate Program 63 (P63).`
	},
	pd_intro: {
		intro: {
			1: `The procedure just performed was the Descent Orbit Insertion burn.`,
			2: `This has placed Eagle into a 60 x 9 nautical mile orbit.
			They would start the Powered Descent from this orbit.`,
			3: `At this moment, the Eagle is roughly 50 000 feet above the surface, traveling about 5 500 fps with approximately 95 % of its fuel remaining.`,
			4: `Powered Descent Initiation begins when the crew has selected P63 (BRAKING) in the Apollo Guidance Computer the first of the three lunar descent programs.`,
			5: `BRAKING begins when the Descent Propulsion System (DPS) ignites at 10 % throttle,	marking the transition from lunar orbit to powered descent. `
		},
		post_intro: {
			1: `They are five minutes from the planned Powered Descent Initiation.`,
			2: `Starting at about 102:27:50, Flight Director Gene Kranz asked members of his White Team of Flight Controllers for a Go/No Go for Powered Descent:`,
			3: `RETRO (Retrofire Officer, determined LM engine burn times and aborts);`,
			4: `FIDO (Flight Dynamics Officer, planned, monitored, and adjusted the flight path as required);`,
			5: `GUIDANCE (Guidance Officer, responsible for the on-board navigation Systems and guidance computers);`,
			6: `CONTROL (responsible for LM control systems);`,
			7: `TELMU (Telemetry, Electrical and EVA Mobility Officer, monitored LM electrical and environmental control systems);`,
			8: `GNC (Guidance, Navigation, and Controls Systems Engineer, monitored all vehicle guidance, navigation, and control systems, and the RCS systems);`,
			9: `EECOM (pronounced 'e-com', Electrical, Environmental and Consumables Manager);`,
			10: `Surgeon (Monitored crew health).`,
			11: `<br><strong>They all responded 'Go'.</strong>`,
			12: `<br>Source: https://www.nasa.gov/history/alsj/a11/a11.landing.html`
		},
		pre_63: {
			1: `Click 'Proceed' to unlock the DSKY`,
			2: `Press Verb 37 Noun 63 followed by Enter (V37N63E) to enable Program 63`,
			3: `Program 63 must be entered before ignition T-30s at 102:32:34.`
		},
		post_63: {
			1: `Now in Powered Descent Initiation, the DSKY will respond`
		},
		pre_ignition_1: {
			1: `The powered descent phase of the lunar descent, was handled by 3 main AGC programs.`,
			2: `P63: BRAKING`,
			3: `P64: APPROACH`,
			4: `P66: FINAL DESCENT`
		},
		pre_ignition_2: {
			1: `P63 takes the LM out of descent orbit at the orbits perilune
			(the point at which the orbiting body is closest to the moon)
		  by firing a retrograde burn at a Ground Elapsed Time determined by the program.`,
			2: `P63 has also determined a projected landing target, however this is allowed to change
			in P64.`
			// 3: `P63 responds with V06N62 (Time To Ignition): `,
			// 4: `R1: +HHMMSS`,
			// 5: `R2: Unused (ZERO padded)`,
			// 6: `R3: Unused (ZERO padded)`
		},
		pre_ignition_3: {
			1: `During this crucial phase, the AGC was busy running important mission critical calculations, which was shown by the 'COMPACTY' light flashing.`,
			2: `Because of this, the use of the manual DSKY controls was highly limited.`,
			3: `At T-35s , the DSKY display would blank for 5 seconds, as it was preparing to hand over control back to the crew.`,
			4: `Then at T-30s the AGC responds with V06 N62 (Time To Ignition): `,
			5: `R1: HHMMSS`,
			6: `R2: Unused (ZERO padded)`,
			7: `R3: Unused (ZERO padded)`,
			8: `<br>At T-5s the DSKY Display flashed VERB 99, to indicate a 'go' request from the crew, at which point Buzz Aldrin, the LM Pilot keyed in 'PROCEED' (PRO) to confirm the ignition.`,
			9: `<br>At T-0s the Ignition`
		},

		pre_ignition_final: {
			0: `At T-7.5s the <em>ullage burn</em> begins, a brief thrust to settle the propellant.`,
			1: `At T-5s, The DSKY display flashed VERB 99 to signal to the crew to confirm by pressing PRO.`,
			2: `At T-0s, as long as the crew had given the proceed command, the initial thrust began at 10%, for 26 seconds, which allowed the gimbals that pivoted the descent engine to move to align the thrust vector with the spacecraft's center of mass.`
		},

		pre_braking_out: {
			0: `Ignition of the DPS has successfully happened, and now the crew begin the actual braking phase, so called because its goal was to decrease horizontal velocity as much as possible, to allow for a lunar descent.`,
			1: `Press 'Next' to enter the braking phase of the mission.`
		}
	},

	braking: {
		braking_intro: {
			0: `On ignition, the DPS fired at 10% for 26 seconds, during which he gimbals that pivoted the descent engine moved to align the thrust vector with the spacecraft's center of mass. After 26 seconds of burn time, the software throttled up the DPS (Descent Propulsion System) to its maximum thrust of 9870 lb, 94% of the engines official rating of 10500 lb and at the same time enabled the descent guidance.`,
			4: `<br>Source: https://www.doneyles.com/LM/Tales.html`
		},

		braking_post_ignition: {
			1: `Post ignition, the DSKY will display V06N63: R1: Radar altitude, R2: Altitude rate, R3: Altitude `,
			2: `The crew can use the radar in landing mode to get a secondary real time altitude.
			This was done by V57 Enter, the DSKY will then display V06, and R1 will display Radar altitude minus the computed altitude.`,
			3: `The DSKY displays were compared against a 'cheat' sheet next to the instrument panel,
			which had estimated values computed by mission control.`
		}
	}
};

const { doi, pd_intro, braking_pre_ignition } = instructionData;
export { doi, pd_intro, braking_pre_ignition };
