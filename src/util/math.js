/**
 * Linear Interpolation
 * @param {number} start - Starting value
 * @param {number} end - Target value
 * @param {number} t - Clamped value between 0 and 1
 * @returns
 */
const lerp = (start, end, t) => start * (1 - t) + end * t;
/**
 * Round any float to a given decimals
 * @param {number} value
 * @param {number} decimals - How many decimals to round to
 * @returns {number}
 */
const roundToDecimals = (value, decimals) => {
	return Number(Math.round(parseFloat(value + 'e' + decimals)) + 'e-' + decimals);
};

export { lerp, roundToDecimals };
