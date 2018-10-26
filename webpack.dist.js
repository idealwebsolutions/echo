const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = require('./webpack.config');

module.exports = Object.assign({}, config, {
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [new TerserPlugin()]
  },
  plugins: config.plugins.concat([
    new CompressionPlugin(),
    new BundleAnalyzerPlugin()
  ])
});
