const excel = document.getElementsByClassName("excel");
const field = document.getElementById("field");
const input = document.getElementsByClassName("score_text")[0];
const bestScoreText = document.getElementById("bestScore");
const restartButton = document.getElementById("restartButton");
const resetBestScore = document.getElementById("resetBestScoreButton");

const START_INTERVAL = 300
const MINUS_INTERVAL_COUNT = 10

let apple;
let snakeBody
let coordinates
let intervalMove

function returnCoordinateElement(x,y) {
    return document.querySelector(`[posX = "${x}"][posY = "${y}"]`)
}

function initSnakeBody () {
    const snakeBody = [
        returnCoordinateElement(coordinates[0], coordinates[1]),
        returnCoordinateElement((coordinates[0] - 1), coordinates[1]),
        returnCoordinateElement((coordinates[0] - 2), coordinates[1]),
    ]
    addClassesToSnake(snakeBody)
    return snakeBody
}
function addClassesToSnake(snake){
    snake.forEach((item, idx)=> {
        const className = idx === 0 ? "snakeHead" : "snakeBody"
        item.classList.add(className)
    })
}

function addSnakeSection(x, y){
    snakeBody.unshift(returnCoordinateElement(x, y));
}

function gameOver() {
    setTimeout(() => {
        alert("GameOver!");
    }, 300);
    
    clearInterval(intervalMove);
}

function startGame() {
    coordinates = generateSnake();
    snakeBody = initSnakeBody()
    createApple();
    snakeDirection = "right";
    steps = false;
    score = 0;
    input.textContent = `SCORE: ${score}`;
    intervalMove = setInterval(snakeMove, START_INTERVAL);
}

for (let i = 1; i < 101; i++) {
    const excel = document.createElement("div");
    field.appendChild(excel);
    field.classList.add("field");
    excel.classList.add("excel");
}

let x = 1,
    y = 10;

for (let i = 0; i < excel.length; i++) {
    if (x > 10) {
        x = 1;
        y--;
    }
    excel[i].setAttribute("posX", x);
    excel[i].setAttribute("posY", y);
    x++;
}

function generateSnake() {
    let posX = Math.round(Math.random() * (10 - 3) + 3);
    let posY = Math.round(Math.random() * (10 - 1) + 1);
    return [posX, posY];
}

function createApple() {
    function generateApple() {
        let posX = Math.round(Math.random() * (10 - 1) + 1);
        let posY = Math.round(Math.random() * (10 - 1) + 1);
        return [posX, posY];
    }

    let appleCoordinates;
    do {
        appleCoordinates = generateApple();
        apple = returnCoordinateElement(appleCoordinates[0], appleCoordinates[1])
    } while (apple.classList.contains("snakeBody"));

    apple.classList.add("apple");
}

startGame()

bestScoreText.textContent = `BEST SCORE: ${localStorage.getItem("bestScore") || 0}`;

function snakeMove() {
    let snakeCoordinates = [
        snakeBody[0].getAttribute("posX"),
        snakeBody[0].getAttribute("posY"),
    ];
    
    snakeBody[0].classList.remove("snakeHead");
    snakeBody[snakeBody.length - 1].classList.remove("snakeBody");
    snakeBody.pop();
    
    switch (snakeDirection) {
        case "right":
            if (snakeCoordinates[0] < 10) {
                addSnakeSection((+snakeCoordinates[0] + 1), snakeCoordinates[1])
            } else {
                addSnakeSection(1, snakeCoordinates[1])
            }
            break;
        
        case "left":
            if (snakeCoordinates[0] > 1) {
                addSnakeSection(+snakeCoordinates[0] - 1, snakeCoordinates[1])
            } else {
                addSnakeSection(10, snakeCoordinates[1])
            }
            break;
        
        case "up":
            if (snakeCoordinates[1] < 10) {
                addSnakeSection(snakeCoordinates[0], +snakeCoordinates[1] + 1)
            } else {
                addSnakeSection(snakeCoordinates[0], 1)
            }
            break;
        
        case "down":
            if (snakeCoordinates[1] > 1) {
                addSnakeSection(snakeCoordinates[0], snakeCoordinates[1] - 1)
            } else {
                addSnakeSection(snakeCoordinates[0], 10)
            }
            break;
    }
    if(
        (+snakeCoordinates[0] === 10 && +snakeBody[0].getAttribute("posX") === 1) ||
        (+snakeCoordinates[0] === 1 && +snakeBody[0].getAttribute("posX") === 10)
    ) {
        gameOver()
    }
    if((+snakeCoordinates[1] === 10 && +snakeBody[0].getAttribute("posY") === 1) ||
        (+snakeCoordinates[1] === 1 && +snakeBody[0].getAttribute("posY") === 10)
    ) {
        gameOver()
    }
    if (
        score > localStorage.getItem("bestScore") ||
        localStorage.getItem("bestScore") === null
    ) {
        localStorage.setItem("bestScore", score);
        bestScoreText.textContent = `BEST SCORE: ${score}`;
    }

    if (
        snakeBody[0].getAttribute("posX") == apple.getAttribute("posX") &&
        snakeBody[0].getAttribute("posY") == apple.getAttribute("posY")
    ) {
        apple.classList.remove("apple");
        let x = snakeBody[snakeBody.length - 1].getAttribute("posX");
        let y = snakeBody[snakeBody.length - 1].getAttribute("posY");
        snakeBody.push(returnCoordinateElement(x, y));
        createApple();
        score++;
        input.textContent = `SCORE: ${score}`;

        let newInterval = START_INTERVAL - score * MINUS_INTERVAL_COUNT > 100 ?
            START_INTERVAL - score * MINUS_INTERVAL_COUNT :
            100
        clearInterval(intervalMove);
        intervalMove = setInterval(snakeMove, newInterval);
    }
    
    if (snakeBody[0].classList.contains("snakeBody")) {
        gameOver()
    }
    addClassesToSnake(snakeBody)
    
    steps = true;
    
    if (
        score > localStorage.getItem("bestScore") ||
        localStorage.getItem("bestScore") === null
    ) {
        localStorage.setItem("bestScore", score);
        bestScoreText.textContent = `BEST SCORE: ${score}`;
    }
}

bestScoreText.textContent = `BEST SCORE: ${localStorage.getItem("bestScore") || 0}`;


window.addEventListener("keydown", function (e) {
    if (steps == true) {
        if (e.key === "ArrowLeft" && snakeDirection !== "right") {
            snakeDirection = "left";
            steps = false;
        } else if (e.key === "ArrowUp" && snakeDirection !== "down") {
            snakeDirection = "up";
            steps = false;
        } else if (e.key === "ArrowRight" && snakeDirection !== "left") {
            snakeDirection = "right";
            steps = false;
        } else if (e.key === "ArrowDown" && snakeDirection !== "up") {
            snakeDirection = "down";
            steps = false;
        }
    }
});


restartButton.addEventListener("click", () => {
    clearInterval(intervalMove);
    apple.classList.remove("apple");
    snakeBody.forEach((snakePart) => {
        snakePart.classList.remove("snakeHead", "snakeBody");
    });
    
    startGame()
});

resetBestScore.addEventListener("click", () => {
    localStorage.setItem("bestScore", 0);
    bestScoreText.textContent = `BEST SCORE: ${localStorage.getItem("bestScore") || 0}`;
});
