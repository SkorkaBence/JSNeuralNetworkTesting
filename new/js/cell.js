class Cell {

    constructor(type) {
        this.type = type;
        this.food = new Food();
    }

}

CellType = {
    LAND : 0,
    WATER : 1
}
