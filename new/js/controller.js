class Controller {

    constructor(ready) {
        console.log("Loading controller...");

        this.canvas = null;
        this.context = {
            normal: null,
            webgl: null
        };
        this.colonies = null;
        this.fps = 0;
        this.fps_temp = 0;

        document.body.innerHTML = "";

        this.canvas = document.createElement("canvas");
        document.body.appendChild(this.canvas);
        this.context.normal = this.canvas.getContext("2d");

        window.onresize = function() {
            window.maincontroller.onResize();
        };

        this.map = new Map(window.config.map.width, window.config.map.height);

        this.onResize();

        if (typeof(ready) == "function") {
            window.setTimeout(function() {
                ready();
            }, 500);
        }
    }

    onResize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        var map_ratio = this.map.canvas.width / this.map.canvas.height;
        var canvas_ratio = this.width / this.height;
        if (map_ratio > canvas_ratio) {
            var width = this.width;
            var height = width / map_ratio;
        } else {
            var height = this.height;
            var width = height * map_ratio;
        }
        var left = (this.width - width) / 2;
        var top = (this.height - height) / 2;

        this.mapsize = {
            top: top,
            left: left,
            width: width,
            height: height
        };

        this.entsize = {
            width: 1,
            height: 1
        }

        this.maxents = 1000;
    }

    start() {
        this.entities = [];

        window.setInterval(function() {
            window.maincontroller.fastTick();
        }, 10);

        window.setInterval(function() {
            window.maincontroller.slowTick();
        }, 1000);
    }

    slowTick() {
        this.fps = this.fps_temp;
        this.fps_temp = 0;
    }

    calculations() {
        var th = this;

        this.map.season();

        this.entities.forEach(function(ent) {
            ent.step();
            if (ent.food.amount >= 1) {
                var pos = new Pos(ent.pos.x, ent.pos.y);
                var nent = new Entity(pos, ent);
                th.entities.push(nent);
                ent.food.amount = 0.2;
            }
        });

        for (var i = this.entities.length - 1; i >= 0; i--) {
            if (this.entities[i].food.amount <= 0) {
                var pos = this.entities[i].pos;
                if (this.map.isLand(pos)) {
                    var fd = this.map.getFoodData(pos);
                    fd.amount = 1;
                    fd.type = this.entities[i].food.type;
                }
                this.entities.splice(i, 1);
            }
        }

        while (this.entities.length < 10) {
            var pos = new Pos();
            pos.randomize();
            var ent = new Entity(pos);
            this.entities.push(ent);
        }
    }

    draw() {
        var ctx = this.context.normal;
        var ts = this;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);

        this.map.updateCanvas();
        ctx.drawImage(this.map.canvas, this.mapsize.left, this.mapsize.top, this.mapsize.width, this.mapsize.height);

        this.entities.forEach(function(ent) {
            var size = ent.canvas.width / ts.map.canvas.width * ts.mapsize.width;
            var left = ts.mapsize.left + ent.pos.x / ts.map.width * ts.mapsize.width - (size / 2);
            var top = ts.mapsize.top + ent.pos.y / ts.map.height * ts.mapsize.height - (size / 2);

            ent.updateCanvas();
            ctx.drawImage(ent.canvas, left, top, size, size);
        });

        ctx.fillStyle = "red";
        ctx.font = "18px Arial";
        ctx.fillText(this.fps + " FPS", 0, 18 * 1);
        ctx.fillText(this.entities.length + " entities", 0, 18 * 2);
    }

    fastTick() {
        this.fps_temp++;

        this.calculations();
        this.draw();
    }

}

window.onload = function() {
    window.maincontroller = new Controller(function() {
        window.maincontroller.start();
    });
};
