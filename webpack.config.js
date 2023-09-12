const path = require('path');

const appName = 'traffic-logs-kintone-cli';
module.exports = env => {
  return {
    entry: './src/index.ts',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    target: "node",
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    output: {
      filename: appName + '.min.js',
      path: path.resolve('./build'),
      library: appName,
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    optimization: {
      usedExports: true
    }
  };
};