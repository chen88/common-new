var path    = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BannerWebpackPlugin = require('banner-webpack-plugin');
var yargs = require('yargs');
const argv = yargs.argv;

const env = argv.env || 'local';

module.exports = {
  devtool: 'source-map',
  entry: {},
  module: {
    loaders: [
      { test: /\.js$/, exclude: [/node_modules/, /external-libraries/, /test-interface/], loader: 'eslint-loader', enforce: 'pre'},
      { test: /\.json$/, loader: 'json-loader'},
      { test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=10000'},
      { test: /\.(jpe?g|png|gif)$/, loader: 'url-loader?limit=10000&name=images/[name].[ext]'},
      { test: /\.js$/, exclude: /node_modules/, loaders: ['ng-annotate-loader', 'babel-loader']},
      // { test: /\.js$/, exclude: /node_modules/, loaders: ['ng-annotate-loader']},
      { test: /\.html$/, loader: 'raw-loader' },
      { test: /\.(scss|sass)$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.css$/, loader: 'style-loader!css' },
      { test: /(\.pug$|\.jade$)/, loaders: ['html-loader', `jade-html-loader?pretty=true`]},
      { test: require.resolve('jquery'), use: [ { loader: 'expose-loader', options: 'jQuery' }, { loader: 'expose-loader', options: '$' } ] },
      { test: require.resolve('./external-libraries/purl'), use: [ { loader: 'expose-loader', options: 'purl' }] },
      { test: require.resolve('moment'), use: [ { loader: 'expose-loader', options: 'moment' } ] },
      { test: require.resolve('lodash'), use: [ { loader: 'expose-loader', options: '_' } ] },
      { test: require.resolve('crypto-js'), use: [ { loader: 'expose-loader', options: 'CryptoJS' } ] },
      { test: require.resolve('angular'), use: [ { loader: 'expose-loader', options: 'angular' } ] },
    ]
  },
  plugins: [
    new BannerWebpackPlugin({
      chunks: {
          'app': {
              beforeContent: `/* ${new Date()} */\n`,
              // afterContent: ');/**heyman*/',
              // removeBefore: "!",
              // removeAfter: "\\);"
          }
      }
    }),
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    // new HtmlWebpackPlugin({
    //   template: 'app/index.html',
    //   inject: 'body',
    //   hash: true
    // }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'body',
      template: 'app/index.jade',
      hash: true
    }),
    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'app')) === -1;
      }
    })
  ]
};
