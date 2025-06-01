type TPlayerTag = "X" | "O" | "empty";
type TStatus = "win" | "draw";

interface IWinMethod {
    method: "row" | "column" | "diagnol",
    position: number | "diagnol" | "offdiagnol"
}

let gameActive = true;

let moveCount: number;
let currentMoveTag: TPlayerTag = "O";
let UIElementsGrid: HTMLDivElement[][] = [];
let gameGrid = [["empty", "empty", "empty"], ["empty", "empty", "empty"], ["empty", "empty", "empty"]]

let moveStatus = document.getElementById("status") as HTMLParagraphElement;

function _reset(){
    moveCount = 0;
    gameActive = true;
    UIElementsGrid.forEach(row => {
        row.forEach(elm => {
            elm.textContent ="";
        })
    })
    
    gameGrid = [["empty", "empty", "empty"], ["empty", "empty", "empty"], ["empty", "empty", "empty"]]
    
    _switchMove();
}



function _switchMove() {
    currentMoveTag = (currentMoveTag == "X") ? "O" : "X";
    moveStatus.textContent = `Current Move: ${currentMoveTag}`;

}

function _initialize() {
    const rows = document.querySelectorAll<HTMLDivElement>("div.row");
    rows.forEach(row => {
        UIElementsGrid.push([...row.querySelectorAll<HTMLDivElement>("div.square")]);
    })
    document.querySelector<HTMLDivElement>('div.grid')!.addEventListener('click', _makeMove)
    document.getElementById("play-again")?.addEventListener("click",_reset);
}

function _makeMove(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    
    if(!gameActive) return;
    
    let targetSquare = event.target as HTMLDivElement;
    
    if(!targetSquare.classList.contains("square")) return;

    let row = parseInt(targetSquare.getAttribute('data-row')!);
    let col = parseInt(targetSquare.getAttribute('data-col')!);

    if (gameGrid[row][col] == "empty") {
        gameGrid[row][col] = currentMoveTag;
        UIElementsGrid[row][col].textContent = currentMoveTag;
        targetSquare.setAttribute('data-marked', "true")


        _checkGameStatus();
        _switchMove();
        moveCount++;
    }
}


function _displayEndStatus(status: TStatus, actor?: TPlayerTag, method?: IWinMethod) {
    gameActive = false;
    switch (status) {
        case "win": {
            alert(`Player ${actor} won by matching ${method?.position} ${method?.method}`);
            break;
        }
        
        case "draw": {
            alert("Game draw!");
            break;
        }
    }
}

function _checkGameStatus() {
    for (let row = 0; row < 3; row++) {
        if (gameGrid[row][0] === gameGrid[row][1] && gameGrid[row][0] === gameGrid[row][2] && gameGrid[row][0] === currentMoveTag) {
            _displayEndStatus("win", currentMoveTag, { method: "row", position: row });
            return;
        };
    }
    //equal col
    for (let col = 0; col < 3; col++) {
        if (gameGrid[0][col] === gameGrid[1][col] && gameGrid[0][col] === gameGrid[2][col] && gameGrid[0][col] === currentMoveTag) {
            _displayEndStatus("win", currentMoveTag, { method: "column", position: col });
            return;
        };
    }

    //diagnol
    if (gameGrid[0][0] === gameGrid[1][1] && gameGrid[0][0] === gameGrid[2][2] && gameGrid[1][1] === currentMoveTag) {
        _displayEndStatus("win", currentMoveTag, { method: 'diagnol', position: "diagnol" })
        return;
    } else if (gameGrid[0][2] === gameGrid[1][1] && gameGrid[0][2] === gameGrid[2][0] && gameGrid[1][1] === currentMoveTag) {
        _displayEndStatus("win", currentMoveTag, { method: 'diagnol', position: "offdiagnol" })
        return;
    }

    if (gameActive && moveCount == 9) {
        _displayEndStatus("draw");
        return; 
    }

}













_initialize();