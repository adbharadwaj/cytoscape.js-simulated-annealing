const path = require('path');
const pkg = require('./package.json');
const camelcase = require('camelcase');

module.exports = {
    entry: './src/index.js',
    output: {
      path: path.join( __dirname ),
      filename: pkg.name + '.js',
      library: camelcase( pkg.name ),
      libraryTarget: 'umd'
    }
};
