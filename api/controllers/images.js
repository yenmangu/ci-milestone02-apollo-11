/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getImages = async (req, res, next) => {
	res.status(200).json({ message: 'reachewd image controller' });
};

export { getImages };
