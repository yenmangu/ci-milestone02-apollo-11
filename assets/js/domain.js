(function () {
	const pathname = window.location.pathname;
	const pageLinks = document.querySelectorAll('a.nav-link');
	pageLinks.forEach(a => {
		const anchor = /** @type {HTMLAnchorElement} */ (a);
		const path = anchor.href.slice(anchor.href.lastIndexOf('/'));
		if (pathname === path) {
			anchor.classList.add('active');
		} else {
			anchor.classList.remove('active');
		}
	});
})();
