export default (function () {
	console.log('domain.js');

	const pathname = window.location.pathname;
	const path = pathname.slice(pathname.lastIndexOf('/'));
	const pageLinks = document.querySelectorAll('a.nav-link');
	pageLinks.forEach(a => {
		const anchor = /** @type {HTMLAnchorElement} */ (a);
		const anchorPath = anchor.href.slice(anchor.href.lastIndexOf('/'));
		console.log('path in domain: ', path);
		if (anchorPath === path) {
			anchor.classList.add('active');
		} else {
			anchor.classList.remove('active');
		}
	});
	return path;
})();
