// Define our histogram component's controller code
function Frame() {}
// All components have an init function that runs before anything happens
Frame.prototype.init = function() {
  var model = this.model;
  this.image = model.at("image")
  this.palette = model.at("palette")
  this.doHisto = model.at("doHisto")
};

// create runs after the component (and the DOM) have been loaded.
Frame.prototype.create = function() {
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
Frame.prototype.transform = function() {
  var model = this.model;
  var that = this;
  var color = model.get("color")

  var image = this.getAttribute("image")
  var palette = this.getAttribute("palette")
  //console.log("image", image)
  var canvas = this.canvas;
  var ctx = canvas.getContext("2d");
  //resize the canvas
  canvas.width = image.width;
  canvas.height = image.height;
  var doHisto = this.getAttribute("doHisto")
  //draw to it
  var histo = draw(image, ctx, palette, {color: color, doHisto: doHisto})
  if(histo)
    model.set("image.histo", histo)
};

Frame.prototype.hovered = function(d) {
  this.emit("data", d);
}

function draw(img, ctx, gct, options) {
  var transparency = options.transparency;
  var color = options.color;
  var doHisto = options.doHisto;

  var ct = img.lctFlag ? img.lct : gct;
  var imgData = ctx.getImageData(img.leftPos, img.topPos, img.width, img.height);
  //apply color table colors
  var cdd = imgData.data;
  var histo = {};
  img.pixels.forEach(function (pixel, i) {
    // imgData.data === [R,G,B,A,R,G,B,A,...]
    px = ct[pixel];
    var count = histo[px.join(",")];
    if(count) {
      histo[px.join(",")]++
    } else {
      histo[px.join(",")] = 1
    }
    if(color && !compare(px, color)) {
      px = desaturate(px, 5,1,4)
    }
    if (pixel !== transparency) {
      cdd[i * 4 + 0] = px[0];
      cdd[i * 4 + 1] = px[1];
      cdd[i * 4 + 2] = px[2];
      cdd[i * 4 + 3] = 255; // Opaque.
    }
  }); 
  imgData.data = cdd;
  ctx.putImageData(imgData, img.leftPos, img.topPos);
  return histo;
}

function desaturate(px, rweight, gweight, bweight) {
  //from http://billmill.org/monotone.html
  //normalize the color weights
  var scale = 1 / (rweight + gweight + bweight);
  rweight *= scale;
  gweight *= scale;
  bweight *= scale;

  var r = px[0];
  var g = px[1];
  var b = px[2];
  var brightness = r * rweight + g * gweight + b * bweight + 50;
  //replace the r, g, and b values of the pixel with "brightness"
  return [brightness, brightness, brightness];
}

function compare(px1, px2) {
  return px1[0] === px2[0] && px1[1] === px2[1] && px1[2] === px2[2]

}