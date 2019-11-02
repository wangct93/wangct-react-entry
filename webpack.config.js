

const {resolve} = require('wangct-server-util');

module.exports = (config) => {
  config.entry = [resolve('es/entry.js'),resolve('src')];
  return config;
};
