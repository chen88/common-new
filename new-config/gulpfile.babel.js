'use strict';

import gulp from 'gulp';
import HubRegistry from 'gulp-hub';
import webpack from 'webpack';
import path from 'path';
import sync from 'run-sequence';
import rename from 'gulp-rename';
import template from 'gulp-template';
import fs from 'fs';
import yargs from 'yargs';
import lodash from 'lodash';
import gutil from 'gulp-util';
import browserSync from 'browser-sync';
import del from 'del';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import colorsSupported from 'supports-color';
import historyApiFallback from 'connect-history-api-fallback';

import {getProxies} from './gulp.proxy';
// Load some files into the registry
const hub = new HubRegistry(['gulp_tasks/*.js']);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);


let root = 'app';
let dist = 'dist';

// helper method for resolving paths
let resolveToApp = (glob = '') => {
  return path.join(root, 'scripts-es6', glob); // app/{glob}
};

// map of all paths
let paths = {
  scss: resolveToApp('**/*.scss'), // stylesheets
  html: [
    resolveToApp('**/*.html'),
    path.join(root, 'index.html')
  ],
  entry: [
    'babel-polyfill',
    path.join(__dirname, root, 'scripts-es6/index.js'),
    path.join(__dirname, 'test-interface/test-interface.index.js'),
  ],
  output: root,
  dest: path.join(__dirname, 'dist')
};

// // use webpack.config.js to build modules
// gulp.task('webpack', gulp.series('clean', 'generateEnv', 'copy', (cb) => {
//   const config = require('./webpack.dist.config');
//   config.entry.app = paths.entry;

//   webpack(config, (err, stats) => {
//     if (err)  {
//       throw new gutil.PluginError("webpack", err);
//     }

//     gutil.log("[webpack]", stats.toString({
//       colors: colorsSupported,
//       chunks: false,
//       errorDetails: true
//     }));

//     cb();
//   });
// }));

gulp.task('build', gulp.series('clean', 'generateEnv', 'copy', (done) => {
  const config = require('./webpack.dev.config');
  config.entry.app = paths.entry;

  webpack(config, (err, stats) => {
    if (err)  {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));
    if (done) {
      done();
      done = null;
    }
  });

}));

gulp.task('serve:dist', gulp.series('build', () => {
  browserSync({
    // port: process.env.PORT || 3000,
    open: true,
    notify: false,
    ghostMode: false,
    server: {baseDir: [dist]},
    middleware: getProxies().concat([
      historyApiFallback()
    ])
  });
}));

gulp.task('serve', () => {
  const config = require('./webpack.local.config');
  config.entry.app = [
    // this modules required to make HRM working
    // it responsible for all this webpack magic
    'webpack-hot-middleware/client?reload=true',
    // application entry point
  ].concat(paths.entry);

  var compiler = webpack(config);

  browserSync({
    // port: process.env.PORT || 3000,
    open: false,
    notify: false,
    ghostMode: false,
    server: {baseDir: [root, '.tmp']},
    middleware: getProxies().concat([
      historyApiFallback(),
      webpackDevMiddleware(compiler, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      }),
      webpackHotMiddleware(compiler)
    ])
  });
});

gulp.task('watch', gulp.series('generateEnv', 'serve'));
gulp.task('default', gulp.series('watch'));
