const conf = require('./src-common-wp/gulp.conf');
const proxyMiddleware = require('http-proxy-middleware');
const gUtil = require('gulp-util');
const _ = require('lodash');
const argv = require('yargs').argv;

const logLevel = argv.debug ? 'debug' : 'silent';

function getProxies () {
  let defaultProxyUrl = 'http://localhost:8080';
  let defaultRangerProxyUrl = defaultProxyUrl;
  let sentinelPath = '/api/sentinel';
  let sentinelPathRewrite = {};
  gUtil.log(gUtil.colors.yellow('isLocal: ' + argv.local));
  if(argv.local) {
    sentinelPathRewrite = {
      '/api/sentinel': '/sentinel'
    };
  }
  let sentinelProxyUrl = argv.sent || argv.sentinel || defaultProxyUrl;
  let rangerProxyUrl = argv.ranger || defaultRangerProxyUrl;

  gUtil.log(gUtil.colors.yellow('Sentinel Proxying: ' + sentinelProxyUrl));
  gUtil.log(gUtil.colors.yellow('Ranger Proxying: ' + rangerProxyUrl));

  let sentProxy = proxyMiddleware(sentinelPath, {
    target: sentinelProxyUrl,
    changeOrigin: true,
    logLevel,
    pathRewrite: sentinelPathRewrite
  });
  let rangerProxy = proxyMiddleware('/api/ranger', {
    target: rangerProxyUrl,
    changeOrigin: true,
    logLevel,
    pathRewrite: rangerProxyUrl !== defaultProxyUrl ? {'/api/ranger': ''} : {},
  });
  let defaultProxy;
  if(!argv.local) {
    defaultProxy = proxyMiddleware('/api', {
      target: defaultProxyUrl,
      changeOrigin: true,
      logLevel,
    });
  }

  let proxies = [
    sentProxy,
    rangerProxy,
    defaultProxy
  ];

  return proxies;
}

module.exports = {
  dev: function () {
    let server = {
      baseDir: [
        conf.paths.tmp,
        conf.paths.src,
        conf.paths.common
      ]
    };

    server.middleware = getProxies();

    return {
      server,
      ghostMode: false,
      notify: false,
      open: false
    };
  },
  dist: function () {
    let server = {
      baseDir: [
        conf.paths.dist
      ]
    };

    server.middleware = getProxies();
    return {
      server,
      ghostMode: false,
      notify: false,
      open: true
    };
  }
};
