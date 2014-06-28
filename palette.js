// Define our histogram component's controller code
function Palette() {}
// All components have an init function that runs before anything happens
Palette.prototype.init = function() {
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
Palette.prototype.create = function() {
  var that = this;
  var model = this.model;
  //set the data on all the canvas'

  model.on("all", "color**", function() {
    that.transform();
  })
  //render the initial frame
  this.transform();
};

// This is where we transform the data into a format that's easier to render.
// this is following the d3 pattern of layouts (and copying d3.chart's naming convention)
Palette.prototype.transform = function() {
};
Palette.prototype.hover = function(color) {
  console.log("hover color", color, d3.rgb(color[0], color[1], color[2]).hsl())
  this.emit("hover", color);
}
Palette.prototype.select = function(color) {
  console.log("select color", color)
  this.emit("select", color);
}