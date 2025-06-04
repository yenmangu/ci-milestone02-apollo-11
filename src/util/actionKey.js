export const actionKeyFor = (verb, noun, display = false) => {
	if (!display) {
		return `VERB_${verb}_NOUN_${noun}`;
	} else {
		return `DISPLAY_${verb ? verb : ''}_NOUN${noun ? noun : ''}`;
	}
};
