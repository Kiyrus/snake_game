function returnCoordinateElement(x, y) {
    return document.querySelector(`[posX = "${x}"][posY = "${y}"]`);
}

function generateRandomCoords(offsetX, offsetY) {
    let posX = Math.round(Math.random() * (10 - offsetX) + offsetX);
    let posY = Math.round(Math.random() * (10 - offsetY) + 1);
    return [posX, posY];
}

class Field {
    constructor() {
        this.fieldElement = document.getElementById("field");
        this.excelElement = document.getElementsByClassName("excel");
        this.x = 1;
        this.y = 10;
    }

    createField() {
        for (let i = 1; i < 101; i++) {
            const excel = document.createElement("div");
            excel.classList.add("excel");
            this.fieldElement.classList.add("field");
            this.fieldElement.appendChild(excel);
        }
    }

    initField() {
        this.createField();
        for (let i = 0; i < this.excelElement.length; i++) {
            if (this.x > 10) {
                this.x = 1;
                this.y--;
            }
            this.excelElement[i].setAttribute("posX", this.x);
            this.excelElement[i].setAttribute("posY", this.y);
            this.x++;
        }
    }
}

class Apple {
    constructor() {
        this.apple = null;
        this.className = "apple";
    }

    create() {
        let coords;

        do {
            coords = generateRandomCoords(1, 1);
            this.apple = returnCoordinateElement(coords[0], coords[1]);
        } while (this.apple.classList.contains("snakeBody"));

        this.apple.classList.add(this.className);
    }

    reGenerate() {
        if (this.apple) {
            this.apple.classList.remove(this.className);
        }
        this.create();
    }

    getX() {
        return this.apple.getAttribute("posX");
    }

    getY() {
        return this.apple.getAttribute("posY");
    }
}

class Snake {
    constructor() {
        this.body = null;
        this.initialCoords = null;
        this.coords = null;
        this.direction = null;
        this.steps = null;
    }

    init() {
        this.initialCoords = generateRandomCoords(3, 1);
        this.body = [
            returnCoordinateElement(this.initialCoords[0], this.initialCoords[1]),
            returnCoordinateElement(this.initialCoords[0] - 1, this.initialCoords[1]),
            returnCoordinateElement(this.initialCoords[0] - 2, this.initialCoords[1]),
        ];
        this.addClassesToSnake();
        this.direction = "right";
        this.steps = false;
    }

    addClassesToSnake() {
        this.body.forEach((item, idx) => {
            const className = idx === 0 ? "snakeHead" : "snakeBody";
            item.classList.add(className);
        });
    }

    addSection(x, y) {
        this.body.unshift(returnCoordinateElement(x, y));
    }

    move() {
        this.coords = [
            this.body[0].getAttribute("posX"),
            this.body[0].getAttribute("posY"),
        ];
        this.body[0].classList.remove("snakeHead");
        this.body[this.body.length - 1].classList.remove("snakeBody");
        this.body.pop();

        switch (this.direction) {
            case "right":
                if (this.coords[0] < 10) {
                    this.addSection(+this.coords[0] + 1, this.coords[1]);
                } else {
                    this.addSection(1, this.coords[1]);
                }
                break;

            case "left":
                if (this.coords[0] > 1) {
                    this.addSection(+this.coords[0] - 1, this.coords[1]);
                } else {
                    this.addSection(10, this.coords[1]);
                }
                break;

            case "up":
                if (this.coords[1] < 10) {
                    this.addSection(this.coords[0], +this.coords[1] + 1);
                } else {
                    this.addSection(this.coords[0], 1);
                }
                break;

            case "down":
                if (this.coords[1] > 1) {
                    this.addSection(this.coords[0], this.coords[1] - 1);
                } else {
                    this.addSection(this.coords[0], 10);
                }
                break;
        }
    }
}

class Game {
    constructor() {
        this.score = 0;
        this.INTERVAL_COUNT = 300;
        this.MINUS_INTERVAL_COUNT = 10;
        this.scoreText = document.getElementById("inputScore");
        this.bestScoreText = document.getElementById("bestScore");
        this.restartButton = document.getElementById("restartButton");
        this.resetButtton = document.getElementById("resetBestScoreButton");
        this.gameInterval = null;
        this.apple = new Apple();
        this.snake = new Snake();
    }

