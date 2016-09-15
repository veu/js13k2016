const concat = require('gulp-concat');
const gulp = require('gulp');
const zip = require('gulp-zip');
const size = require('gulp-size');

gulp.task('default', ['zip'], function () {
});

gulp.task('concat_js', function () {
  return gulp.src(['src/*.js', 'src/**/*.js'])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy_assets', function () {
  return gulp.src('src/*.{html,css}')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('zip', ['concat_js', 'copy_assets'], function () {
  return gulp.src('dist/*')
    .pipe(zip('dist.zip'))
    .pipe(size({pretty: false, showFiles: true}))
    .pipe(gulp.dest('.'));
})