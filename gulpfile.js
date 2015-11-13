var gulp = require('gulp'),
    path = require('path'),
    connect = require('gulp-connect'),
    port = process.env.port || 5000,
    browserify = require('gulp-browserify'),
    uglyfly = require('gulp-uglyfly');


//  web-->>http://localhost:5000
gulp.task('connect',function(){
  connect.server({
    // root:'./',
    port: port,
    livereload: true
  })
})


//  livereload-->>html,css,js
gulp.task('js',function(){
  gulp.src('./app/js/main.js')
})
gulp.task('html',function(){
  gulp.src('./index.html')
  .pipe( connect.reload() )
});
gulp.task('css',function(){
  gulp.src('./public/css/*.css')
  .pipe( connect.reload() )
});


//  browserify and compress
gulp.task('browserify',function(){
  gulp.src('./app/js/main.js')
  .pipe(browserify())
  .pipe(uglyfly())
  .pipe(gulp.dest('./public/js/'))
  .pipe( connect.reload() )
});

gulp.task('browserifyCompress',function(){
  gulp.src('./app/js/main.js')
  .pipe(browserify())
  .pipe(uglyfly())
  .pipe(gulp.dest('./public/js/'));
});

//  js-->>compress
gulp.task('compress', function() {
  gulp.src('./app/combine/*.js')
    .pipe(uglyfly())
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function() {
  gulp.watch('./app/js/*.js',['js']);
  gulp.watch('./index.html',['html']);
  gulp.watch('./public/css/*.css',['css']);
  gulp.watch('./app/js/**/*.js',['browserify']);
});

gulp.task('default', ['browserifyCompress']);
gulp.task('serve',['browserify','compress','connect','watch']);

