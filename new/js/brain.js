class Brain {

    constructor(ent, mutateBrain) {
        this.owner = ent;

        if (typeof(mutateBrain) != "undefined") {
            this.network = mutateBrain.network.clone();
            this.mutate();
        } else {
            const { Layer, Network } = window.synaptic;

            var inputLayer = new Layer(8);
            var hiddenLayer1 = new Layer(10);
            var hiddenLayer2 = new Layer(10);
            var outputLayer = new Layer(4);

            inputLayer.project(hiddenLayer1);
            hiddenLayer1.project(hiddenLayer2);
            hiddenLayer2.project(outputLayer);

            this.network = new Network({
                input: inputLayer,
                hidden: [hiddenLayer1, hiddenLayer2],
                output: outputLayer
            });

            this.mutate(true);
        }
    }

    mutate(randomize) {
        if (typeof(randomize) == "undefined") {
            randomize = false;
        }

        var mutlayer = function(lay) {
            lay.connectedTo.forEach(function(connto) {
                for (var k in connto.connections){
                    var conn = connto.connections[k];
                    if (randomize) {
                        conn.weight = (Math.random() - 0.5) / 10;
                    } else {
                        conn.weight += (Math.random() - 0.5) / 10000;
                    }
                }
            });
        };

        mutlayer(this.network.layers.input);
        this.network.layers.hidden.forEach(function(l) {
            mutlayer(l);
        });
        mutlayer(this.network.layers.output);
    }

    calculate() {
        //this.mutate();

        var eyepos = this.owner.calculateEyeLocation();
        var foodHere = window.maincontroller.map.getFoodData(this.owner.pos);
        var foodEye = window.maincontroller.map.getFoodData(eyepos);

        var isLandHere = window.maincontroller.map.isLand(this.owner.pos) ? 1 : 0;
        var isLandEye = window.maincontroller.map.isLand(eyepos) ? 1 : 0;
        var myFoodType = this.owner.food.type;
        var foodTypeHere = foodHere.type;
        var foodAmountHere = foodHere.amount;
        var foodTypeHere = foodHere.type;
        var foodAmountEye = foodEye.amount;
        var foodTypeEye = foodEye.type;

        var input = [
            isLandHere,
            isLandEye,
            myFoodType,
            foodTypeHere,
            foodAmountHere,
            foodTypeHere,
            foodAmountEye,
            foodTypeEye
        ];

        var [moveForward, rotateRight, rotateLeft, eatVal] = this.network.activate(input);

        //console.log(moveForward, rotateRight, rotateLeft, eatVal);

        var rotate = rotateRight - rotateLeft;
        var eat = eatVal > 0.5;

        return {
            moveForward: moveForward,
            rotate: rotate,
            eat: eat
        };
    }

}
