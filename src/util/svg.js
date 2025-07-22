const svgExport = {
	fastForward: `<svg class="icon ff">
								<use href="#icon-ff"
										 x="3.5"
										 y="2.5"
										 width="14"
										 height="14"></use>
							</svg>`
};

const createSvgUse = () => {
	const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	icon.classList.add('icon', 'ff');
	icon.setAttribute('width', '16');
	icon.setAttribute('height', '16');
	const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
	use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-ff');
	icon.appendChild(use);
	return icon;
};
export { svgExport, createSvgUse };
