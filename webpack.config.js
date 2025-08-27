const path = require('path');

module.exports = {
  entry: './static/background-effect/swirl.js', // Path to swirl.js
  output: {
    filename: 'swirl.bundle.js',
    path: path.resolve(__dirname, 'static/background-effect'),
  },
};
