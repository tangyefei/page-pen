const path = require('path');
const webpack  = require('webpack');

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: "./dist",
    hot: true
  },
  module: {
    rules: [{
      test: /\.js$/, use: 'babel-loader'
    }],
    rules: [{
      test: /\.scss$/, use: ['style-loader','css-loader','sass-loader']
    }]
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}