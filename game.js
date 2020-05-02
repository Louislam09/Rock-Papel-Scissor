const player = document.querySelector('.you-side');
const computer = document.querySelector('.com-side');
const YOU_SELECTION_CONTAINER = document.querySelector('.you-selection');
const COM_SELECTION_CONTAINER = document.querySelector('.com-selection');
const SCORE = document.querySelector('.score');
const WHO_WIN = document.querySelector('.who-win');
const WINNER_CONTAINER = document.querySelector('.winner-container');
const WINNER = document.querySelector('.winner');
const RESTART_BUTTON = document.querySelector('.restart-button');

let computerPoint = 4;
let playerPoint = 4;

function gameStart() {
	let computerChoices = computer.children;

	player.childNodes.forEach((button) => {
		button.addEventListener('click', () => {
			waitingAnimation();

			setTimeout(() => {
				YOU_SELECTION_CONTAINER.classList.remove('waitingAnimation');
				COM_SELECTION_CONTAINER.classList.remove('waitingAnimation');

				let playerChoice = button.innerText;
				let computerChoice = computerChoices[Math.floor(Math.random() * computerChoices.length)].innerText;

				YOU_SELECTION_CONTAINER.innerText = button.innerText;
				COM_SELECTION_CONTAINER.innerText = computerChoice;

				checkForWin(playerChoice, computerChoice);

				SCORE.innerText = `${playerPoint} - ${computerPoint}`;

				whoWin5();
			}, 4000);
		});
	});
}

function checkForWin(playerChoice, comChoice) {
	if (
		(playerChoice === '👊🏻' && comChoice === '✌🏻') ||
		(playerChoice === '✋🏻' && comChoice === '👊🏻') ||
		(playerChoice === '✌🏻' && comChoice === '✋🏻')
	) {
		win();
	} else if (playerChoice === comChoice) {
		draw();
	} else {
		lose();
	}
}

function whoWin5() {
	GameOver();
}

function win() {
	WHO_WIN.innerText = '';
	WHO_WIN.innerText = `YOU WIN!`;
	YOU_SELECTION_CONTAINER.classList.add('win');
	COM_SELECTION_CONTAINER.classList.add('lose');
	playerPoint += 1;
}
function draw() {
	WHO_WIN.innerText = '';
	WHO_WIN.innerText = `IT'S A DRAW`;
	YOU_SELECTION_CONTAINER.classList.add('draw');
	COM_SELECTION_CONTAINER.classList.add('draw');
}
function lose() {
	WHO_WIN.innerText = '';
	WHO_WIN.innerText = `YOU LOSE!`;
	COM_SELECTION_CONTAINER.classList.add('win');
	YOU_SELECTION_CONTAINER.classList.add('lose');
	computerPoint += 1;
}

function waitingAnimation() {
	YOU_SELECTION_CONTAINER.classList.remove('lose');
	YOU_SELECTION_CONTAINER.classList.remove('win');
	YOU_SELECTION_CONTAINER.classList.remove('draw');

	COM_SELECTION_CONTAINER.classList.remove('lose');
	COM_SELECTION_CONTAINER.classList.remove('win');
	COM_SELECTION_CONTAINER.classList.remove('draw');

	WHO_WIN.innerText = '';

	setTimeout(() => {
		YOU_SELECTION_CONTAINER.innerText = '🤜🏻';
		COM_SELECTION_CONTAINER.innerText = '🖐🏻';
		YOU_SELECTION_CONTAINER.classList.add('waitingAnimation');
		COM_SELECTION_CONTAINER.classList.add('waitingAnimation');
	}, 1000);

	setTimeout(() => {
		YOU_SELECTION_CONTAINER.innerText = '🖐🏻';
		COM_SELECTION_CONTAINER.innerText = '🤜🏻';
	}, 2000);
	setTimeout(() => {
		YOU_SELECTION_CONTAINER.innerText = '🤜🏻';
		COM_SELECTION_CONTAINER.innerText = '🖐🏻';
	}, 3000);
}
function GameOver() {
	if (playerPoint === 5 || computerPoint === 5) {
		WINNER_CONTAINER.classList.add('show');

		if (playerPoint === 5) WINNER.innerText = `YOU WON!!`;
		if (computerPoint === 5) WINNER.innerText = `THE COMPUTER WON!!`;

		RESTART_BUTTON.addEventListener('click', () => {
			SCORE.innerText = '0 - 0';
			YOU_SELECTION_CONTAINER.innerText = '';
			COM_SELECTION_CONTAINER.innerText = '';
			WHO_WIN.innerText = '';

			WINNER_CONTAINER.classList.remove('show');

			YOU_SELECTION_CONTAINER.classList.remove('lose');
			YOU_SELECTION_CONTAINER.classList.remove('win');
			YOU_SELECTION_CONTAINER.classList.remove('draw');

			COM_SELECTION_CONTAINER.classList.remove('lose');
			COM_SELECTION_CONTAINER.classList.remove('win');
			COM_SELECTION_CONTAINER.classList.remove('draw');

			playerPoint = 0;
			computerPoint = 0;
		});
	}
}

gameStart();
