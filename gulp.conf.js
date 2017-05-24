'use strict';

/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */
const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');
const _ = require('lodash');

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  common: 'src-common-wp',
  tasks: 'src-common-wp/gulp_tasks',
  target: 'target'
};

exports.path = {};
for (const pathName in exports.paths) {
  if (Object.prototype.hasOwnProperty.call(exports.paths, pathName)) {
    exports.path[pathName] = function () {
      const pathValue = exports.paths[pathName];
      const funcArgs = Array.prototype.slice.call(arguments);
      const joinArgs = [pathValue].concat(funcArgs);
      return path.join.apply(this, joinArgs);
    };
  }
}

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title) {
  return function (err) {
    gutil.log(gutil.colors.red(`[${title}]`), err.toString());
    this.emit('end');
  };
};

exports.alertWrongPaths = function (paths, returnWrongPaths, skipLog) {
  paths = _.isArray(paths) ? paths : [paths]
  var wrongPaths = [];
  _.forEach(paths, function (path) {
    var hasMinimap = /{/.test(path);
    var path = hasMinimap ? path.substring(0, path.indexOf('{')) : path;
    try {
      var isDirectory = fs.statSync(path).isDirectory();
      var isFile = fs.statSync(path).isFile();
      if(!isDirectory && !isFile) {
        wrongPaths.push(path);
      }
    } catch (e) {
      wrongPaths.push(path);
    }
  });

  if(wrongPaths.length) {
    if(returnWrongPaths) {
      return wrongPaths;
    }
    if(!skipLog) {
      gutil.log(gutil.colors.red('The following paths don\'t exist'));
      gutil.log(gutil.colors.red(wrongPaths));
    }
    return true;
  }
  if(returnWrongPaths) {
    return wrongPaths;
  }
  return false;
};

exports.warn = (msg) => {
  gutil.log(gutil.colors.yellow(msg));
};

exports.error = (msg) => {
  gutil.log(gutil.colors.red(msg));
};

exports.info = (msg) => {
  gutil.log(gutil.colors.cyan(msg));
};
