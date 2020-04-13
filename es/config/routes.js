import React from 'react';import Async from 'wangct-react/lib/Async';
export default [{path:'/',
component:(props) => <Async {...props} getComponent={() => import('../../src/pages/Layout')} />,
isTab:true,
children:[{path:'/test',
component:(props) => <Async {...props} getComponent={() => import('../../src/pages/Test')} />},
{path:'/',
component:(props) => <Async {...props} getComponent={() => import('../../src/pages/Test2')} />}]}]