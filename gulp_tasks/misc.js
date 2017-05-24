const path = require('path');

const gulp = require('gulp');
const del = require('del');
const filter = require('gulp-filter');

const conf = require('./../gulp.conf');
const copyAssets = require('./copy').copyAssets;

gulp.task('clean', clean);
gulp.task('docker', docker);
gulp.task('other', gulp.series(other, copyAssets));
// gulp.task('other', other);

function clean() {
  return del([conf.paths.dist, conf.paths.tmp, conf.paths.target]);
}

function other() {
  const fileFilter = filter(file => file.stat.isFile());

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join(conf.paths.common, '/assets/*'),
    path.join(`!${conf.paths.src}`, '/**/*.{scss,js,html,jade}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(conf.paths.dist));
}


function docker () {
  var dockerFile = 'Dockerfile';
  var initFile = 'init.sh';
  if(!conf.alertWrongPaths(dockerFile)) {
    var sources = [
      dockerFile,
    ];
    if(!conf.alertWrongPaths(initFile)) {
      sources.push(initFile);
    }
    var distSource = [
      path.join(conf.paths.dist, '/**')
    ];
    gulp.src(distSource)
      .pipe(gulp.dest(conf.path.target('dist')));

    return gulp.src(sources)
      .pipe(gulp.dest(conf.paths.target));
  }
  return gulp.src([]);
}
