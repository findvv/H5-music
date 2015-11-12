(function() {
  var Frag = require('./modules/fragmentation.js').Frag;
  var Loader = require('./modules/preload.js').resLoader;
  var placeImage = require('./modules/fragmentation.js').placeImage;
  var lyrics = require('./modules/data.js').lyrics;
  var musicList = require('./modules/data.js').musicList;
  var coverUrl = require('./modules/data.js').coverUrl;
  var commentUrl = require('./modules/data.js').commentUrl;
  var touchJs = require('./modules/touch-0.2.14.min.js');
  var $ = require('./modules/jquery-2.1.1.min.js');
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
};
  var thisIndex = -1;
  var musicLength = musicList.length;
  var animateLock = true;
  var music = new Audio();
  var musicLock = true;
  var lyricBegin = 0;
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
    img.src = "http://news.sohu.com/upload/picfragmentzzx/img/6.png";
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
      img.src = "http://news.sohu.com/upload/picfragmentzzx/img/5.png";
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
    img.src = "http://news.sohu.com/upload/picfragmentzzx/img/4.png";
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
      'http://news.sohu.com/upload/picfragmentzzx/img/persons/10.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/persons/3.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/persons/8.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/persons/5.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/persons/2.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/persons/7.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/persons/4.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/persons/9.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/persons/1.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/persons/6.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/0.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/1.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/1.png',
      'http://news.sohu.com/upload/picfragmentzzx/img/2.png',
      'http://news.sohu.com/upload/picfragmentzzx/img/3.png',
      'http://news.sohu.com/upload/picfragmentzzx/img/4.png',
      'http://news.sohu.com/upload/picfragmentzzx/img/5.png',
      'http://news.sohu.com/upload/picfragmentzzx/img/6.png',
      'http://news.sohu.com/upload/picfragmentzzx/img/7.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/8.png',
      'http://news.sohu.com/upload/picfragmentzzx/img/9.png',
      'http://news.sohu.com/upload/picfragmentzzx/img/10.png',
      'http://news.sohu.com/upload/picfragmentzzx/img/small.jpg',
      'http://news.sohu.com/upload/picfragmentzzx/img/share.png'
    ],
    onStart: function(total) {},
    onProgress: function(current, total) {
      var percent = parseInt(current / total * 100) + '%';
      $('.pace-progress').html(percent);
    },
    onComplete: function(total) {
      pageResponse({
        selectors: '.all', //模块选择器，使用querySelectorAll的方法
        mode: 'contain', // auto || contain || cover 
        width: '640', //输入页面的宽度，只支持输入数值，默认宽度为320px
        height: '1136' //输入页面的高度，只支持输入数值，默认高度为504px
      });
      $('.loading').hide();
      myFrag.init();
    }
  });
  loader.start();
})();
