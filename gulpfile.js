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

gulp.task('join_assets', ['minify'], function (complete) {
  fs.readFile('src/index.html', 'utf8', function (err, html) {
    if (err) throw err;
    fs.readFile('dist/bundle.js', 'utf8', function (err, script) {
      if (err) throw err;
      html = html.replace('SCRIPT', script);
      fs.writeFile('dist/index.html', html, function (err) {
        if (err) throw err;
        fs.unlink('dist/bundle.js', function (err) {
          if (err) throw err;
          complete();
        });
      });
    });
  });
});

gulp.task('zip', ['join_assets'], function () {
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