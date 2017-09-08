class Pos {
    constructor(x, y) {
        if (typeof(x) != "number") {
            x = 0;
        }
        if (typeof(y) != "number") {
            y = 0;
        }

        this.x = x;
        this.y = y;
    }

    randomize() {
        do {
            this.x = Math.random() * window.maincontroller.map.width;
            this.y = Math.random() * window.maincontroller.map.height;
        } while (!window.maincontroller.map.isLand(this));
    }

    randomizedStep(distancelimit) {
        if (typeof(distancelimit) != "number") {
            distancelimit = 5;
        }

        var limit = 10;
        do {
            this.x += Math.floor(Math.random() * (distancelimit*2+1) - distancelimit);
            this.y += Math.floor(Math.random() * (distancelimit*2+1) - distancelimit);
            limit--;
        } while (!window.maincontroller.map.isLand(this) && (limit > 0));

        return (limit > 0);
    }
}
