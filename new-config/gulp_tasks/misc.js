import path from 'path';
import gulp from 'gulp';
import del from 'del';
import filter from 'gulp-filter';

import * as conf from './../gulp.conf';

gulp.task('clean', clean);
gulp.task('other', other);

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
