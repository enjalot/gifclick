// Define our histogram component's controller code
function HistoSquares() {}
// All components have an init function that runs before anything happens
HistoSquares.prototype.init = function() {
  var model = this.model;
  this.array = model.at("array")
  this.sorted = model.ref("sorted", model.sort("array", function(a,b) {
    var ah = d3.rgb(a[0], a[1], a[2]).hsl()
    var bh = d3.rgb(b[0], b[1], b[2]).hsl()
    //console.log(ah.h||0, bh.h||0)
    var h = sort(ah.h || 0, bh.h || 0)
    if(h) return h;
    var s = sort(ah.s || 0, bh.s || 0)
    if(s) return s;
    var l = sort(ah.l || 0, ah.l || 0)
    if(l) return l;
    return 0;
  }));
};
function sort(a,b) {
  if(a < b) { return 1}
  if(a > b) { return -1}
  return 0
}

// create runs after the component (and the DOM) have been loaded.
HistoSquares.prototype.create = function() {
  var that = this;
  var model = this.model;
  //set the data on all the canvas'
  model.on("all", "histo**", function() {
    that.transform();
  })
  //render the initial frame
  this.transform();
};

// This is where we transform the data into a format that's easier to render.
// this is following the d3 pattern of layouts (and copying d3.chart's naming convention)
HistoSquares.prototype.transform = function() {
  var model = this.model;
  var histo = this.getAttribute("histo")
  if(!histo) return;
  var colors = Object.keys(histo);
  var array = []
  var color, rgb, value;
  var max = 0;
  for(var i = 0; i < colors.length; i++) {
    color = colors[i];
    rgb = color.split(",")
    value = histo[color]
    if(value > max) max = value;
    array.push({ value: value, r: +rgb[0], g: +rgb[1], b: +rgb[2]})
  }
  var scale = d3.scale.linear()
  .domain([0, max])
  .range([5, 20])
  for(var i = 0; i < array.length; i++) {
    array[i].scaled = scale(array[i].value)
  }
  array.sort(function(a,b) {
    return b.value - a.value
  })
  model.set("array", array);
};
HistoSquares.prototype.hover = function(color) {
}
HistoSquares.prototype.select = function(color) {
}