class Entity {

    constructor(colony, pos) {
        this.pos = pos;
        this.colony = colony;

        this.health = 100;
        this.power = 0;
        this.reproduce = 0;

        this.brain = new Brain();
    }

    step() {
        this.reproduce += this.power;
        this.health--;

        if (this.reproduce >= 1000) {
            this.colony.offsping(this);
            this.reproduce = 0;
        }

        var fnd = this.pos.randomizedStep();
        if (!fnd) {
            this.health = 0;
        } else {
            var tkn = window.maincontroller.map.isTaken(this.pos);
            if (tkn !== false) {
                if (tkn.power > this.power) {
                    this.health = 0;
                } else {
                    tkn.health = 0;
                }
            }
        }
    }

}
