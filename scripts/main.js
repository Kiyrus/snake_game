//Создаём поле с ячейками
const field = document.getElementById("field");

for (let i = 1; i < 101; i++) {
    const excel = document.createElement("div");
    field.appendChild(excel);
    field.classList.add("field");
    excel.classList.add("excel");
}

let excel = document.getElementsByClassName("excel");
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

//Создаём змею и голову с начальными координатами
function generateSnake() {
    let posX = Math.round(Math.random() * (10 - 3) + 3);
    let posY = Math.round(Math.random() * (10 - 1) + 1);
    return [posX, posY];
}

let coordinates = generateSnake();

let snakeBody = [
    document.querySelector(
        '[posX = "' + coordinates[0] + '"][posY = "' + coordinates[1] + '"]'
    ),
    document.querySelector(
        '[posX = "' + (coordinates[0] - 1) + '"][posY = "' + coordinates[1] + '"]'
    ),
    document.querySelector(
        '[posX = "' + (coordinates[0] - 2) + '"][posY = "' + coordinates[1] + '"]'
    ),
];

snakeBody[0].classList.add("snakeHead");

for (let i = 0; i < snakeBody.length; i++) {
    snakeBody[i].classList.add("snakeBody");
}

//Создаём яблоко с координатами отличными от координат змейки
let apple;

function createApple() {
    function generateApple() {
        let posX = Math.round(Math.random() * (10 - 1) + 1);
        let posY = Math.round(Math.random() * (10 - 1) + 1);
        return [posX, posY];
    }

    let appleCoordinates;
    do {
        appleCoordinates = generateApple();
        apple = document.querySelector(
            '[posX = "' + appleCoordinates[0] + '"][posY = "' + appleCoordinates[1] + '"]'
        );
    } while (apple.classList.contains("snakeBody"));

    apple.classList.add("apple");
}

createApple();

let snakeDirection = "right";
let steps = false;

let input = document.getElementsByClassName("score_text")[0];
let score = 0;
input.textContent = `SCORE: ${score}`;
const bestScoreText = document.getElementById("bestScore");
bestScoreText.textContent = `BEST SCORE: ${localStorage.getItem("bestScore") || 0}`;

function snakeMove() {
    let snakeCoordinates = [
        snakeBody[0].getAttribute("posX"),
        snakeBody[0].getAttribute("posY"),
    ];
    snakeBody[0].classList.remove("snakeHead");
    snakeBody[snakeBody.length - 1].classList.remove("snakeBody");
    snakeBody.pop();

    if (snakeDirection == "right") {
        if (snakeCoordinates[0] < 10) {
            snakeBody.unshift(
                document.querySelector(
                    '[posX = "' +
                        (+snakeCoordinates[0] + 1) +
                        '"][posY = "' +
                        snakeCoordinates[1] +
                        '"]'
                )
            );
        } else {
            snakeBody.unshift(
                document.querySelector(
                    '[posX = "1"][posY = "' + snakeCoordinates[1] + '"]'
                )
            );
        }
    } else if (snakeDirection == "left") {
        if (snakeCoordinates[0] > 1) {
            snakeBody.unshift(
                document.querySelector(
                    '[posX = "' +
                        (+snakeCoordinates[0] - 1) +
                        '"][posY = "' +
                        snakeCoordinates[1] +
                        '"]'
                )
            );
        } else {
            snakeBody.unshift(
                document.querySelector(
                    '[posX = "10"][posY = "' + snakeCoordinates[1] + '"]'
                )
            );
        }
    } else if (snakeDirection == "up") {
        if (snakeCoordinates[1] < 10) {
            snakeBody.unshift(
                document.querySelector(
                    '[posX = "' +
                        snakeCoordinates[0] +
                        '"][posY = "' +
                        (+snakeCoordinates[1] + 1) +
                        '"]'
                )
            );
        } else {
            snakeBody.unshift(
                document.querySelector(
                    '[posX = "' + snakeCoordinates[0] + '"][posY = "1"]'
                )
            );
        }
    } else if (snakeDirection == "down") {
        if (snakeCoordinates[1] > 1) {
            snakeBody.unshift(
                document.querySelector(
                    '[posX = "' +
                        snakeCoordinates[0] +
                        '"][posY = "' +
                        (snakeCoordinates[1] - 1) +
                        '"]'
                )
            );
        } else {
            snakeBody.unshift(
                document.querySelector(
                    '[posX = "' + snakeCoordinates[0] + '"][posY = "10"]'
                )
            );
        }

        if (
            score > localStorage.getItem("bestScore") ||
            localStorage.getItem("bestScore") === null
        ) {
            localStorage.setItem("bestScore", score);
            bestScoreText.textContent = `BEST SCORE: ${score}`;
        }
    }

    if (
        snakeBody[0].getAttribute("posX") == apple.getAttribute("posX") &&
        snakeBody[0].getAttribute("posY") == apple.getAttribute("posY")
    ) {
        apple.classList.remove("apple");
        let x = snakeBody[snakeBody.length - 1].getAttribute("posX");
        let y = snakeBody[snakeBody.length - 1].getAttribute("posY");
        snakeBody.push(
            document.querySelector('[posX = "' + x + '"][posY = "' + y + '"]')
        );
        createApple();
        score++;
        input.textContent = `SCORE: ${score}`;
    }

    if (snakeBody[0].classList.contains("snakeBody")) {
        setTimeout(() => {
            alert("GameOver!");
        }, 300);

        clearInterval(inervalMove);
    }

    snakeBody[0].classList.add("snakeHead");
    for (let i = 0; i < snakeBody.length; i++) {
        snakeBody[i].classList.add("snakeBody");
    }

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

let inervalMove = setInterval(snakeMove, 300);

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

const restartButton = document.getElementById("restartButton");

restartButton.addEventListener("click", () => {
    clearInterval(inervalMove);
    apple.classList.remove("apple");
    snakeBody.forEach((snakePart) => {
        snakePart.classList.remove("snakeHead", "snakeBody");
    });
    snakeBody = [];
    score = 0;
    input.textContent = `SCORE: ${score}`;
    coordinates = generateSnake();
    snakeBody.push(
        document.querySelector(
            '[posX = "' + coordinates[0] + '"][posY = "' + coordinates[1] + '"]'
        )
    );
    snakeBody.push(
        document.querySelector(
            '[posX = "' + (coordinates[0] - 1) + '"][posY = "' + coordinates[1] + '"]'
        )
    );
    snakeBody.push(
        document.querySelector(
            '[posX = "' + (coordinates[0] - 2) + '"][posY = "' + coordinates[1] + '"]'
        )
    );
    snakeBody[0].classList.add("snakeHead");
    for (let i = 0; i < snakeBody.length; i++) {
        snakeBody[i].classList.add("snakeBody");
    }
    createApple();
    snakeDirection = "right";
    steps = false;
    inervalMove = setInterval(snakeMove, 300);
});

const resetBestScore = document.getElementById("resetBestScoreButton");
resetBestScore.addEventListener("click", () => {
    localStorage.setItem("bestScore", 0);
    bestScoreText.textContent = `BEST SCORE: ${localStorage.getItem("bestScore") || 0}`;
});
