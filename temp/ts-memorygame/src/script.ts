interface Card {
    value: string,
    index: number,
    revealed: boolean
}

let cardContainer = document.getElementById("cards") as HTMLDivElement;
let scoreText = document.getElementById("score") as HTMLHeadingElement;
let timerText = document.getElementById("timer") as HTMLHeadingElement;


// let symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let symbols = ['a','b']
let TIMEDELAY = 1000;



let gameCards: Card[] = []
let flippedCards: Card[] = []
let totalRevealedCards = 0;
let move = true;
let firstcard = true;
let timer = 0;

function flipCard(canvasCard: HTMLDivElement){
    let index = parseInt(canvasCard.getAttribute('data-index')!);
    let equivalentGameCard = gameCards[index];

    
    
    if (equivalentGameCard.revealed == false && equivalentGameCard.index != flippedCards[0]?.index) {
        canvasCard.textContent = equivalentGameCard.value;
        flippedCards.push(equivalentGameCard);

    }
}

function checkMatching(){
    move = false;
    setTimeout(() => {
        if (flippedCards[0].value == flippedCards[1].value) {
            flippedCards.forEach(card => {
                card.revealed = true;
               let cardDiv = document.querySelector(`.card[data-index="${card.index}"]`) as HTMLDivElement;
                cardDiv.style.backgroundColor = "#878787";
            });
            totalRevealedCards += 2;
            updateScoreText(totalRevealedCards/2);
        } else {
            flippedCards.forEach(card => {
                let cardDiv = document.querySelector(`.card[data-index="${card.index}"]`) as HTMLDivElement;
                cardDiv.textContent = "";
            })
        }
        flippedCards = [];
        move = true;
        if (totalRevealedCards == gameCards.length) {
            alert("You won");
            reset();
        }
    }, TIMEDELAY);
}


function clickEvent(event: Event) {
    if(firstcard) {
        firstcard = false;
        startTimer();
    }
    
    
    
    if(move){
        let target = event.target as HTMLDivElement;
        flipCard(target);
        if (flippedCards.length == 2) checkMatching();
    }

    if(totalRevealedCards==gameCards.length){
        reset();
        setup();
    }
}


function updateScoreText(text:number){
    scoreText.textContent = "Score : " + text.toString();
}

function reset(){
    cardContainer.innerHTML = '';
    updateScoreText(0);
    totalRevealedCards = 0;
    firstcard = true;
    flippedCards = [];
    gameCards=[]
    move=true;
    stopTimer();
    setup();
}

function setup() {
    let shuffledCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    shuffledCards.forEach((value, index) => {
        let card = document.createElement('div');
        card.classList.add("card");
        card.setAttribute('data-index', index.toString());
  
        cardContainer.append(card);
        card.addEventListener("click", clickEvent);

        gameCards.push({ value: value, index: index, revealed: false });
    })
}

function startTimer(){
    let start = Date.now();
    let delta = 0;

    timer = setInterval(()=>{
        delta = Math.floor((Date.now() - start)/1000);
        timerText.textContent = "Time : " + delta.toString()+'s';
    }, 1000)
    
}
function stopTimer(){
    timerText.textContent = "Time : 0s";
    clearInterval(timer);
}


setup();