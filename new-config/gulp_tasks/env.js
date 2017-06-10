import path from 'path';
import gulp from 'gulp';
import rename from 'gulp-rename';
import relace from 'gulp-replace';
import yargs from 'yargs';
import * as conf from './../gulp.conf';

const argv = yargs.argv;
const env = argv.env || 'local';

function generateEnv () {
  return gulp.src([
    `env/env.${env}.js`
  ])
  .pipe(rename('env.generated.js'))
  .pipe(relace(/from '.\//g,  'from \'./../env/'))
  .pipe(gulp.dest('.tmp'));
}

gulp.task('generateEnv', generateEnv);
