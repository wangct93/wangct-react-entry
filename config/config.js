const util = require('wangct-server-util');

const {resolve} = util;

module.exports = {
  isTabRouter:true,
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
    // {
    //   path:'/test',
    //   component:'Test'
    // },
    {
      path:'/',
      component:'Layout',
      isTab:true,
      children:[
        {
          path:'/test',
          component:'Test'
        },
        {
          path:'/',
          component:'Test2'
        },
      ]
    }
  ],
  dynamicImport:true,
  disableCssModules:[
    resolve('node_modules/wangct-react')
  ],
  configOutput:resolve('es/config'),
};


