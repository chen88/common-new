const gulp = require('gulp');
const browserSync = require('browser-sync');
const spa = require('browser-sync-spa');
const webpackDevMiddleware = require('webpack-dev-middleware');
const gUtil = require('gulp-util');
// const webpackHotMiddleware = require('webpack-hot-middleware');

const conf = require('./../gulp.conf');
let gulpProxyPath = './../../gulp-proxies';
let browserSyncConf;
let browserSyncDistConf;

try {
  browserSyncConf = require(gulpProxyPath).dev;
  browserSyncDistConf = require(gulpProxyPath).dist;
} catch (e) {
  gUtil.log(gUtil.colors.yellow('No proxy is enabled'));
  browserSyncConf = function () {
    let server = {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src,
        conf.paths.common
      ]
    };

    return {
      server,
      ghostMode: false,
      notify: false,
      open: false
    };
  };
  browserSyncDistConf = function () {
    return {
      server: {
        baseDir: [
          conf.paths.dist
        ]
      },
      ghostMode: false,
      notify: false,
      open: false
    };
  }
}

browserSync.use(spa());

gulp.task('browsersync', browserSyncServe);
gulp.task('browsersync:dist', browserSyncDist);

function browserSyncServe(done) {
  browserSync.init(browserSyncConf());
  done();
}

function browserSyncDist(done) {
  browserSync.init(browserSyncDistConf());
  done();
}
