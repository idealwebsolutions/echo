const { join } = require('path');
const { NoEmitOnErrorsPlugin } = require('webpack');

module.exports = {
  entry: join(__dirname, 'src/index.js'),
  output: {
    path: join(__dirname, 'dist'),
    filename: 'echo.[hash].js'
  },
  resolve: {
    alias: {
      'react': 'inferno-compat',
      'react-dom': 'inferno-compat'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new NoEmitOnErrorsPlugin()
  ]
};
