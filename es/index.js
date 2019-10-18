
import store,{getDispatch} from "./modules/store";
import {toPromise} from "wangct-util";
export history from './modules/history';
export request from './modules/request';
export {requestBase} from './modules/request';
import {connect as connectFunc} from 'react-redux';

export const connect = connectFunc;

export function dispatch(...args){
  return getDispatch()(...args);
}

export function getState(){
  return store.getState();
}

export function reduxConnect(...args){
  return connectFunc(...args);
}

export function showLoading(func,message = '操作处理中，请稍候...'){
  dispatch({
    type:'updateField',
    field:'loading',
    data:message,
  });
  toPromise(func).finally(() => {
    dispatch({
      type:'updateField',
      field:'loading',
    });
  })
}

export function pathTo(path,state,hash){
  if(hash){
    path += location.search;
  }
  return history.push(path,state);
}
