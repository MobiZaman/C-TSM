const path = require('path');
const pkg = require('./package.json');
const camelcase = require('camelcase');
const process = require('process');
const webpack = require('webpack');
const env = process.env;
const NODE_ENV = env.NODE_ENV;
const MIN = env.MIN;
const PROD = NODE_ENV === 'production';

let config = {
  devtool: PROD ? false : 'inline-source-map',
  node: {
    fs: "empty"
  },
  entry: './src/index.js',
  output: {
    path: path.join( __dirname ),
    filename: pkg.name + '.js',
    library: camelcase( pkg.name ),
    libraryTarget: 'umd'
  },
  mode: 'none',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
    ]
  },
  externals: PROD ? {
      'cose-base': {
          commonjs2: 'cose-base',
          commonjs: 'cose-base',
          amd: 'cose-base',
          root: 'coseBase'
     },
     'layout-base': {
          commonjs2: 'layout-base',
          commonjs: 'layout-base',
          amd: 'layout-base',
          root: 'layoutBase'
     },
     'path': {
          commonjs2: 'path',
          commonjs: 'path',
          amd: 'path',
          root: 'path'
     }
  } : {},
  plugins: MIN ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false,
      }
    })
  ] : []
};

module.exports = config;
