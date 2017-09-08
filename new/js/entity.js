class Entity {

    constructor(pos, mutate) {
        this.pos = pos;
        this.direction = Math.random() * Math.PI * 2;

        this.food = new Food();

        if (typeof(mutate) == "undefined") {
            this.brain = new Brain(this);
        } else {
            this.brain = new Brain(this, mutate.brain);
            this.food.type = mutate.food.type + ((Math.random() - 0.5) / 100);
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = 30;
        this.canvas.height = 30;
        this.ctx = this.canvas.getContext("2d");
    }

    updateCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        this.ctx.fillStyle = this.food.toHSL();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 10, 0, 2*Math.PI);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
        var rp = this.calculateEyeRelativeDirection();
        this.ctx.lineTo(this.canvas.width / 2 + rp.x * 15, this.canvas.height / 2 + rp.y * 15);
        this.ctx.fillStyle = "black";
        this.ctx.stroke();
    }

    calculateEyeRelativeDirection() {
        var pos = new Pos(0, 0);
        pos.x = Math.cos(this.direction);
        pos.y = Math.sin(this.direction);
        //console.log(this.direction);
        return pos;
    }

    calculateEyeLocation() {
        var rd = this.calculateEyeRelativeDirection();
        var pos = new Pos(this.pos.x + rd.x, this.pos.y + rd.y);
        return pos;
    }

    step() {
        var todo = this.brain.calculate();
        this.direction += todo.rotate / 10;
        var ep = this.calculateEyeRelativeDirection();
        this.pos.x += ep.x * todo.moveForward / 30;
        this.pos.y += ep.y * todo.moveForward / 30;

        if (todo.eat) {
            var fooddata = window.maincontroller.map.getFoodData(this.pos);
            if (fooddata.amount > 0) {
                fooddata.amount -= 0.01;

                if (Math.abs(this.food.type - fooddata.type) < 0.3) {
                    this.food.amount += 0.01;
                } else {
                    this.food.amount -= 0.05;
                }
            } else {
                this.food.amount -= 0.01;
            }
        } else {
            this.food.amount -= 0.005;
        }

        if (!window.maincontroller.map.isLand(this.pos)) {
            this.food.amount = 0;
        }
    }

}
