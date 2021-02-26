const ThreadsPlugin = require('threads-plugin');

module.exports = {
  configureWebpack: config => {
    config.plugins.push(new ThreadsPlugin());
  },
};
