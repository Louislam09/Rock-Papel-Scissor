const youSide = document.querySelector('.you-side');
const oponentSide = document.querySelector('.oponent-side');
const youDiv = document.querySelector('.you');
const oponentDiv = document.querySelector('.oponent');
const oponentConnectStatus = oponentSide.querySelector('.connect');
const oponentStatus = oponentSide.querySelector('.waiting');
const youConnectStatus = youSide.querySelector('.connect');
const youStatus = youSide.querySelector('.waiting');
const YOU_SELECTION_CONTAINER = document.querySelector('.you-selection');
const OPONENT_SELECTION_CONTAINER = document.querySelector('.oponent-selection');
const SCORE = document.querySelector('.score');
const WHO_WIN = document.querySelector('.who-win');
const WINNER_CONTAINER = document.querySelector('.winner-container');
const WINNER = document.querySelector('.winner');
const RESTART_BUTTON = document.querySelector('.restart-button');
const WAITING_OPONET = document.querySelector('.waiting-oponent');
const emojisSpan = document.querySelectorAll('.emoji');
const youEmojiGrid = document.querySelector('.you-side .emoji-grid');
const oponentEmojiGrid = document.querySelector('.oponent-side .emoji-grid');
const toggleEmojiArrow = document.querySelector('.arrow');
const emojisSection = document.querySelector('.emojis-section');


let userName = prompt('Escribe Tu Nombre:');
let oponentName;

let oponentPoint = 0;
let playerPoint = 0;
let playerNumber = 0;
let oponentNumber;
let pointToWin = 3;
let playerChoice = '';
let oponentChoice = '';
let youEmojiTime = '';
let oponentEmojiTime = '';

let waitingOponentTime;
const socket = io();

socket.emit('user-name', userName);
youConnectStatus.classList.add('is-connect');

socket.on('players-info', informations => {
	for(const i in informations){
		let keys = Object.keys(informations);

		if(informations[i].num === -1){
			WAITING_OPONET.innerText = 'Sorry, The Server Is Full';

		} else {
			playerNumber = parseInt(informations[i].num);
			oponentNumber = (playerNumber === 0) ? 1 : 0;
			
			if(informations[keys[playerNumber]].userName !== userName){
				oponentName = informations[keys[playerNumber]].userName;
				break;
			}

		}
	}

	setPlayerName();
	if(userName !== undefined && oponentName !== undefined) hideElement(WAITING_OPONET);
});

socket.on('oponent-connected', data => {
	let { message } = data;
	oponentConnectStatus.classList.add('is-connect');
	popupMessage(message);
});

socket.on('oponent-disconneted', data => {
	let { message } = data;
	oponentConnectStatus.classList.remove('is-connect');
	setPlayerName()
	showElement(WAITING_OPONET);
	popupMessage(message);
});

function gameStart() {
	youSide.querySelectorAll('button').forEach((button) => {
		button.addEventListener('click',() => {
			let myChoice = button.className;
			playerChoice = wordToEmoji(myChoice);
			socket.emit('im-ready',myChoice);
			youStatus.classList.add('is-ready');
			canFightStart();
			
			youSide.querySelectorAll('button').forEach((button) => disabledButton(button,'on'));
		})
	});
	showAndHideEmojiGrid();
	popupEmoji();
}

socket.on('oponent-ready', data => {
	oponentStatus.classList.add('is-ready');
	oponentChoice = wordToEmoji(data);
	canFightStart();
});

function disabledButton(button,state){
	if(state === 'on'){
		button.disabled = true;
	}else{
		button.disabled = false;
	}
} 

function wordToEmoji(word){
	return word = (word === 'rock') ? '👊🏻' : (word === 'scissor') ? "✌🏻" : '✋🏻';
}

