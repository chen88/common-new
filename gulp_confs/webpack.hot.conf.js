const webpack = require('webpack');
const conf = require('./../gulp.conf');
const path = require('path');

const _ = require('lodash');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const argv = require('yargs').argv;

module.exports = {
  module: {
    loaders: [
      {
        test: /\.json$/,
        loaders: [
          'json-loader'
        ]
      },
      // {
      //   test: /\.js$/,
      //   // exclude: [/node_modules/],
      //   exclude: [/node_modules/, /src-common/, /src-common-wp/, /common-classes/],
      //   loader: 'eslint-loader',
      //   enforce: 'pre'
      // },
      { test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url-loader?limit=10000&name=images/[name].[ext]'
      },
      // {
      //   test: /\.css$/,
      //   loaders: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: 'css-loader?sourceMap=true&url=false!webpack-module-hot-accept'
      //   })
      // },
      // {
      //   test: /\.scss$/,
      //   loaders: ExtractTextPlugin.extract({
      //     fallback: 'style-loader',
      //     use: 'css-loader?sourceMap=true!sass-loader?sourceMap=true!webpack-module-hot-accept'
      //   })
      // },
      {
        test: /\.(css|scss)$/,
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader',
          'postcss-loader'
        ]
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
        test: require.resolve('highstock-release'),
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
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: conf.path.src('index.jade')
    }),
    // new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [autoprefixer]
      },
      debug: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'source-map',
  output: {
    path: path.join(process.cwd(), conf.paths.tmp),
    filename: '[name].js',
    // chunkFilename: '[id].chunk.js',
  },
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    `./${conf.path.src('index')}`
  ]
};
