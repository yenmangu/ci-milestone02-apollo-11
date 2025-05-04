/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

const getAudio = async (req, res, next) => {
	res.status(200).json({
		message: 'reached audio controller'
	});
};

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

const otherFunc = async (req, res, next) => {};

const audioController = { getAudio, otherFunc };

export { getAudio, otherFunc };
