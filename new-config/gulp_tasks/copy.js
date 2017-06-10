import path from 'path';
import gulp from 'gulp';

import * as conf from './../gulp.conf';

gulp.task('copy', copy);

function copy () {
  return gulp.src([
    path.join(conf.paths.app, '/shc-styles/*.css')
  ]).pipe(gulp.dest(path.join(conf.paths.dist, 'shc-styles')));
}
