import './global.less';
import React from 'react';
import {render as reactDomRender} from 'react-dom';
import Router from './modules/Router';
import {isStr} from "wangct-util";

export history from './modules/history';
export * from './modules/request';
export store,{getDispatch} from './modules/store';
export * from './modules/utils';
export * from './modules/baseComponents';

/**
 * 渲染方法
 */
export function render(elem = 'root'){
  elem = isStr(elem) ? document.getElementById(elem) : elem;
  reactDomRender(<Router />,elem);
}






