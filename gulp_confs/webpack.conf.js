const webpack = require('webpack');
const conf = require('./../gulp.conf');
const path = require('path');

const merge = require('webpack-merge');
const _ = require('lodash');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BannerWebpackPlugin = require('banner-webpack-plugin');
const autoprefixer = require('autoprefixer');
const argv = require('yargs').argv;

let webpackExt;
try {
  webpackExt = require('./../../conf/webpack.local');
} catch (e) {
  webpackExt = require('./webpack-ext-tmp');
}


let webpackConfig = {
  module: {
    loaders: [
      {
        test: /\.json$/,
        loaders: [
          'json-loader'
        ]
      },
      {
        test: /\.js$/,
        // exclude: [/node_modules/],
        exclude: [/node_modules/, /src-common/, /src-common-wp/, /common-classes/],
        loader: 'eslint-loader',
        enforce: 'pre'
      },
      { test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url-loader?limit=10000&name=images/[name].[ext]'
      },
      {
        test: /\.css$/,
        loaders: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?sourceMap=true&url=false'
        })
      },
      {
        test: /\.scss$/,
        loaders: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?sourceMap=true!sass-loader?sourceMap=true'
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          'ng-annotate-loader',
          'babel-loader'
        ]
      },
      {
        test: /\.html$/,
        loaders: [
          'html-loader'
        ]
      },
      {
        test: /(\.pug$|\.jade$)/,
        loaders: [
          'html-loader', 'jade-html-loader?pretty=true'
        ]
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: 'jQuery'
          },
          {
            loader: 'expose-loader',
            options: '$'
          }
        ]
      },
      {
        test: require.resolve('moment'),
        use: [
          {
            loader: 'expose-loader',
            options: 'moment'
          }
        ]
      },
      {
        test: require.resolve('highstock-release/highstock'),
        use: [
          {
            loader: 'expose-loader',
            options: 'Highcharts'
          }
        ]
      },
      {
        test: require.resolve('lodash'),
        use: [
          {
            loader: 'expose-loader',
            options: '_'
          }
        ]
      },
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    FailPlugin,
    // new webpack.ProvidePlugin({
    //   'window.jQuery': 'jquery',
    //   'jQuery': 'jquery',
    //   '$': 'jquery',
    //   '_': 'lodash',
    //   'moment': 'moment',
    //   'Highcharts': 'highstock-release'
    // }),
    new BannerWebpackPlugin({
      chunks: {
          index: {
              beforeContent: `/* ${new Date()} */\n`,
              // afterContent: ');/**heyman*/',
              // removeBefore: "!",
              // removeAfter: "\\);"
          }
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: conf.path.src('index.jade'),
      chunksSortMode: (chunk1, chunk2) => {
        let orders = ['vendor', 'common', 'index'];
        let order1 = orders.indexOf(chunk1.names[0]);
        let order2 = orders.indexOf(chunk2.names[0]);
        if (order1 > order2) {
          return 1;
        } else if (order1 < order2) {
          return -1;
        } else {
          return 0;
        }
      }
    }),
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['common', 'vendor'],
      filename: '[name].js',
      minChunks: Infinity
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [autoprefixer]
      },
      debug: true
    })
  ],
  devtool: 'source-map',
  output: {
    path: path.join(process.cwd(), conf.paths.tmp),
    filename: '[name].js',
    // chunkFilename: '[id].chunk.js',
  },
  entry: {
    vendor: [
      'jquery',
      'lodash',
      'moment',
      'moment-timezone',
      'moment-business',
      'highstock-release/highstock',
      'highstock-release/highcharts-more',
      'highstock-release/modules/exporting.src'
    ].concat(webpackExt.vendor || [], [
      'angular',
      'angular-animate',
      'angular-clipboard',
      'angular-cookies',
      'angular-file-upload',
      'angular-loading-bar',
      'angular-moment',
      'angular-route',
      'angular-sanitize',
      'angular-toastr',
      'angular-ui-bootstrap',
      'highcharts-ng',
      'ng-csv'
    ], webpackExt.latterVendor || []),
    common: `./${conf.path.common('scripts-es6/common/common.index')}`,
    index: `./${conf.path.src('index')}`
  }
};

// conf.info(JSON.stringify(webpackConfig.entry.vendor, null, 2));
try {
  webpackConfig = merge(webpackConfig, webpackExt.webpackConfig);
} catch (e) {
  console.log(e);
}

module.exports = webpackConfig;
