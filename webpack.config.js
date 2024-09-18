const path = require('path');

module.exports = {
  mode: 'development', 
  entry: './src/app.ts',
  output: {
    clean: true,
    filename: '[name].bundle.js',
    chunkFilename: '[name].foo.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devServer: {
    static: './',
    compress: true,
    port: 15050,
},
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
