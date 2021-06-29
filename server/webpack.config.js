/* eslint-disable import/no-unresolved */
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,

        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  // resolve: {
  //   modules: [path.resolve(__dirname, 'src', 'routes')],
  // },
};
