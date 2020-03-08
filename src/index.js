
import {dispatch, render} from '../es';
import React from "react";

render();


dispatch({
  type:'updateField',
  field:'routes',
  data:[
    {
      path:'/',
      component:(props) => <div>123</div>
    }
  ]
})
