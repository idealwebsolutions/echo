const { join } = require('path');
const { NoEmitOnErrorsPlugin } = require('webpack');

module.exports = {
  entry: {
    main: join(__dirname, 'src/index.js')/*,
    vendor: [
      'inferno',
      'firebase/app',
      'firebase/auth',
      'firebase/database',
      'firebase/storage'
    ]*/
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: 'echo.[hash].js',
    chunkFilename: '[chunkhash].js'
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
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new NoEmitOnErrorsPlugin()
  ]
};
