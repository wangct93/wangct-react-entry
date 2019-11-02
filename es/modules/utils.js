import store, {getDispatch} from "./store";
import {connect} from "react-redux";
import {isObject, isString, stringify, toPromise} from "wangct-util";
import history from "./history";


export function dispatch(...args){
  return getDispatch()(...args);
}

export function getState(){
  return store.getState();
}

export function reduxConnect(...args){
  return connect(...args);
}

export function showLoading(promise,message = '操作处理中，请稍候...'){
  dispatch({
    type:'updateField',
    field:'loading',
    data:message,
  });
  return toPromise(promise).finally(() => {
    dispatch({
      type:'updateField',
      field:'loading',
    });
  })
}

export function pathTo(path,qsParams = false,hash = false){
  const qsString = isObject(qsParams) ? stringify(qsParams) : qsParams ? location.search.substr(1) : '';
  if(qsString){
    path += path.includes('?') ? '&' : '?';
    path += qsString;
  }
  if(hash){
    path += isString(hash) ? '#' + hash : location.hash;
  }
  return history.push(path);
}


