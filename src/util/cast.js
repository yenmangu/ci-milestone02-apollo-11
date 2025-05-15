// Utility function to enable casting of Elements to specific type (T)

/**
 * @template T
 * @param {Element | NodeListOf<Element> | Element[] } el
 * @param {'element' | 'nodeList' | ''} [expectedType='element']
 * @returns {T}
 * @throws {TypeError}
 */
export function cast(el, expectedType = 'element') {
	if (expectedType === 'element') {
		if (!(el instanceof HTMLElement)) {
			throw new TypeError('Expected an HTMLElement');
		}
	} else if (expectedType === 'nodeList') {
		if (!(el instanceof NodeList || Array.isArray(el))) {
			throw new TypeError('Expected a NodeList or array');
		}
		/** @type {Iterable<Element>} */
		const nodes = Array.from(/** @type {NodeListOf<Element> | Element[]} */ (el));
		for (const node of nodes) {
			if (!(node instanceof HTMLElement)) {
				throw new TypeError(`NodeList contains non HTMLElement nodes: ${node}`);
			}
		}
	} else {
		throw new TypeError('Invalid expectedType. Use "element" or "nodeList"');
	}

	return /** @type {T} */ (el);
}
