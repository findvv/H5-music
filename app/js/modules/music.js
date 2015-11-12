define(function(require, exports) {
  var music = new Audio();
  function myCanvas() {
    this.getCanvas = document.getElementById('music-area').getContext('2d');
    this.num = 0; //开始的序号
    this.length = 10; //总共的个数
    this.musicList = ["http://m2.music.126.net/8ImsUrkc42fQsJsq_XbJsA==/3100622790373962.mp3"];
  }
  myCanvas.prototype.init = function() {
    this.drawCircle();
    this.drawLine();
    this.drawIcons();
  }
  myCanvas.prototype.setNum = function(n) {
    this.num = n;
  }
  myCanvas.prototype.drawCircle = function() {
    var ctx = this.getCanvas,
      len = this.length,
      num = this.num;
    ctx.clearRect(0, 0, 640, 20);
    for (var i = 0; i < len; i++) {
      if (i == num) {
        ctx.fillStyle = "#cb6d4f";
      } else {
        ctx.fillStyle = "#515153";
      }
      ctx.beginPath();
      var x = 140 + i * 40;
      ctx.arc(x, 10, 10, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  myCanvas.prototype.drawLine = function() {
    var ctx = this.getCanvas;
    ctx.clearRect(0, 60, 640, 20);
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.rect(0, 60, 640, 20);
    ctx.fill();
  }
  myCanvas.prototype.playMusic = function() {
    var ctx = this.getCanvas,
      musicList = this.musicList,
      num = this.num;
    ctx.fillStyle = "#ea8a6c";
    music.src = musicList[num];
    music.play();
    music.addEventListener('timeupdate', function() {
      var now = Number(music.currentTime),
        all = Number(music.duration);
      ctx.beginPath();
      ctx.rect(0, 60, now / all * 640, 20);
      ctx.fill();
    });
    music.addEventListener('ended', function() {
      var img = new Image();
      img.src = "img/5.png";
      img.onload = function() {
        ctx.drawImage(img, 570, 35);
      }
    }, false);
  }
  myCanvas.prototype.drawIcons = function() {
    var ctx = this.getCanvas;
    var img = new Image();
    img.src = "img/4.png";
    img.onload = function() {
      ctx.drawImage(img, 570, 35);
    }
  }
  exports.myCanvas = myCanvas;
});
