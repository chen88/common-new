const gulp = require('gulp');
const gutil = require('gulp-util');

const webpack = require('webpack');
const webpackConf = require('./../gulp_confs/webpack.conf');
const webpackHotConf = require('./../gulp_confs/webpack.hot.conf');
const webpackDistConf = require('./../gulp_confs/webpack-dist.conf');
const gulpConf = require('./../gulp.conf');
const browsersync = require('browser-sync');

function webpackDev (done) {
  webpackWrapper(false, webpackConf, done);
}

gulp.task('webpack:dev', webpackDev);
gulp.task('webpack:hot', done => {
  webpackWrapper(true, webpackHotConf, done);
});

gulp.task('webpack:watch', done => {
  webpackWrapper(true, webpackConf, done);
});

gulp.task('webpack:dist', done => {
  process.env.NODE_ENV = 'production';
  webpackWrapper(false, webpackDistConf, done);
});

function webpackWrapper(watch, conf, done) {
  const webpackBundler = webpack(conf);

  const webpackChangeHandler = (err, stats) => {
    if (err) {
      gulpConf.errorHandler('Webpack')(err);
    }
    gutil.log(stats.toString({
      colors: true,
      chunks: false,
      hash: false,
      version: false
    }));
    if (done) {
      done();
      done = null;
    } else {
      browsersync.reload();
    }
  };

  if (watch) {
    webpackBundler.watch(200, webpackChangeHandler);
  } else {
    webpackBundler.run(webpackChangeHandler);
  }
}

exports.webpackDev = webpackDev;
