export class Modal {
	constructor() {
		this.nextModal = document.getElementById('next_Modal');
		this.instructionModal = document.getElementById('instruction_Modal');
		this.verifyButton = document.getElementById('verifyButton');
		this.nextPhase = document.getElementById('nextPhase');
		this.onceHandler = () => {
			this.hideModal();
		};
	}

	showNextModal() {
		if (this.nextModal) {
			console.log('Modal found');
			this.currentModal = this.nextModal;

			this.currentModal.classList.remove('hidden');
			this.currentModal.style.display = 'flex';
		}
	}

	hideModal() {
		if (this.currentModal) {
			this.currentModal.classList.add('hidden');
			this.currentModal.style.display = 'none';
		}
	}

	waitForNextClick(instructions = false, buttonText = '', ...args) {
		return new Promise(resolve => {
			if (!instructions) {
				if (!this.nextPhase) {
					this.hideModal();
					resolve();
					return;
				}

				const handler = () => {
					this.hideModal();
					this.nextPhase.removeEventListener('click', handler);
					resolve();
				};

				this.showNextModal();
				this.nextPhase.addEventListener('click', handler);
			} else {
				const handler = () => {
					this.hideModal();
					this.verifyButton.removeEventListener('click', handler);
					resolve();
				};
				this.buildInstructionModal(buttonText, ...args).then(() => {
					this.showInstructions();
					this.verifyButton.addEventListener('click', handler);
				});
			}
		});
	}

	removeListener(modal, handler) {
		throw new Error('Method not implemented.');
	}

	showInstructions() {
		if (!this.currentModal) {
			return;
		}
		this.currentModal.classList.remove('hidden');
		this.currentModal.style.display = 'flex';
	}

	buildInstructionModal(buttonText, ...args) {
		return new Promise(resolve => {
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
			resolve();
			return;
		});
	}
}