function canFightStart(){ 
	if(oponentStatus.classList.contains('is-ready') && 
		youStatus.classList.contains('is-ready')){
			waitingAnimation();
		
			setTimeout(() => {
				YOU_SELECTION_CONTAINER.classList.remove('waitingAnimation');
				OPONENT_SELECTION_CONTAINER.classList.remove('waitingAnimation');
		
				YOU_SELECTION_CONTAINER.innerText = playerChoice;
				OPONENT_SELECTION_CONTAINER.innerText = oponentChoice;
		
				checkForWin(playerChoice, oponentChoice);
		
				SCORE.innerText = `${playerPoint} - ${oponentPoint}`;

				whoWin3();
				youSide.querySelectorAll('button').forEach((button) => disabledButton(button,'off'));
		}, 4000);
			
		oponentStatus.classList.remove('is-ready');
		youStatus.classList.remove('is-ready');
	}
}

function setPlayerName(){
	youDiv.innerText = userName;
	oponentDiv.innerText = oponentName;
	if(oponentName === undefined){
		 waitingOponentLoop();
	}else{
		clearInterval(waitingOponentTime);
	}
}

function checkForWin(playerChoice, oponentChoice) {
	if (
		(playerChoice === '👊🏻' && oponentChoice === '✌🏻') ||
		(playerChoice === '✋🏻' && oponentChoice === '👊🏻') ||
		(playerChoice === '✌🏻' && oponentChoice === '✋🏻')
	) {
		win();
	} else if (playerChoice === oponentChoice) {
		draw();
	} else {
		lose();
	}
}

function whoWin3() {
	GameOver();
}

function win() {
	WHO_WIN.innerText = '';
	WHO_WIN.innerText = `GANASTE!`;
	YOU_SELECTION_CONTAINER.classList.add('win');
	OPONENT_SELECTION_CONTAINER.classList.add('lose');
	playerPoint += 1;
}

function draw() {
	WHO_WIN.innerText = '';
	WHO_WIN.innerText = `EMPATE!`;
	YOU_SELECTION_CONTAINER.classList.add('draw');
	OPONENT_SELECTION_CONTAINER.classList.add('draw');
}

function lose() {
	WHO_WIN.innerText = '';
	WHO_WIN.innerText = `PERDISTE!`;
	OPONENT_SELECTION_CONTAINER.classList.add('win');
	YOU_SELECTION_CONTAINER.classList.add('lose');
	oponentPoint += 1;
}

function waitingAnimation() {
	YOU_SELECTION_CONTAINER.classList.remove('lose');
	YOU_SELECTION_CONTAINER.classList.remove('win');
	YOU_SELECTION_CONTAINER.classList.remove('draw');

	OPONENT_SELECTION_CONTAINER.classList.remove('lose');
	OPONENT_SELECTION_CONTAINER.classList.remove('win');
	OPONENT_SELECTION_CONTAINER.classList.remove('draw');

	WHO_WIN.innerText = '';

	setTimeout(() => {
		YOU_SELECTION_CONTAINER.innerText = '🤜🏻';
		OPONENT_SELECTION_CONTAINER.innerText = '🖐🏻';
		YOU_SELECTION_CONTAINER.classList.add('waitingAnimation');
		OPONENT_SELECTION_CONTAINER.classList.add('waitingAnimation');
	}, 1000);

	setTimeout(() => {
		YOU_SELECTION_CONTAINER.innerText = '🖐🏻';
		OPONENT_SELECTION_CONTAINER.innerText = '🤜🏻';
	}, 2000);
	setTimeout(() => {
		YOU_SELECTION_CONTAINER.innerText = '🤜🏻';
		OPONENT_SELECTION_CONTAINER.innerText = '🖐🏻';
	}, 3000);
}

