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

gulp.task('zip', ['parse', 'copy_assets'], function () {
  return gulp.src('dist/*')
    .pipe(zip('dist.zip'))
    .pipe(size({pretty: false, showFiles: true}))
    .pipe(gulp.dest('.'));
});

gulp.task('parse', ['concat_js'], function (complete) {
  fs.readFile('dist/bundle.js', 'utf8', (err, data) => {
    if (err) throw err;
    try {
      const ast = esprima.parse(data);
      console.log(ast);
      complete();
    } catch (e) {
      throw `Parsing error at ${e.lineNumber}:${e.index} - ${e.description}`;
    }
  });
});