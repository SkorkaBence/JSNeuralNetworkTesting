Date.prototype.sqlformat = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();
  var hr = this.getHours();
  var mn = this.getMinutes();
  var sc = this.getSeconds();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm + "-",
          (dd>9 ? '' : '0') + dd + " ",
          (hr>9 ? '' : '0') + hr + ":",
          (mn>9 ? '' : '0') + mn + ":",
          (sc>9 ? '' : '0') + sc
         ].join('');
};
function clearLog() {
    document.getElementById("log").innerHTML = "";
}
function log(text) {
    var elm = document.createElement("div");
    elm.innerHTML = text;
    document.getElementById("log").appendChild(elm);
}
function info(text) {
    var d = new Date();
    log("[INFO " + d.sqlformat() + "] " + text);
}
function error(text) {
    var d = new Date();
    log("[ERROR " + d.sqlformat() + "] " + text);
}

const { Layer, Network } = window.synaptic;
var canvas = document.getElementById('networkcanvas');
var ctx = canvas.getContext('2d');

var inputLayer = new Layer(2);
var hiddenLayer = new Layer(3);
var outputLayer = new Layer(1);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

var myNetwork = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
});

var learningRate = .3;
for (var i = 0; i < 20000; i++) {
    // 0,0 => 0
    myNetwork.activate([0,0]);
    myNetwork.propagate(learningRate, [0]);
    // 0,1 => 1
    myNetwork.activate([0,1]);
    myNetwork.propagate(learningRate, [1]);
    // 1,0 => 1
    myNetwork.activate([1,0]);
    myNetwork.propagate(learningRate, [1]);
    // 1,1 => 0
    myNetwork.activate([1,1]);
    myNetwork.propagate(learningRate, [0]);
}

info("0,0 = " + myNetwork.activate([0,0]));
info("0,1 = " + myNetwork.activate([0,1]));
info("1,0 = " + myNetwork.activate([1,0]));
info("1,1 = " + myNetwork.activate([1,1]));

//info(myNetwork);
