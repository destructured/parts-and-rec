'use strict';

const webpack = require('webpack');

module.exports = {
  entry: {
    app: ['./assets/js/main.js']
  },
  output: {
    path: './build',
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/)
  ]
};
