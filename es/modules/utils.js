import store, {getDispatch} from "./store";
import {connect} from "react-redux";
import {aryRemove, isObj, isStr, stringify, toPromise} from "wangct-util";
import history from "./history";
import React from "react";
import {Loading} from 'wangct-react';

/**
 * dispatch
 * @param args
 */
export function dispatch(...args){
  return getDispatch()(...args);
}

/**
 * 获取state
 * @returns {S | S | any | Promise<NavigationPreloadState>}
 */
export function getState(){
  return store.getState();
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
  const {fragmentList = []} = getState().global || {};
  const content = <Loading loading title={message} />;
  dispatch({
    type:'updateField',
    field:'fragmentList',
    data:[...fragmentList,content],
  });
  return toPromise(promise).finally(() => {
    const {fragmentList = []} = getState().global || {};
    aryRemove(fragmentList,content);
    dispatch({
      type:'updateField',
      field:'fragmentList',
      data:[...fragmentList],
    });
  })
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


