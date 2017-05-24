const webpack = require('webpack');
const conf = require('./../gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('./../../package.json');
const autoprefixer = require('autoprefixer');

module.exports = {
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
        exclude: [/node_modules/, /src-common/, /src-common-wp/],
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
        test: /\.(css|scss)$/,
        loaders: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?minimize!sass-loader!postcss-loader'
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
    new webpack.optimize.UglifyJsPlugin({
      output: {comments: false},
      compress: {unused: true, dead_code: true, warnings: false} // eslint-disable-line camelcase
    }),
    new ExtractTextPlugin('index-[contenthash].css'),
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [autoprefixer]
      }
    })
  ],
  output: {
    path: path.join(process.cwd(), conf.paths.dist),
    filename: '[name]-[hash].js'
  },
  entry: {
    app: `./${conf.path.src('index')}`,
    vendor: Object.keys(pkg.dependencies)
  }
};