    start() {
        this.apple.reGenerate();
        this.snake.init();
        this.score = 0;
        this.scoreText.textContent = `SCORE: ${this.score}`;
        this.bestScoreText.textContent = `BEST SCORE: ${
            localStorage.getItem("bestScore") || 0
        }`;
        this.gameInterval = setInterval(() => this.move(), this.INTERVAL_COUNT);
    }

    over() {
        setTimeout(() => alert("GameOver!"), 300);
        clearInterval(this.gameInterval);
    }

    move() {
        this.snake.move();
        if (
            (+this.snake.coords[0] === 10 &&
                +this.snake.body[0].getAttribute("posX") === 1) ||
            (+this.snake.coords[0] === 1 &&
                +this.snake.body[0].getAttribute("posX") === 10)
        ) {
            this.over();
        }
        if (
            (+this.snake.coords[1] === 10 &&
                +this.snake.body[0].getAttribute("posY") === 1) ||
            (+this.snake.coords[1] === 1 &&
                +this.snake.body[0].getAttribute("posY") === 10)
        ) {
            this.over();
        }
        if (
            this.score > localStorage.getItem("bestScore") ||
            localStorage.getItem("bestScore") === null
        ) {
            localStorage.setItem("bestScore", this.score);
            this.bestScoreText.textContent = `BEST SCORE: ${this.score}`;
        }

        if (
            this.snake.body[0].getAttribute("posX") == this.apple.getX() &&
            this.snake.body[0].getAttribute("posY") == this.apple.getY()
        ) {
            this.apple.reGenerate();
            let x = this.snake.body[this.snake.body.length - 1].getAttribute("posX");
            let y = this.snake.body[this.snake.body.length - 1].getAttribute("posY");
            this.snake.body.push(returnCoordinateElement(x, y));
            this.score++;
            this.scoreText.textContent = `SCORE: ${this.score}`;

            let changedInterval =
                this.INTERVAL_COUNT - this.score * this.MINUS_INTERVAL_COUNT;
            let newInterval = changedInterval > 100 ? changedInterval : 100;
            clearInterval(this.gameInterval);
            this.gameInterval = setInterval(() => this.move(), newInterval);
        }

        if (this.snake.body[0].classList.contains("snakeBody")) {
            this.over();
        }
        this.snake.addClassesToSnake();
        this.snake.steps = true;

        if (
            this.score > localStorage.getItem("bestScore") ||
            localStorage.getItem("bestScore") === null
        ) {
            localStorage.setItem("bestScore", this.score);
            this.bestScoreText.textContent = `BEST SCORE: ${this.score}`;
        }
    }

    initialize() {
        const gameField = new Field();
        gameField.initField();
        this.start();

        window.addEventListener("keydown", (e) => {
            if (this.snake.steps == true) {
                if (e.key === "ArrowLeft" && this.snake.direction !== "right") {
                    this.snake.direction = "left";
                    this.snake.steps = false;
                } else if (e.key === "ArrowUp" && this.snake.direction !== "down") {
                    this.snake.direction = "up";
                    this.snake.steps = false;
                } else if (e.key === "ArrowRight" && this.snake.direction !== "left") {
                    this.snake.direction = "right";
                    this.snake.steps = false;
                } else if (e.key === "ArrowDown" && this.snake.direction !== "up") {
                    this.snake.direction = "down";
                    this.snake.steps = false;
                }
            }
        });

        this.restartButton.addEventListener("click", () => {
            clearInterval(this.gameInterval);
            this.apple.reGenerate();
            this.snake.body.forEach((snakePart) => {
                snakePart.classList.remove("snakeHead", "snakeBody");
            });

            this.start();
        });

        this.resetButtton.addEventListener("click", () => {
            localStorage.setItem("bestScore", "0");
            this.bestScoreText.textContent = `BEST SCORE: ${
                localStorage.getItem("bestScore") || 0
            }`;
        });
    }
}

const game = new Game();
game.initialize();
