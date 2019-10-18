

const util = require('wangct-server-util');

module.exports = (config) => {
  config.entry = [util.resolve('es/entry.js')];
  return config;
};
