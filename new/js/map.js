class Map {

    constructor(width, height) {
        console.log("Loading map image...");

        this.width = width;
        this.height = height;

        this.drawsize = {
            cellWidth: 50,
            cellHeight: 50
        };

        this.cells = [];
        for (var x = 0; x < width; x++) {
            var arr = [];
            for (var y = 0; y < height; y++) {
                var type = CellType.LAND;
                if (Math.random() < 0.1) {
                    type = CellType.WATER;
                }
                var c = new Cell(type);
                arr.push(c);
            }
            this.cells.push(arr);
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width * this.drawsize.cellWidth;
        this.canvas.height = this.height * this.drawsize.cellHeight;
        this.ctx = this.canvas.getContext("2d");
    }

    updateCanvas() {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.updateTile(x, y);
            }
        }
    }

    updateTile(x, y) {
        if (this.cells[x][y].type == CellType.LAND) {
            this.ctx.fillStyle = this.cells[x][y].food.toHSL();
        } else {
            this.ctx.fillStyle = "black";
        }
        this.ctx.fillRect(x * this.drawsize.cellWidth, y * this.drawsize.cellHeight, this.drawsize.cellWidth, this.drawsize.cellHeight);
    }

    isLand(pos) {
        if (!(pos instanceof Pos)) {
            console.error("Pos class required");
        }

        var px = Math.floor(pos.x);
        var py = Math.floor(pos.y);

        if (px >= 0 && py >= 0 && px < this.width && py < this.height) {
            return this.cells[px][py].type == CellType.LAND;
        } else {
            //console.error("Invalid location: ", pos);
            return false;
        }
    }

    getFoodData(pos) {
        if (!(pos instanceof Pos)) {
            console.error("Pos class required");
        }

        var px = Math.floor(pos.x);
        var py = Math.floor(pos.y);

        if (px >= 0 && py >= 0 && px < this.width && py < this.height) {
            return this.cells[px][py].food;
        } else {
            var f = new Food();
            f.amount = 0;
            return f;
        }
    }

    season() {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.cells[x][y].food.amount += 0.001;
            }
        }
    }

    /*isTaken(pos) {
        if (!(pos instanceof Pos)) {
            console.error("Pos class required");
        }

        window.maincontroller.colonies.forEach(function(colonie) {
            colonie.entities.forEach(function(entity) {
                if ((Math.abs(entity.pos.x - pos.x) < window.maincontroller.entsize.width) &&
                    (Math.abs(entity.pos.y - pos.y) < window.maincontroller.entsize.height)) {
                    return entity;
                }
            });
        });

        return false;
    }*/

}
