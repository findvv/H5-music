(function() {
  var Frag = require('./modules/fragmentation.js').Frag,
    Loader = require('./modules/preload.js').resLoader,
    placeImage = require('./modules/fragmentation.js').placeImage,
    lyrics = require('./modules/data.js').lyrics,
    musicList = require('./modules/data.js').musicList,
    coverUrl = require('./modules/data.js').coverUrl,
    commentUrl = require('./modules/data.js').commentUrl,
    touchJs = require('./modules/touch-0.2.14.min.js'),
    $ = require('./modules/jquery-2.1.1.min.js'),
    thisIndex = -1,
    musicLength = musicList.length,
    animateLock = true,
    music = new Audio(),
    musicLock = true,
    lyricBegin = 0;

  function pageResponse(d) {
    var c = navigator.userAgent,
      o = c.match(/Windows Phone ([\d.]+)/),
      e = c.match(/(Android);?[\s\/]+([\d.]+)?/),
      b = document.documentElement.clientWidth,
      n = document.documentElement.clientHeight,
      g = b / n,
      q = d.width || 320,
      l = d.height || 504,
      a = q / l,
      m = document.querySelectorAll(d.selectors),
      k = m.length,
      h = d.mode || "auto",
      j = d.origin || "left top 0",
      f = (h == "contain") ? (g > a ? n / l : b / q) : (h == "cover") ? (g < a ? n / l : b / q) : b / q;

    function p(t, s, r) {
      var i = s.style;
      i.width = q + "px";
      i.height = l + "px";
      i.webkitTransformOrigin = j;
      i.transformOrigin = j;
      i.webkitTransform = "scale(" + r + ")";
      i.transform = "scale(" + r + ")";
      if (t == "auto" && e) {
        document.body.style.height = l * r + "px"
      } else {
        if (t == "contain" || t == "cover") {
          i.position = "absolute";
          i.left = (b - q) / 2 + "px";
          i.top = (n - l) / 2 + "px";
          i.webkitTransformOrigin = "center center 0";
          i.transformOrigin = "center center 0";
          if (o) {
            document.body.style.msTouchAction = "none"
          } else {
            document.ontouchmove = function(u) {
              u.preventDefault()
            }
          }
        }
      }
    }
    while (--k >= 0) {
      p(h, m[k], f)
    }
  }

  function showMusic() {
    music.stop();
    lyricBegin = 0;
    $('.control-area').hide();
    $('.control-area').fadeIn(2000, function() {
      musicLock = true;
    });
    myCanvas.init();
  }

  function goLeft() {
    if (animateLock) {
      thisIndex -= 1;
      if (thisIndex == -1) {
        $('.music-page').removeClass('play').hide();
      } else {
        showMusic();
      }

      placeImage(2);
      animateLock = false;
    }
  }

  function goRight() {
    if (animateLock) {
      thisIndex += 1;
      if (thisIndex == musicLength) {
        $('.music-page').removeClass('play').hide();
        $('#over')[0].play();
      } else {
        showMusic();
      }
      placeImage(1);
      animateLock = false;
    }
  }

  Audio.prototype.stop = function() {
    this.pause();
    this.currentTime = 0.0;
  }

  function myCanvas() {
    this.getCanvas = document.getElementById('music-area').getContext('2d');
    this.playInterval = null;
  }
  myCanvas.prototype.init = function() {
    music.src = musicList[thisIndex];
    this.drawCircle();
    this.drawLine();
    this.drawBeginIcon();
  }
  myCanvas.prototype.drawCircle = function() {
    var ctx = this.getCanvas,
      len = musicLength;
    ctx.clearRect(0, 0, 640, 20);
    for (var i = 0; i < len; i++) {
      if (i == thisIndex) {
        ctx.fillStyle = "#cb6d4f";
      } else {
        ctx.fillStyle = "#515153";
      }
      ctx.beginPath();
      var x = 335 - 15 * len + i * 30;
      ctx.arc(x, 6, 6, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  myCanvas.prototype.drawFont = function(n) {
    var ctx = this.getCanvas;
    ctx.clearRect(0, 120, 640, 250);
    ctx.font = "normal normal bold 26px arial";
    ctx.textAlign = "center";
    // 创建渐变
    var gradient = ctx.createLinearGradient(0, 0, 640, 0);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(0.5, "white");
    gradient.addColorStop(1, "black");
    // 用渐变填色
    ctx.fillStyle = gradient;
    if (n == 0) {
      ctx.fillText("", 320, 170);
      ctx.fillText("", 320, 320);
    } else {
      ctx.fillText(lyrics[thisIndex][n - 1].font, 320, 170);
      if (lyrics[thisIndex][n + 1]) {
        ctx.fillText(lyrics[thisIndex][n + 1].font, 320, 320);
      }
    }
    ctx.fillStyle = '#ffffff';
    var lrc = lyrics[thisIndex][n].font
    ctx.fillText(lrc, 320, 245);
  }
  myCanvas.prototype.drawLine = function() {
    var ctx = this.getCanvas;
    ctx.clearRect(0, 60, 640, 10);
    ctx.clearRect(0, 120, 640, 250);
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.rect(0, 60, 640, 10);
    ctx.fill();

  }
  myCanvas.prototype.playMusic = function() {
    var ctx = this.getCanvas,
      that = this;

    ctx.fillStyle = "#ea8a6c";
    ctx.clearRect(570, 30, 70, 70);
    music.play();
    var img = new Image();
    img.src = "././public/img/6.png";
    img.onload = function() {
      var x = 0;
      ctx.drawImage(img, 0, 0, 70, 70, 570, 30, 70, 70);
      that.playInterval = setInterval(function() {
        x += 70;
        if (x == 420) {
          x = 0;
        }
        ctx.drawImage(img, x, 0, 70, 70, 570, 30, 70, 70);
      }, 50);
    }
    music.addEventListener('timeupdate', function() {

      var now = music.currentTime,
        all = music.duration;
      ctx.beginPath();
      ctx.fillStyle = "#ea8a6c";
      ctx.rect(0, 60, now / all * 640, 10);
      ctx.fill();
      if (lyrics[thisIndex][lyricBegin]) { //测试用
        if (now > lyrics[thisIndex][lyricBegin].time) {
          that.drawFont(lyricBegin);
          lyricBegin += 1;
        }
      }
    });
    music.addEventListener('ended', function() {
      ctx.clearRect(570, 30, 70, 70);
      window.clearInterval(that.playInterval);
      var img = new Image();
      img.src = "././public/img/5.png";
      img.onload = function() {
        ctx.drawImage(img, 570, 30);
      }
      musicLock = true;
    }, false);
  }
  myCanvas.prototype.drawBeginIcon = function() {
    var ctx = this.getCanvas;
    ctx.clearRect(570, 30, 70, 70);
    window.clearInterval(this.playInterval);
    var img = new Image();
    img.src = "././public/img/4.png";
    img.onload = function() {
      ctx.drawImage(img, 570, 30);
    }
  }
  var myCanvas = new myCanvas();
  var myFrag = new Frag({
    urls: coverUrl,
    id: 'container',
    imageWidth: 640,
    imageHeight: 1136,
    type: 'down',
    callback: function() {
      animateLock = true;
      if (thisIndex == -1) {
        $('.page0').addClass('play').show();;
        $('#begin')[0].play();
      }
      if (thisIndex == musicLength) {
        $('.page2').addClass('play').show();
      }
    }
  });

  $('.p4').on('click', function() {
    if (animateLock) {
      thisIndex += 1;
      $('.page0').removeClass('play').hide();
      setTimeout(function() {
        $('.music-page').addClass('play').show();
      }, 2000);
      showMusic();
      placeImage(1);
      animateLock = false;
      $('#begin')[0].pause();
      $('#begin')[0].currentTime = 0;
    }
  });
  $('.play-button').on('click', function() {
    if (musicLock) {
      lyricBegin = 0;
      myCanvas.drawLine();
      myCanvas.playMusic();
      musicLock = false;
    }
  });
  $('.b4').on('click', function() {
    window.location.href = commentUrl;
  });
  $('.b3').on('click', function() {
    $('.share-float').show();
  });
  $('.share-float').on('click', function() {
    $(this).hide();
  });
  $('.turn-left').on('click', function() {
    goLeft();
  });
  $('.turn-right').on('click', function() {
    goRight();
  });
  touchJs.touch.on('.music-page', 'swipeleft', function(ev) {
    goRight();
  });
  touchJs.touch.on('.music-page', 'swiperight', function(ev) {
    goLeft();
  });
  var loader = new Loader({
    resources: [
      '././public/img/persons/10.jpg',
      '././public/img/persons/3.jpg',
      '././public/img/persons/8.jpg',
      '././public/img/persons/5.jpg',
      '././public/img/persons/2.jpg',
      '././public/img/persons/7.jpg',
      '././public/img/persons/4.jpg',
      '././public/img/persons/9.jpg',
      '././public/img/persons/1.jpg',
      '././public/img/persons/6.jpg',
      '././public/img/0.jpg',
      '././public/img/1.jpg',
      '././public/img/1.png',
      '././public/img/2.png',
      '././public/img/3.png',
      '././public/img/4.png',
      '././public/img/5.png',
      '././public/img/6.png',
      '././public/img/8.png',
      '././public/img/9.png',
      '././public/img/10.png',
      '././public/img/small.jpg',
      '././public/img/share.png'
    ],
    onStart: function(total) {
      pageResponse({
        selectors: '.all',
        mode: 'contain',
        width: '640',
        height: '1136'
      });
    },
    onProgress: function(current, total) {
      var percent = parseInt(current / total * 100) + '%';
      $('.pace-progress').html(percent);
    },
    onComplete: function(total) {
      $('.loading').hide();
      myFrag.init();
    }
  });
  loader.start();
})();
