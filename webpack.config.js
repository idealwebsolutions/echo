const { join } = require('path');
const { NoEmitOnErrorsPlugin } = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: join(__dirname, 'src/index.js')/*,
    vendor: [
      'inferno',
      'axios'
      //'firebase/app',
      //'firebase/auth',
      //'firebase/database',
      //'firebase/storage'
    ]*/
  },
  output: {
    path: join(__dirname, 'build'),
    filename: 'echo.build.js', // echo.[hash].bundle.js
    chunkFilename: '[chunkhash].js',
    publicPath: '/assets/'
  },
  resolve: {
    alias: {
      'inferno': join(__dirname, 'node_modules/inferno/dist/index.dev.esm.js'),
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
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
        use: 'file-loader?name=[name].[ext]?[hash]'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.otf(\?.*)?$/,
        use: 'file-loader?name=/fonts/[name].[ext]&mimetype=application/font-otf'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['build'], {
      exclude: ['index.html', 'config.json'],
      verbose: true,
      dry: false
    }),
    new NoEmitOnErrorsPlugin()
  ]
};
