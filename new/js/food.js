class Food {
    constructor() {
        this.amount = 0.2;
        this.type = Math.random();
    }

    toHSL() {
        if (this.amount < 0) {
            this.amount = 0;
        }
        if (this.amount > 1) {
            this.amount = 1;
        }

        var food_type = this.type * 360;
        var food_amount = this.amount * 100;
        return "hsl("+food_type+", "+food_amount+"%, 50%)";
    }
}
