class Colony {

    constructor() {
        this.color = {
            r: Math.floor(Math.random() * 256),
            g: Math.floor(Math.random() * 256),
            b: Math.floor(Math.random() * 256)
        };

        this.startpos = new Pos();
        this.startpos.randomize();

        this.entities = [];
    }

    spawn(num) {
        if (typeof(num) != "number") {
            num = 1;
        }

        for (var i = 0; i < num; i++) {
            var entpos = new Pos(this.startpos.x, this.startpos.y);
            var ent = new Entity(this, entpos);
            ent.power = Math.floor(Math.random() * 25);
            this.entities.push(ent);
        }
    }

    offsping(ent) {
        var newpos = new Pos(ent.pos.x, ent.pos.y);
        var offspr = new Entity(this, newpos);
        offspr.power = ent.power + Math.floor(Math.random() * 10 - 5);
        this.entities.push(offspr);
    }

    step() {
        for (var i = this.entities.length - 1; i >= 0; i--) {
            this.entities[i].step();
            if (this.entities[i].health <= 0) {
                this.entities.splice(i, 1);
            }
        }
    }
}
