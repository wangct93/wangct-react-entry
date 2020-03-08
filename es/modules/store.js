import {createStore} from "redux";
import {aryToObject, callFunc, isFunc, isPromise} from "wangct-util";
import history from './history';
import models from '../config/models';

let store = getStore(models);

export default store;

/**
 * 获取redux对象
 * @param models
 * @returns {any}
 */
export function getStore(models){

  const store = createStore((state,action) => {
    const [namespace,funcField] = (action.type || '').split('/');
    const {reducers = {},effects = {}} = models.find(item => item.namespace === namespace) || {};
    const updateState = {};
    if(effects[funcField]){
      const gener = effects[funcField](action,{
        put:put.bind(this,namespace),
        select,
        call
      });
      loopGenerator(gener);
    }

    if(reducers[funcField]){
      updateState[namespace] = reducers[funcField](state[namespace],action);
    }
    return {
      ...state,
      ...updateState
    }
  },aryToObject(models,'namespace',item => item.state));


  function put(namespace,action){
    getDispatch(namespace)(action);
    return Promise.resolve(action);
  }

  function select(func){
    return Promise.resolve(func(store.getState()))
  }

  function call(...args){
    const target = args[0];
    if(isPromise(target)){
      return target;
    }else if(isFunc(target)){
      return target(...args.slice(1));
    }else{
      return Promise.resolve(args);
    }
  }

  models.forEach(({subscriptions,namespace}) => {
    if(subscriptions){
      Object.keys(subscriptions).forEach(key => {
        callFunc(subscriptions[key],{
          dispatch:getStoreDispatch(store,namespace),
          history
        })
      })
    }
  });
  return store;
}


export function getDispatch(namespace = 'global'){
  return getStoreDispatch(store,namespace);
}

function getStoreDispatch(store,namespace){
  return (action) => {
    store.dispatch({
      ...action,
      type:formatType(action.type,namespace)
    })
  }
}

/**
 * 格式化类型
 * @param type
 * @param namespace
 * @returns {string}
 */
function formatType(type = '',namespace){
  const [typespace,funcField] = type.split('/');
  return funcField ? type : namespace + '/' + typespace
}

/**
 * 循环遍历生成器
 * @param gener
 * @param params
 */
function loopGenerator(gener,params){
  const {value,done} = gener.next(params);
  if(!done){
    if(isPromise(value)){
      value.then(data => {
        loopGenerator(gener,data);
      })
    }else{
      loopGenerator(gener,value);
    }
  }
}
