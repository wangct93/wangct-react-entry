import './global.less';
import React from 'react';
import {render as reactDomRender} from 'react-dom';
import Router from './Router';
import { isStr} from "wangct-util";
import {setStore} from "./utils";
import selfModels from './_models';
import {getStore} from './store';

export history from './history';
export * from './request';
export * from './utils';

/**
 * 渲染方法
 */
export function render(elem = 'root'){
  const routesPro = import('./config/routes').then(mod => mod.default);
  const modelsPro = import('./config/models').then(mod => mod.default);
  return Promise.all([routesPro,modelsPro]).then(([routes,models]) => {
    elem = isStr(elem) ? document.getElementById(elem) : elem;
    console.log(models);
    const store = getStore([...models,...selfModels]);
    setStore(store);
    reactDomRender(<Router store={store} routes={routes} />,elem);
  });
}






