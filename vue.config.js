const path = require('path');
const ThreadsPlugin = require('threads-plugin');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

module.exports = {
  configureWebpack: config => {
    config.plugins.push(new ThreadsPlugin());
    config.plugins.push(new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, './rust-wasm'),
      args: '--log-level warn',
      extraArgs: '--no-typescript',
      outDir: path.resolve(__dirname, './src/wasm'),
    }));
  },
};
