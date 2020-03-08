const util = require('wangct-server-util');

const {resolve} = util;

module.exports = {
  port:8855,
  configOutput:resolve('lib/config'),
  output:{
    build:{
      publicPath:'/assets/'
    }
  },
  devServer:{
    open:false,
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
};


