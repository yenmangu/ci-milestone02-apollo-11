// Utility function to enable casting of Elements to specific type (T)

/**
 * @template T
 * @param {unknown} el
 * @param {'element' | 'nodelist'} expectedType
 * @returns {T}
 * @throws {TypeError}
 */
export function cast(el, expectedType) {
	if (expectedType === 'element') {
		if (!(el instanceof HTMLElement)) {
			throw new TypeError('Expected an HTMLElement');
		}
	} else if (expectedType === 'nodelist') {
		if (!(el instanceof NodeList)) {
			throw new TypeError('Expected a NodeList');
		}
		for (const node of el) {
			if (!(node instanceof HTMLElement)) {
				throw new TypeError(`NodeList contains non HTMLElement nodes: ${node}`);
			}
		}
	} else {
		throw new TypeError('Invalid expecedType. Use "element" or "nodeList"');
	}

	return /** @type {T} */ (el);
}
