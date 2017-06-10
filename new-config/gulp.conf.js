import fs from 'fs';
import path from 'path';
import gutil from 'gulp-util';
import lodash from 'lodash';

export const paths = {
  app: 'app',
  dist: 'dist',
  tmp: '.tmp',
  target: 'target'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
export function errorHandler (title) {
  return function (err) {
    gutil.log(gutil.colors.red(`[${title}]`), err.toString());
    this.emit('end');
  };
};

export function warn (msg) {
  gutil.log(gutil.colors.yellow(msg));
};

export function error (msg) {
  gutil.log(gutil.colors.red(msg));
};

export function info (msg) {
  gutil.log(gutil.colors.cyan(msg));
};
