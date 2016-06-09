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

gulp.task('sass', function () {
  return gulp.src('components/sass/*.scss') 
    .pipe(sass())
    .pipe(gulp.dest('components/css/')) 
    .pipe(browserSync.reload({
	    stream: true
    }))
  });
  
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'components'
    },
  })
})
 
gulp.task('useref', function(){
  return gulp.src('components/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('public'))
});

gulp.task('images', function(){
  return gulp.src('components/img/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(imagemin({
      // Setting interlaced to true
      interlaced: true
    }))
  .pipe(gulp.dest('public/img'))
});

gulp.task('images', function(){
  return gulp.src('components/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('public/img'))
});

gulp.task('fonts', function() {
  return gulp.src('components/fonts/**/*')
  .pipe(gulp.dest('public/fonts'))
})

gulp.task('clean:public', function() {
  return del.sync('public');
})

gulp.task('watch',['browserSync', 'sass'], function () {
	gulp.watch('components/sass/*.scss', ['sass']);
	gulp.watch('components/*.html', browserSync.reload); 
	gulp.watch('components/js/*.js', browserSync.reload); 
});

gulp.task('build', function (callback) {
  runSequence('clean:public', 
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})


