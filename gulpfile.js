const concat = require('gulp-concat');
const gulp = require('gulp');
const zip = require('gulp-zip');
const size = require('gulp-size');
const esprima = require('esprima');
const fs = require('fs');

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

gulp.task('zip', ['minify', 'copy_assets'], function () {
  return gulp.src('dist/*')
    .pipe(zip('dist.zip'))
    .pipe(size({pretty: false, showFiles: true}))
    .pipe(gulp.dest('.'));
});

gulp.task('minify', ['concat_js'], function (complete) {
  const minified = require("babel-core").transformFile('dist/bundle.js', {
    'plugins': [
    ],
    compact: true,
    minified: true,
    comments: false
  }, function (err, result) {
    if (err) throw err;
    fs.writeFile('dist/bundle.js', result.code, 'utf8', function (err) {
      if (err) throw err;
      complete();
    });
  });
});