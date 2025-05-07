const path = require('path');
require('dotenv').config({
	path: path.join(__dirname, '..', '.env')
});

const GITHUB_PAGES = process.env.GITHUB_PAGES;
const YENMANGU_ME = process.env.YENMANGU_ME;
const LOCAL = process.env.LOCAL;
const LOCALHOST = process.env.LOCALHOST;

module.exports = { GITHUB_PAGES, YENMANGU_ME, LOCAL, LOCALHOST };
