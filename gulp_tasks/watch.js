const path = require('path');
const conf = require('./../gulp.conf');
const gulp = require('gulp');
const watch = require('gulp-watch');
const gulpif = require('gulp-if');
// const browsersync = require('browser-sync');

let allowJadeCopy = true;

function jadeTempCopy () {
  if(!allowJadeCopy) {
    return false;
  }
  allowJadeCopy = false;
  setTimeout(() => {
    allowJadeCopy = true;
  }, 2000);
  return true;
}

function watchJadeTemp () {
  return watch(path.join(conf.paths.common, '/jade-temp/{,*/}*.jade'))
    .pipe(gulpif(jadeTempCopy, gulp.dest(path.join(conf.paths.src, '/jade-temp'))));
}

function watchReverseJadeTemp () {
  return watch(path.join(conf.paths.src, '/jade-temp/{,*/}*.jade'))
    .pipe(gulpif(jadeTempCopy, gulp.dest(path.join(conf.paths.common, '/jade-temp'))));
}

let allowCommonClassesCopy = true;
function commonClassesCopy () {
  if(!allowCommonClassesCopy) {
    return false;
  }
  allowCommonClassesCopy = false;
  setTimeout(() => {
    allowCommonClassesCopy = true;
  }, 2000);
  return true;
}

function watchCommonClasses () {
  return watch(path.join(conf.paths.common, '/scripts-es6/common-classes/{,*/,*/*/}*.js'))
    .pipe(gulpif(commonClassesCopy, gulp.dest(path.join(conf.paths.src, '/app/common-classes'))));
}

function watchReverseCommonClasses () {
  return watch(path.join(conf.paths.src, '/app/common-classes/{,*/,*/*/}*.js'))
    .pipe(gulpif(commonClassesCopy, gulp.dest(path.join(conf.paths.common, '/scripts-es6/common-classes'))));
}

// function watchJadeExtension () {
//   return watch(path.join(conf.paths.src, '/app/{,*/,*/*/,*/*/*/}*.tmp.jade'), () => {
//     browsersync.reload();
//   });
// }

gulp.task('watchJadeTemp', watchJadeTemp);
gulp.task('watchReverseJadeTemp', watchReverseJadeTemp);
gulp.task('watchCommonClasses', watchCommonClasses);
gulp.task('watchReverseCommonClasses', watchReverseCommonClasses);
// gulp.task('watchJadeExtension', watchJadeExtension);

gulp.task('watchCommon', gulp.series(gulp.parallel(
  'watchJadeTemp',
  'watchReverseJadeTemp',
  'watchCommonClasses',
  'watchReverseCommonClasses'
  // 'watchJadeExtension'
)));
