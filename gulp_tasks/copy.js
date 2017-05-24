const path = require('path');
const conf = require('./../gulp.conf');
const gulp = require('gulp');

function copyJadeTemp () {
  return gulp.src(path.join(conf.paths.common, '/jade-temp/*'))
    .pipe(gulp.dest(path.join(conf.paths.src, '/jade-temp')));
}

function reverseCopyJadeTemp () {
  return gulp.src(path.join(conf.paths.src, '/jade-temp'))
    .pipe(gulp.dest(path.join(conf.paths.common, '/jade-temp/*')));
}

function copyCommonClasses () {
  return gulp.src(path.join(conf.paths.common, '/scripts-es6/common-classes/**'))
    .pipe(gulp.dest(path.join(conf.paths.src, '/app/common-classes')));
}

function reverseCopyCommonClasses () {
  return gulp.src(path.join(conf.paths.src, '/app/common-classes/**'))
    .pipe(gulp.dest(path.join(conf.paths.common, '/scripts-es6/common-classes')));
}

function copyFavi () {
  return gulp.src(path.join(conf.paths.common, '/assets/images/favicon.ico'))
    .pipe(gulp.dest(conf.paths.src));
}

function copyAssets () {
  return gulp.src(conf.path.common('assets/**'))
    .pipe(gulp.dest(conf.path.dist('assets')));
}

gulp.task('copyJadeTemp', copyJadeTemp);
gulp.task('reverseCopyJadeTemp', reverseCopyJadeTemp);
gulp.task('copyCommonClasses', copyCommonClasses);
gulp.task('reverseCopyCommonClasses', reverseCopyCommonClasses);
gulp.task('copyAssets', copyAssets);
gulp.task('copyDefault', gulp.series(copyJadeTemp, copyCommonClasses, copyFavi));

exports.copyAssets = copyAssets;
