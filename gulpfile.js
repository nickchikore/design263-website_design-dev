var gulp = require ('gulp');
var sass = require ('gulp-sass');
var browserSync = require ('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var gutil = require('gulp-util');

var jsSources = [
  'components/js/lib/jquery.min.js',
  'components/js/lib/bootstrap.js',
  'components/js/lib/slick.min.js',
  'components/js/lib/mustache.js',
  'components/js/lib/dmxFlipGallery.js',
  'components/js/scripts.js'
];

gulp.task('js', function() {
  return gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('public/js/'));
});

gulp.task('sass', function () {
  return gulp.src(['components/sass/*.scss','components/sass/**/*.scss' ])
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('public/css/'))
    .pipe(browserSync.reload({
	    stream: true
    }));
  });

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'components'
    },
  });
});

gulp.task('useref', function(){
  return gulp.src('components/**/index.html')
    .pipe(useref())
    .pipe(gulpIf('components/*.css', cssnano()))
    .pipe(gulp.dest('public/'));
});


gulp.task('images', function(){
  return gulp.src('components/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(imagemin({
      // Setting interlaced to true
      interlaced: true
    }))
  .pipe(gulp.dest('components/img/'));
});

gulp.task('fonts', function() {
  return gulp.src('components/fonts/**/*')
  .pipe(gulp.dest('public/fonts/'));
});

gulp.task('clean:public', function() {
  return del.sync('public/');
});

gulp.task('watch',['browserSync', 'sass'], function () {
	gulp.watch('components/sass/*.scss', ['sass']);
	gulp.watch('components/**/index.html', browserSync.reload);
	gulp.watch('components/js/*.js', browserSync.reload);
});

/*gulp.task('build', function (callback) {
  runSequence('clean:public',
    ['js','sass', 'useref', 'images', 'fonts'],
    callback
  );
});

gulp.task('default', function (callback) {
  runSequence(['js'],
    callback
  );*/
  gulp.task('build', function (callback) {
  runSequence('clean:public',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  );
});

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  );
});
