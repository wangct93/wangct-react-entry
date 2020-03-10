const util = require('wangct-server-util');

const {resolve} = util;

module.exports = {
  port:8855,
  output:{
    build:{
      publicPath:'/assets/'
    }
  },
  devServer:{
    open:true,
  },
  routes:[
    {
      path:'/',
      component:'Layout'
    }
  ],
  dynamicImport:true,
  disableCssModules:[
    resolve('node_modules/wangct-react')
  ],
  configOutput:resolve('es/config'),
};


