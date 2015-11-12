var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    LessPluginCleanCSS = require('less-plugin-clean-css'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    imageminJpegtran = require('imagemin-jpegtran'),
    connect = require('gulp-connect'),
    port = process.env.port || 5000,
    browserify = require('gulp-browserify'),
    uglyfly = require('gulp-uglyfly'),
    // fontSpider = require('gulp-font-spider'),
    cleancss = new LessPluginCleanCSS({
      advanced: true
    }),
    autoprefix = new LessPluginAutoPrefix({
      browsers: ["ie >= 8", "ie_mob >= 10", "ff >= 26", "chrome >= 30", "safari >= 6", "opera >= 23", "ios >= 5", "android >= 2.3", "bb >= 10"]
    });


//  less-->>css
gulp.task('less', function() {
  gulp.src('./app/less/*.less')
    .pipe(less({
      plugins: [autoprefix, cleancss],
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('./public/css'));
});


//  image-->>min
gulp.task('imgMin',function(){
  gulp.src('./app/img/*.jpg')
    .pipe(imageminJpegtran({progressive:true})())
    .pipe(gulp.dest('./public/img'));
});


//  web-->>http://localhost:5000
gulp.task('connect',function(){
  connect.server({
    // root:'./',
    port: port,
    livereload: true,
  })
})


//  livereload-->>html,css,js
gulp.task('js',function(){
  gulp.src('./js/**/*.js')
  .pipe( connect.reload() )
})
gulp.task('html',function(){
  gulp.src('./index.html')
  .pipe( connect.reload() )
});
gulp.task('css',function(){
  gulp.src('./public/css/*.css')
  .pipe( connect.reload() )
});


//  browserify-->>main.js
gulp.task('browserify',function(){
  gulp.src('./app/js/main.js')
  .pipe(browserify({
    transform: 'reactify',
  }))
  .pipe(gulp.dest('./app/combine'))
});

//  js-->>compress
gulp.task('compress', function() {
  gulp.src('./app/combine/*.js')
    .pipe(uglyfly())
    .pipe(gulp.dest('./public/js/'));
});
// gulp.task('fontspider',function(){
//   gulp.src('./index.html').pipe(fontSpider);
// });

gulp.task('watch', function() {
  gulp.watch('./app/less/*.less', ['less']);
  gulp.watch('./app/js/*.js',['js']);
  gulp.watch('./index.html',['html']);
  gulp.watch('./public/css/*.css',['css']);
  gulp.watch('./app/js/**/*.js',['browserify']);
  gulp.watch('./public/js/*.js',['compress']);
});

gulp.task('default', ['imgMin','less','browserify']);
gulp.task('com', ['compress']);
gulp.task('serve',['imgMin','less','browserify','compress','connect','watch']);

