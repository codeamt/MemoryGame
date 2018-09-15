/*******************************************
*
*
**************** Counters  ****************
*
*
********************************************/
let minute = 0;
let second = 0;
let moves = 0;
let time;


/*******************************************
*
*
**************** Selectors  ****************
*
*
********************************************/
let card = document.getElementsByClassName("card");
let moveCounter = document.querySelector('.moves');
let popUp = document.getElementById('win-board');
let timer = document.querySelector('.timer');



/*******************************************
*
*
************ State Variables *************
*
*
********************************************/
let boardLocked = false;
let startTimer = false;



/****************************************
*
*
**************** Game Logic *************
*
*
*****************************************/
//populate list with result form card selector
let cards = [...card];



// create a new board
    //(for functions employed in newboard(), check helper functions below)
function newBoard() {

  // remove status classes from all cards on the board
  let cardList = document.getElementsByClassName('card');
  for (let i = 0; i < cards.length; i++) {
    cardList[i].classList.remove('open', 'show', 'match', 'dontCount');
  };

  // shuffle cards and add each to the card deck
  shuffle(cards);
  let deckCards = document.getElementsByClassName('deck')[0];
  for (let i = 0; i < cards.length; i++) {
    deckCards.appendChild(cards[i]);
  };

  // reset moves counter
  moves = 0;
  moveCounter.innerHTML = moves;

  // reset timer counter
  startTimer = false;
  minute = 0;
  second = 0;
  timer.innerHTML = minute + ' min  ' + second + ' sec';
  clearInterval(time);

  // reset star rating
  let star = document.getElementsByClassName('fa-star');
  star[0].style.color = 'black';
  star[1].style.color = 'black';
  star[2].style.color = 'black';

  // hide gameover notification
  popUp.classList.remove('show');
}



// create new board with shuffled cards when page is refreshed
document.body.onload = newBoard();


//add listeners to board
cardListener();
refreshListener()




/*******************************************
*
*
************ Helper Functions *************
*
*
********************************************/
// shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};






// restart game
let restartGame = function() {
  let refresh = document.querySelector('.fa-repeat');
  refresh.addEventListener('click', newBoard);
}




//listener action
let cardClicked = function() {
  let clicked = this;

  if (clicked.classList.contains('dontCount') === false) {
    if (!boardLocked) {
      clicked.classList.add('open');
      clicked.classList.add('show');

      cardOpen(); // compare cards
      if (clicked.classList.contains('dontCount') === false) {
        moveNumber(); // count moves
      }
      clicked.classList.add('dontCount');
      starRating(); // issue a star rating
      // measure time
      if (!startTimer) {
        countTime();
        startTimer = true;
      };
      gameOverNotification();
    };
  };
};




// event listener for a card
let refreshListener = function() {
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', cardClicked);
  };
}





// open cards
function cardOpen() {
  let opened = document.getElementsByClassName('open');

  // check to see if the two open cards match
  if (opened.length === 2) {
    boardLocked = true; // stop the possibility of opening other cards
    if (opened[0].innerHTML === opened[1].innerHTML) {
      matched();
    } else {
      unmatched();
    };
  };
}



/**** checks for matches  ****/
// if the cards do match, lock the cards in the open position
function matched() {
  let openCards = document.getElementsByClassName('open');

  openCards[0].classList.add('match', 'dontCount');
  openCards[1].classList.add('match', 'dontCount');
  openCards[1].classList.remove('show', 'open');
  openCards[0].classList.remove('show', 'open');
  boardLocked = false; // unlock the possibility to open the remaining cards
}

// if the cards do not match, hide the card's symbol
function unmatched() {
  setTimeout(function() {
    let listOfOpenCards = document.getElementsByClassName('open');

    listOfOpenCards[1].classList.remove('show', 'open', 'dontCount');
    listOfOpenCards[0].classList.remove('show', 'open', 'dontCount');
    busy = false; // unlock the possibility to open the remaining cards
  }, 600);
}





// move counter
function moveNumber() {
  moves++;
  moveCounter.innerHTML = moves;
}




// star rating
function starRating() {
  let star = document.getElementsByClassName('fa-star');

  if (moves <= 20) {
    star[0].style.color = 'yellow';
    star[1].style.color = 'yellow';
    star[2].style.color = 'yellow';
  } else if (moves > 20 && moves <= 30) {
    star[0].style.color = 'yellow';
    star[1].style.color = 'yellow';
    star[2].style.color = 'black';
  } else if (moves > 30) {
    star[0].style.color = 'yellow';
    star[1].style.color = 'black';
    star[2].style.color = 'black';
  };
}




// game timer
function countTime() {
  second = 1;
  time = setInterval(function() {
    timer.innerHTML = minute + ' min  ' + second + ' sec';
    second++;
    if (second == 60) {
      minute++;
      second = 0;
    };
  }, 1000);
}



// if all cards have matched, display a congratulations with the final score
function gameOverNotification() {
  let matchedCars = document.getElementsByClassName('match');

  if (matchedCars.length === 16) { // check if all cards have matched
    clearInterval(time); // stop timer
    let ratingStars = document.querySelector('.stars').innerHTML;
    let finalTime = timer.innerHTML;
    popUp.classList.add('show'); // show popup with results
    document.querySelector('.total-moves').innerHTML = moves;
    document.querySelector('.total-time').innerHTML = finalTime;
    document.querySelector('.total-rating').innerHTML = ratingStars;
  };
}






