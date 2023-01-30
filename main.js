const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
const settingsBtn = document.getElementById('settings-btn');
const settings = document.getElementById('settings');
const settingsForm = document.getElementById('settings-form');
const difficultySelect = document.getElementById('difficulty');


let words = []

// Get Word from Random Word API
async function getWords() {
  const res = await fetch(`https://random-word-api.herokuapp.com/word?number=20`);
  const data = await res.json();

  words = data;
  addWordToDOM();
}

getWords();

// init word
let randomWord;

// Init score
let score = 0;

// Init time
let time = 10;

// Init play state
let isPlaying = false;

// Set difficulty to value in ls or midium
let difficulty = localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'medium';

// Set difficulty select value
difficultySelect.value =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'medium';

// Focus on text on start
text.focus();

// Start counting down
let timeInterval;

function startCountdown() {
  if (isPlaying === false) {
    isPlaying = true;
    timeInterval = setInterval(updateTime, 1000);
  } else {
    return;
  }
}

// Generate random word from array
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// Add word to DOM
function addWordToDOM() {
  randomWord = getRandomWord();
  word.innerText = randomWord;
}

// Update score
function updateScore() {
  score++;
  scoreEl.innerText = score;
}

// Update time
function updateTime() {
  time--;
  timeEl.innerText = time + 's';

  if (time === 0) {
    clearInterval(timeInterval);

    // End game
    gameOver();
  }
}

// Game over, show end screen
function gameOver() {
  endgameEl.innerHTML = `
    <h1>Time ran out</h1>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Reload</button>
  `;

  endgameEl.style.display = 'flex';
}


// Event litseners

// Typing
text.addEventListener('input', e => {
  const insertedText = e.target.value;
  startCountdown();
  
  if (insertedText === randomWord) {
    addWordToDOM();
    updateScore();

    // Clear
    e.target.value = '';
    // text.value = '';

    if (difficulty === 'hard') {
      time += 3; 
    } else if (difficulty === 'medium') {
      time += 5;
    } else {
      time += 8;
    }

    updateTime();
  }
});

// Setting btn click
settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'))

// Setting select 
settingsForm.addEventListener('change', e => {
  difficulty = e.target.value;
  localStorage.setItem('difficulty', difficulty);
})



