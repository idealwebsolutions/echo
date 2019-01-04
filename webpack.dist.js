const { join } = require('path');
const { DefinePlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = require('./webpack.config');

module.exports = Object.assign({}, config, {
  output: {
    path: join(__dirname, 'dist'),
    filename: 'echo.build.js', // echo.[hash].bundle.js
    chunkFilename: '[id].[chunkhash].js',
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      chunks: 'async'
    },
    // runtimeChunk: 'single',
    minimizer: [new TerserPlugin()],
    noEmitOnErrors: true
  },
  plugins: config.plugins.concat([
    new CleanWebpackPlugin(['dist'], {
      verbose: true,
      dry: false
    }),
    new DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new CompressionPlugin(),
    new BundleAnalyzerPlugin()
  ])
});
