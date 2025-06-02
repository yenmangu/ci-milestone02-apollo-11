/**
 * verbNounToProgramMap:
 *   key   = actionKeyFor(verb, noun)  →  "VERB_<verb>_NOUN_<noun>"
 *   value = an array of all P-numbers that this V/N can launch (across all phases)
 *
 * When you’re in a specific phase, only one of these P-numbers should appear
 * in that phase’s own `dsky_actions`. You can pick the one that matches the
 * phase’s program list to mark “complete” and/or display to the DSKY.
 */
export const verbNounToProgramMap = {
	// “VERB_06_NOUN_22” appears in Braking (P63), Approach (P64), and Final Descent (P66)
	VERB_06_NOUN_22: ['P63', 'P64', 'P66'],

	// “VERB_16_NOUN_14” only in Powered Descent Initiation (P63)
	VERB_16_NOUN_14: ['P63'],

	// “VERB_32_NOUN_01” only in Approach Phase (P64)
	VERB_32_NOUN_01: ['P64'],

	// “VERB_33_NOUN_01” only in Approach Phase (P64)
	VERB_33_NOUN_01: ['P64'],

	// “VERB_33_NOUN_13” appears in 1202 Alarm (P63) and 1201 Alarm (P64)
	VERB_33_NOUN_13: ['P63', 'P64'],

	// “VERB_34_NOUN_02” only in Final Descent (P66)
	VERB_34_NOUN_02: ['P66'],

	// “VERB_37_NOUN_11” appears in PDI (P63) and Final Descent (P66)
	VERB_37_NOUN_11: ['P63', 'P66']
};
