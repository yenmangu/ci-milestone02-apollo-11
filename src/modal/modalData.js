const instructionData = {
	doi: {
		line_1: `The crew are now awaiting the Apollo Guidance Computer (AGC)
    to initiate the Descent Orbit Insertion burn.`,
		line_2: `Please verify the burn below, which will skip forward
    to a few seconds before the actual Burn Ignition Ground Elapsed Time (GET)
    of "101:36:14", and watch the DSKY initiate Program 63 (P63).`
	},
	pd_intro: {
		1: `The procedure just performed was the Descent Orbit Insertion burn.`,
		2: `This has placed Eagle into a 60 x 9 nautical mile orbit.
		They would start the Powered Descent from this orbit.`,
		3: `Powered Descent Initiation (PDI) begins when the
		Descent Propulsion System (DPS) ignites at 10 % throttle,
		marking the transition from lunar orbit to powered descent. `,
		4: `At this moment, the Eagle is roughly 50 000 feet above the surface,
		traveling about 5 500 fps with approximately 95 % of its fuel remaining.`,
		5: `Roughly 10-20 minutes before lunar descent,
		the crew must select P63 (BRAKING) in the Apollo Guidance Compute (AGC),
		 the first of the three main lunar descent programs.`,
		6: `One attempt..`,
		7: `No second chances.`
	},
	braking_pre_ignition: {
		1: `The powered descent phase of the lunar descent, was handled by 3 main AGC programs.`,
		2: `P63: BRAKING`,
		3: `P64: APPROACH`,
		4: `P66: FINAL DESCENT`,
		5: `P63 takes the LM out of descent orbit at the orbits perilune
		 (the point at which the orbiting body is closest to the moon)
		  by firing a retrograde burn at a Ground Elapsed Time determined by the program.`,
		6: `P63 has also determined a projected landing target, however this is allowed to change
		in P64.`,
		7: `P63 responds with V06N61: `,
		8: `Time to go`,
		9: `Time from ignition`,
		10: `Crossrange distance`,
		11: `The crew can use the DSKY to query various aspects of this phase:`,
		12: `V06N33: Time of Ignition. R1: hours, R2: minutes, R3: seconds`,
		13: `V06N62: Velocity info. R1: Absolute Velocity, R2: TIG (Time of Ignition), R3: Delta-V accumulation`,
		14: `Post ignition, the DSKY will display V06N63: R1: Radar altitude, R2: Altitude rate, R3: Altitude `,
		15: `The crew can use the radar in landing mode to get a secondary real time altitude.
		 This was done by V57 Enter, the DSKY will then display V06, and R1 will display Radar altitude minus the computed altitude.`,
		16: `The DSKY displays were compared against a 'cheat' sheet next to the instrument panel,
		which had estimated values computed by mission control.`
	},
	braking_post_ignition: {
		1: `Post ignition, the DSKY will display V06N63: R1: Radar altitude, R2: Altitude rate, R3: Altitude `,
		2: `The crew can use the radar in landing mode to get a secondary real time altitude.
		 This was done by V57 Enter, the DSKY will then display V06, and R1 will display Radar altitude minus the computed altitude.`,
		3: `The DSKY displays were compared against a 'cheat' sheet next to the instrument panel,
		which had estimated values computed by mission control.`
	}
};

const { doi, pd_intro, braking_pre_ignition } = instructionData;
export { doi, pd_intro, braking_pre_ignition };
