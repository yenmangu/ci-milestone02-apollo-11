/**
 *
 * @param {HTMLElement} element
 * @param {'click'} eventName
 * @returns {Promise<MouseEvent>}
 */
function waitForEvent(element, eventName) {
	// console.log(
	// 	`${Date.now()} >> Attaching waitForEvent on`,
	// 	element,
	// 	'for',
	// 	eventName
	// );

	return new Promise(resolve => {
		element.addEventListener(
			eventName,
			(/** @type {MouseEvent} */ evt) => {
				// console.log(`${Date.now()} >> evt: , clicked`);
				resolve(evt);
			},
			{ once: true }
		);
	});
}

export class Modal {
	constructor() {
		this.nextModal = document.getElementById('next_Modal');
		this.instructionModal = document.getElementById('instruction_Modal');
		this.verifyButton = document.getElementById('verifyButton');
		this.nextPhase = document.getElementById('nextPhase');
		this.currentButton = null;
		// this.onceHandler = () => {
		// 	this.hideModal();
		// };
	}

	showCurrentModal() {
		if (!this.currentModal) {
			return;
		}
		this.currentModal.classList.remove('hidden');
		this.currentModal.style.display = 'flex';
	}

	hideModal() {
		if (!this.currentModal) {
			return;
		}

		this.currentModal.classList.add('hidden');
		this.currentModal.style.display = 'none';
		this.currentModal = null;
		this.currentButton = null;
	}

	async waitForNextClick(instructions = false, buttonText = '', ...args) {
		// console.log(
		// 	`${Date.now()} >> Entering waitForNextClick: instructions= instructions`
		// );
		this.hideModal();

		if (!instructions) {
			if (!this.nextPhase) {
				return;
			}

			this.currentModal = this.nextModal;
			this.showCurrentModal();
			// console.log(
			// 	'Binding NextPhase listener at',
			// 	Date.now(),
			// 	'->',
			// 	this.nextPhase
			// );

			await waitForEvent(this.nextPhase, 'click');
			this.hideModal();
			return;
		} else {
			await this.buildInstructionModal(buttonText, ...args);

			this.currentModal = this.instructionModal;
			this.showCurrentModal();
			await waitForEvent(this.verifyButton, 'click');
			this.hideModal();
			return;
		}
	}

	async buildInstructionModal(buttonText, ...args) {
		this.currentModal = this.instructionModal;
		const innerContainer = this.currentModal.querySelector('.inner');

		while (innerContainer.firstChild) {
			innerContainer.removeChild(innerContainer.firstChild);
		}

		args.forEach((text, index) => {
			const messageDiv = document.createElement('div');
			messageDiv.innerHTML = `<span id="message_${index + 1}">${text}</span>`;
			innerContainer.appendChild(messageDiv);
		});

		this.verifyButton.innerText = buttonText;
		return;
	}
}
