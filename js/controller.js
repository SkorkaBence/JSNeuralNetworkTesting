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

        this.map = new Map(window.config.map, function() {
            window.maincontroller.onResize();
            if (typeof(ready) == "function") {
                ready();
            }
        });

        /*this.map = document.createElement("img");
        this.map.src = "img/" + window.config.map;
        this.map.onload = function() {
            window.maincontroller.onResize();
            if (typeof(ready) == "function") {
                ready();
            }
        };*/

        this.onResize();
    }

    onResize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        var map_ratio = this.map.img.width / this.map.img.height;
        var canvas_ratio = this.width / this.height;
        if (map_ratio > canvas_ratio) {
            var width = Math.min(this.map.img.width, this.width);
            var height = width / map_ratio;
        } else {
            var height = Math.min(this.map.img.height, this.height);
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
            width: 10,
            height: 10
        }

        this.maxents = 1000;
    }

    start() {
        this.colonies = [];

        for (var i = 0; i < 10; i++) {
            var col = new Colony();
            this.colonies.push(col);
            col.spawn(10);
        }

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
        var cnt = 0;

        this.colonies.forEach(function(element) {
            cnt += element.entities.length;
        });

        var killed = 0;

        while (cnt > this.maxents) {
            var minpower = 2147483647;
            var minent = null;

            this.colonies.forEach(function(colonie) {
                colonie.entities.forEach(function(entity) {
                    if (entity.health > 0 && entity.power < minpower) {
                        minpower = entity.power;
                        minent = entity;
                    }
                });
            });

            minent.health = 0;
            cnt--;
            killed++;
        }

        this.colonies.forEach(function(element) {
            element.step();
        });
    }

    draw() {
        var ctx = this.context.normal;
        var ts = this;

        //ctx.rect(0, 0, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.drawImage(this.map.img, this.mapsize.left, this.mapsize.top, this.mapsize.width, this.mapsize.height);

        var entcount = 0;
        var colcount = 0;

        this.colonies.forEach(function(colonie) {
            var color = "rgb(" + colonie.color.r + ", " + colonie.color.g + ", " + colonie.color.b + ")";
            //color = "red";
            ctx.fillStyle = color;

            colonie.entities.forEach(function(entity) {
                var left = ts.mapsize.left + entity.pos.x / ts.map.width * ts.mapsize.width - (ts.entsize.width / 2);
                var top = ts.mapsize.top + entity.pos.y / ts.map.height * ts.mapsize.height - (ts.entsize.height / 2);
                ctx.fillRect(left, top, ts.entsize.width, ts.entsize.height);

                entcount++;
            });

            colcount++;
        });

        ctx.fillStyle = "red";
        ctx.font = "18px Arial";
        ctx.fillText(this.fps + " FPS", 0, 18 * 1);
        ctx.fillText(colcount + " colonies", 0, 18 * 2);
        ctx.fillText(entcount + " entities", 0, 18 * 3);

        this.entitycount = entcount;

        for (var i = 0; i < this.colonies.length; i++) {
            var color = "rgb(" + this.colonies[i].color.r + ", " + this.colonies[i].color.g + ", " + this.colonies[i].color.b + ")";
            ctx.fillStyle = color;
            ctx.fillText("Colony #" + (i + 1) + " - " + this.colonies[i].entities.length, 0, 18 * (4 + i));
        }
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
