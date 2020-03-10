import {connect} from "react-redux";
import {aryRemove, isDef, isObj, isStr, stringify, toPromise} from "wangct-util";
import history from "./history";
import React from "react";
import Loading from 'wangct-react/lib/Loading';
import {getStoreDispatch} from "./store";
import {Fields} from "./options";

/**
 * dispatch
 * @param args
 */
export function dispatch(...args){
  return getDispatch()(...args);
}

/**
 * 获取dispatch方法
 * @param namespace
 * @returns {function(...[*]=)}
 */
export function getDispatch(namespace){
  return getStoreDispatch(getStore(),namespace);
}

let globalConfig = {};

/**
 * 获取全局配置
 */
export function getGlobalConfig(key){
  return key ? globalConfig[key] : globalConfig;
}

/**
 * 设置全局配置
 * @param key
 * @param value
 */
export function setGlobalConfig(key,value){
  if(isDef(value)){
    globalConfig[key] = value;
  }else{
    globalConfig = key;
  }
}

/**
 * 获取store
 * @returns {{}}
 */
export function getStore(){
  return getGlobalConfig('store');
}

/**
 * 更新路由
 * @param routes
 */
export function setRoutes(routes){
  dispatch({
    type:Fields.globalNamespace + '/updateField',
    field:'routes',
    data:routes,
  });
}

/**
 * 获取路由
 * @returns {*|{}|[{path: string, component: string}]|[{path: string, component: string}]|Route[]|Requireable<any[]>}
 */
export function getRoutes(){
  const state = getFrameState();
  return state && state.routes;
}

/**
 * 获取框架state
 * @returns {*|{}}
 */
export function getFrameState(){
  return getState()[Fields.globalNamespace] || {};
}

/**
 * 设置store
 * @param store
 */
export function setStore(store){
  return setGlobalConfig('store',store);
}

/**
 * 获取state
 * @returns {S | S | any | Promise<NavigationPreloadState>}
 */
export function getState(){
  return getStore().getState();
}

/**
 * connect别名
 * @param args
 */
export function reduxConnect(...args){
  return connect(...args);
}

/**
 * 显示加载中
 * @param promise
 * @param message
 * @returns {Q.Promise<T> | Promise<any> | Promise<T>}
 */
export function showLoading(promise,message = '操作处理中，请稍候...'){
  const {fragmentList = []} = getFrameState();
  const content = <Loading loading title={message} />;
  dispatch({
    type:'updateField',
    field:'fragmentList',
    data:[...fragmentList,content],
  });
  return toPromise(promise).finally(() => {
    const {fragmentList = []} = getFrameState();
    aryRemove(fragmentList,content);
    dispatch({
      type:'updateField',
      field:'fragmentList',
      data:[...fragmentList],
    });
  });
}

/**
 * 路径跳转
 * @param path
 * @param qsParams
 * @param hash
 */
export function pathTo(path,qsParams = false,hash = false){
  const qsString = isObj(qsParams) ? stringify(qsParams) : qsParams ? location.search.substr(1) : '';
  if(qsString){
    path += path.includes('?') ? '&' : '?';
    path += qsString;
  }
  if(hash){
    path += isStr(hash) ? '#' + hash : location.hash;
  }
  return history.push(path);
}


