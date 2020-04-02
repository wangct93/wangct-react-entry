import {createStore} from "redux";
import {aryToObject, callFunc, isFunc, isPromise, toAry, toStr} from "wangct-util";
import history from './history';

/**
 * 获取store对象
 * @returns {any}
 */
export function getStore(models){
  models = toAry(models);
  const watchMap = aryToObject(models,'namespace',({watch = {}}) => {
    return Object.keys(watch).map((key) => {
      const temp = key.split(',');
      return {
        argNames:temp,
        func:watch[key],
      };
    });
  });

  const initState = aryToObject(models,'namespace',item => item.state);
  delete initState['undefined'];
  extraWatchState(initState,{});

  const store = createStore((state,action) => {
    const [namespace,funcField] = (action.type || '').split('/');
    const {reducers = {},effects = {}} = models.find(item => item.namespace === namespace) || {};
    const updateState = {};
    if(!reducers.update){
      reducers.update = update;
    }
    if(!reducers.updateField){
      reducers.updateField = update;
    }
    if(effects[funcField]){
      const gener = effects[funcField](action,{
        put:put.bind(this,namespace),
        select,
        call
      });
      setTimeout(() => {
        loopGenerator(gener);
      },0);
    }
    if(reducers[funcField]){
      updateState[namespace] = reducers[funcField](state[namespace],action);
    }
    extraWatchState(updateState,state);
    return {
      ...state,
      ...updateState
    };
  },initState);

  /**
   * 附加监听的state
   * @param state
   * @param oldState
   * @returns {*}
   */
  function extraWatchState(state,oldState){
    Object.keys(state).forEach(namespace => {
      let scopeState = state[namespace];
      const oldScopeState = oldState[namespace];
      const changedCache = {};

      /**
       * 字段值是否改变
       * @param field
       * @returns {boolean|*}
       */
      function isChanged(field){
        if(changedCache[field] !== undefined){
          return changedCache[field];
        }
        const result = getValueByWatchField(scopeState,field) !== getValueByWatchField(oldScopeState,field);
        changedCache[field] = result;
        return result;
      }
      toAry(watchMap[namespace]).forEach(({argNames,func}) => {
        const changeBol = argNames.some((argName) => isChanged(argName));
        if(changeBol){
          const args = argNames.map((argName) => {
            return getValueByWatchField(scopeState,argName);
          });
          scopeState = {
            ...scopeState,
            ...func(...args),
          };
        }
      });
      state[namespace] = scopeState;
    });
    return state;
  }

  /**
   * 根据监听字段获取对应值
   * @param state
   * @param field
   * @returns {*}
   */
  function getValueByWatchField(state = {},field){
    toStr(field).split('.').forEach(field => {
      if(state){
        state = state[field];
      }
    });
    return state;
  }

  /**
   * dispatch
   * @param namespace
   * @param action
   * @returns {Promise<any>}
   */
  function put(namespace,action){
    getStoreDispatch(store,namespace)(action);
    return Promise.resolve(action);
  }

  /**
   * 获取state
   * @param func
   * @returns {Promise<any>}
   */
  function select(func){
    return Promise.resolve(func(store.getState()))
  }

  /**
   * 执行异步函数
   * @param args
   * @returns {Promise<*[]>|*}
   */
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

/**
 * 获取store的dispatch
 * @param store
 * @param namespace
 * @returns {function(...[*]=)}
 */
export function getStoreDispatch(store,namespace = 'global'){
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

/**
 * 更新字段
 * @param state
 * @param field
 * @param data
 * @param parentField
 */
function update(state,{field,data,parentField}){
  let extState = field === 'multiple' ? data : {[field]:data};
  if(parentField){
    extState = {
      [parentField]:{
        ...state[parentField],
        ...extState,
      },
    };
  }
  return {
    ...state,
    ...extState
  };
}
