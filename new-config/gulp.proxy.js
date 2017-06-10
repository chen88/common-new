import proxyMiddleware from 'http-proxy-middleware';
import yargs from 'yargs';

const argv = yargs.argv;
const debug = argv.debug;
const logLevel = debug ? 'debug' : 'silent';

export function getProxies() {
  const proxy = proxyMiddleware('/test', {
    target: '',
    changeOrigin: true,
    logLevel
  });

  return [
    proxy
  ];
}
