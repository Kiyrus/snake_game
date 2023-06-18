class Score {
    constructor(score) {
        //инициализировать начальное кол-во очков
        this._score = score;
    }

    draw() {
        //отрисовка блока с очками
    }

    increase() {
        //увеличение кол-ва очков с последующей изменения числа на "табло"
        this._score += 1;
        this.draw();
    }

    reset() {
        //сброс очков
        this._score = 0;
        this.draw();
    }
}

export default Score;
