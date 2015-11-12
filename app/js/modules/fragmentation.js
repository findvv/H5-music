var Delaunay = require('./delaunay');
var tween = require('./TweenMax.min');
var TWO_PI = Math.PI * 2,
  images = [],
  imageIndex = 0,
  image, imageWidth, imageHeight, len, vertices = [],
  indices = [],
  prevfrag = [],
  fragments = [],
  margin = 50,
  container, clickPosition, callback, type = 1;

function Frag(params) {
  this.urls = params.urls;
  this.imageWidth = params.imageWidth;
  this.imageHeight = params.imageHeight;
  this.callback = params.callback;
  this.id = params.id;
}
Frag.prototype.init = function() {
  var urls = this.urls,
    image;
  len = this.urls.length;
  imageWidth = this.imageWidth;
  imageHeight = this.imageHeight;
  clickPosition = [imageWidth * 0.5, imageHeight * 0.5];
  callback = this.callback;
  container = document.getElementById(this.id);
  TweenMax.set(container, {
    perspective: 500
  });
  images[0] = image = new Image();
  image.src = urls[0];
  image.onload = function() {
    for (var i = 1; i < len; i++) {
      images[i] = image = new Image();
      image.src = urls[i];
      image.width = imageWidth;
      image.height = imageHeight;
    }
    placeImage(1, true);
  };
}
function placeImage(type, begin) {
  if (!begin) {
    if (type == 1) {
      imageIndex += 1;
      if (imageIndex === images.length) {
        imageIndex = 0;
      }
    }
    if (type == 2) {
      imageIndex -= 1;
    }
  }
  image = images[imageIndex];
  var num = Math.random();
  if (num < 0.25) {
    image.direction = "left";
  } else if (num < 0.5) {
    image.direction = "top";
  } else if (num < 0.75) {
    image.direction = "bottom";
  } else {
    image.direction = "right";
  }
  container.appendChild(image);
  image.style.opacity = 0;
  triangulateIn();
}

function triangulateIn() {
  var box = image.getBoundingClientRect(),
    top = box.top,
    left = box.left;
  if (image.direction == "left") {
    clickPosition[0] = 0;
    clickPosition[1] = imageHeight / 2;
  } else if (image.direction == "top") {
    clickPosition[0] = imageWidth / 2;
    clickPosition[1] = 0;
  } else if (image.direction == "bottom") {
    clickPosition[0] = imageWidth / 2;
    clickPosition[1] = imageHeight;
  } else if (image.direction == "right") {
    clickPosition[0] = imageWidth;
    clickPosition[1] = imageHeight / 2;
  }
  triangulate();
  build();
}

function triangulate() {
  for (var i = 0; i < 40; i++) {
    x = -margin + Math.random() * (imageWidth + margin * 2);
    y = -margin + Math.random() * (imageHeight + margin * 2);
    vertices.push([x, y]);
  }
  vertices.push([0, 0]);
  vertices.push([imageWidth, 0]);
  vertices.push([imageWidth, imageHeight]);
  vertices.push([0, imageHeight]);
  vertices.forEach(function(v) {
    v[0] = clamp(v[0], 0, imageWidth);
    v[1] = clamp(v[1], 0, imageHeight);
  });
  indices = Delaunay.triangulate(vertices);
}

function build() {
  var p0, p1, p2, fragment;
  var tl0 = new TimelineMax({
    onComplete: buildCompleteHandler
  });
  for (var i = 0; i < indices.length; i += 3) {
    p0 = vertices[indices[i + 0]];
    p1 = vertices[indices[i + 1]];
    p2 = vertices[indices[i + 2]];
    fragment = new Fragment(p0, p1, p2);
    var dx = fragment.centroid[0] - clickPosition[0],
      dy = fragment.centroid[1] - clickPosition[1],
      d = Math.sqrt(dx * dx + dy * dy),
      rx = 30 * sign(dy),
      ry = 90 * -sign(dx),
      delay = d * 0.003 * randomRange(0.4, 0.6);
    fragment.canvas.style.zIndex = Math.floor(d).toString();
    var tl1 = new TimelineMax();
    if (image.direction == "left") {
      rx = Math.abs(rx);
      ry = 0
    } else if (image.direction == "top") {
      rx = 0;
      ry = Math.abs(ry)
    } else if (image.direction == "bottom") {
      rx = 0;
      ry = -Math.abs(ry)
    } else if (image.direction == "right") {
      rx = -Math.abs(rx);
      ry = 0
    }
    tl1.from(fragment.canvas, 1, {
      z: -50,
      rotationX: rx,
      rotationY: ry,
      scaleX: 0,
      scaleY: 0,
      ease: Cubic.easeIn
    });
    tl1.from(fragment.canvas, 0.4, {
      alpha: 0
    }, 0.6);
    tl0.insert(tl1, delay);
    fragments.push(fragment);
    container.appendChild(fragment.canvas)
  }
}

function buildCompleteHandler() {
  image.style.opacity = 1;
  image.addEventListener('webkitTransitionEnd', function catchTrans() {
    fragments.forEach(function(f) {
      container.removeChild(f.canvas)
    });
    fragments.length = 0;
    vertices.length = 0;
    indices.length = 0;
    callback();
    this.removeEventListener('webkitTransitionEnd', catchTrans, false);
  }, false);
}

function randomRange(min, max) {
  return min + (max - min) * Math.random();
}

function clamp(x, min, max) {
  return x < min ? min : (x > max ? max : x);
}

function sign(x) {
  return x < 0 ? -1 : 1;
}
Fragment = function(v0, v1, v2) {
  this.v0 = v0;
  this.v1 = v1;
  this.v2 = v2;
  this.computeBoundingBox();
  this.computeCentroid();
  this.createCanvas();
  this.clip();
};
Fragment.prototype = {
  computeBoundingBox: function() {
    var xMin = Math.min(this.v0[0], this.v1[0], this.v2[0]),
      xMax = Math.max(this.v0[0], this.v1[0], this.v2[0]),
      yMin = Math.min(this.v0[1], this.v1[1], this.v2[1]),
      yMax = Math.max(this.v0[1], this.v1[1], this.v2[1]);
    this.box = {
      x: Math.round(xMin),
      y: Math.round(yMin),
      w: Math.round(xMax - xMin),
      h: Math.round(yMax - yMin)
    }
  },
  computeCentroid: function() {
    var x = (this.v0[0] + this.v1[0] + this.v2[0]) / 3,
      y = (this.v0[1] + this.v1[1] + this.v2[1]) / 3;
    this.centroid = [x, y];
  },
  createCanvas: function() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.box.w;
    this.canvas.height = this.box.h;
    this.canvas.style.width = this.box.w + 'px';
    this.canvas.style.height = this.box.h + 'px';
    this.canvas.style.left = this.box.x + 'px';
    this.canvas.style.top = this.box.y + 'px';
    this.ctx = this.canvas.getContext('2d');
  },
  clip: function() {
    this.ctx.save();
    this.ctx.translate(-this.box.x, -this.box.y);
    this.ctx.beginPath();
    this.ctx.moveTo(this.v0[0], this.v0[1]);
    this.ctx.lineTo(this.v1[0], this.v1[1]);
    this.ctx.lineTo(this.v2[0], this.v2[1]);
    this.ctx.closePath();
    this.ctx.clip();
    this.ctx.drawImage(image, 0, 0);
    this.ctx.restore();
  }
}
exports.Frag = Frag;
exports.placeImage = placeImage;

