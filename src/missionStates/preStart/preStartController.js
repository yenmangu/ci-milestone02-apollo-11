import { onStart, getUISections } from './preStartRender.js';

export function waitForUserStart() {
	return new Promise(resolve => {
		onStart(() => {
			const sections = getUISections();
			resolve(sections);
		});
	});
}
