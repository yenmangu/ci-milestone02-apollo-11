export class Modal {
	constructor() {
		this.nextModal = document.getElementById('nextModal');
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

	waitForNextClick() {
		return new Promise(resolve => {
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
		});
	}

	removeListener(modal, handler) {
		throw new Error('Method not implemented.');
	}
}
