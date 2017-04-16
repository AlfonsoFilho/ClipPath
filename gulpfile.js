
const gulp     = require('gulp');
const through2 = require('through2');
const uglify   = require('gulp-uglify');
const rename   = require('gulp-rename');
const rimraf   = require('rimraf');
const size     = require('gulp-size');

const umdTemplate = (code) => `
(function(root, factory){

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if(typeof exports === 'object') {
    factory(exports);
  } else {
    factory(root);
  }

})(this, function(exports){
  
  'use strict';
  ${code}
});
`;

gulp.task('clean', function(done) {
  rimraf('./dist', done);
});

const wrapUmd = () => through2.obj(function(file, enc, cb){
  file.contents = new Buffer(umdTemplate(file.contents.toString()));
  cb(null, file)
});

gulp.task('js', ['clean'], () => {
  gulp.src('./src/*.js')
    .pipe(wrapUmd())
    .pipe(uglify())
    .pipe(size({
      gzip: true,
      showFiles: true
    }))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['clean', 'js']);