function GameOver() {
	if (playerPoint === pointToWin || oponentPoint === pointToWin) {
		WINNER_CONTAINER.classList.add('show');

		if (playerPoint === pointToWin) WINNER.innerText = `ERES EL GANADOR!!`;
		if (oponentPoint === pointToWin) WINNER.innerText = `${oponentName} GANO!!`;

		RESTART_BUTTON.addEventListener('click', () => {
			SCORE.innerText = '0 - 0';
			YOU_SELECTION_CONTAINER.innerText = '';
			OPONENT_SELECTION_CONTAINER.innerText = '';
			WHO_WIN.innerText = '';

			WINNER_CONTAINER.classList.remove('show');

			YOU_SELECTION_CONTAINER.classList.remove('lose');
			YOU_SELECTION_CONTAINER.classList.remove('win');
			YOU_SELECTION_CONTAINER.classList.remove('draw');

			OPONENT_SELECTION_CONTAINER.classList.remove('lose');
			OPONENT_SELECTION_CONTAINER.classList.remove('win');
			OPONENT_SELECTION_CONTAINER.classList.remove('draw');

			playerPoint = 0;
			oponentPoint = 0;
		});
	}
}

function showElement(element){
	element.style.visibility = 'visible';
}

function hideElement(element){
	element.style.visibility = 'hidden';
}

function waitingOponentLoop(){
	let amountOfDot = 3;
	let dot = '';
	waitingOponentTime = setInterval(() => {
	  dot += '.';
	  WAITING_OPONET.innerText = `Esperando Tu Oponente${dot}`;
	  amountOfDot--;
	  if(amountOfDot === 0) amountOfDot = 3 , dot = '';
	}, 700);
}

function popupMessage(message){
	let div = document.createElement('div');
	div.innerText = message;
	div.classList.add('popup-message');
	document.querySelector('body').appendChild(div);

	setTimeout( () => {
		div.remove();
	}, 3000);
}

function wordToAnimateEmoji(word){
	let surprice = `<iframe src="https://giphy.com/embed/Ss0X9wziu1NHEPXe5c" width="100" height="100" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`;
	let joy = `<iframe src="https://giphy.com/embed/hVlZnRT6QW1DeYj6We" width="100" height="100" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`;
	let Angry =`<iframe src="https://giphy.com/embed/kyQfR7MlQQ9Gb8URKG" width="100" height="100" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`;
	let strong =` <iframe src="https://giphy.com/embed/SvLQ270MWY0GpztVjo" width="100" height="100" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`;
	let cry =` <iframe src="https://giphy.com/embed/ViHbdDMcIOeLeblrbq" width="100" height="100" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>`;
	
	let animateEmoji = (word === 'joy') ? joy : (word === 'cry') ? cry :
	(word === 'angry') ? Angry : (word === 'strong') ? strong : surprice;

	return animateEmoji;
}

function popupEmoji(){
	clearTimeout(youEmojiTime);
	emojisSpan.forEach(emoji => {
		emoji.addEventListener('click', () =>{
			let emojiName = emoji.classList[1];
			socket.emit('send-emoji',emojiName);
			youEmojiGrid.innerHTML = wordToAnimateEmoji(emojiName);
			youEmojiGrid.classList.add('popup-emoji');
		
			youEmojiTime = setTimeout( () => {
				youEmojiGrid.innerText = '';
			}, 3000);
		})
	})
}

socket.on('oponent-sent-emoji', data => {
	const { emoji } = data;
	clearTimeout(oponentEmojiTime);
	oponentEmojiGrid.innerHTML = wordToAnimateEmoji(emoji);
	oponentEmojiGrid.classList.add('popup-emoji');

	oponentEmojiTime = setTimeout( () => {
		oponentEmojiGrid.innerText = '';
	}, 4000);
});

function showAndHideEmojiGrid(){
	toggleEmojiArrow.addEventListener('click', () =>{
		toggleEmojiArrow.innerText = (toggleEmojiArrow.innerText === '▶️') ? '◀️':'▶️';
		emojisSection.classList.contains('hide-emojis-section') ? emojisSection.classList.replace('hide-emojis-section','show-emojis-section') :
		emojisSection.classList.replace('show-emojis-section','hide-emojis-section'); 
		emojisSpan.forEach((span,index) => {
			showElement(span)
			span.classList.contains(`e${index+1}`) ? span.classList.remove(`e${index+1}`) :
			span.classList.add(`e${index+1}`);
			span.addEventListener('animationend',() => {
				hideElement(span)	
			});
		}); 
	});
};


gameStart();

