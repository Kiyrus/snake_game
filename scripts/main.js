class GameField {
    constructor() {
        this.field = document.getElementById("field");
    }

    draw() {
        for (let i = 1; i < 101; i++) {
            const excel = document.createElement("div");
            this.field.appendChild(excel);
            this.field.classList.add("field");
            excel.classList.add("excel");
        }
    }
}

const createGameField = new GameField();
createGameField.draw();
