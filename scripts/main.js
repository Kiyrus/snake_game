import GameField from "./GameField.js";
import Snake from "./Snake.js";
import Apple from "./Apple.js";
import Score from "./Score.js";

class Main {
    constructor() {
        this.gameField = new GameField();
        this.snake = new Snake();
        this.apple = new Apple();
        this.score = new Score(0);
    }

    update() {
        //логика обновления данных при изменении 
    }

    draw() {
        //отрисовка всех частей игры
    }
}

export default Main;
