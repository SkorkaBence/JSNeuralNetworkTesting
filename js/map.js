class Map {

    constructor(img, onload) {
        console.log("Loading map image...");

        this.img = document.createElement("img");
        this.img.src = "img/" + img;

        var mapobj = this;

        this.img.onload = function() {
            console.log("Map image loaded");
            mapobj.loaded();
            onload();
        };
    }

    loaded() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.img.width;
        this.canvas.height = this.img.height;
        this.canvas.getContext('2d').drawImage(this.img, 0, 0, this.img.width, this.img.height);
        console.log("Map canvas created");

        this.width = this.img.width;
        this.height = this.img.height;
    }

    isLand(pos) {
        if (!(pos instanceof Pos)) {
            console.error("Pos class required");
        }

        var pixelData = this.canvas.getContext('2d').getImageData(pos.x, pos.y, 1, 1).data;
        return (pixelData[0] == 0 && pixelData[1] == 255 && pixelData[2] == 0);
    }

    isTaken(pos) {
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
    }

}
