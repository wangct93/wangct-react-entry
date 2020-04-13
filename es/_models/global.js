import {Fields} from "../options";
import history from '../history';
import config from '../config/config';
const initState = {
  pathname:history.location.pathname,
  isTabRouter: config.isTabRouter,
};

export default {
  namespace: Fields.globalNamespace,
  state: initState,

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    updateField(state,{field,data,parentField}){
      let extState = field === 'multiple' ? data : {[field]:data};
      if(parentField){
        extState = {
          parentField:{
            ...state[parentField],
            ...extState,
          },
        };
      }
      return {
        ...state,
        ...extState
      };
    },
  },
  subscriptions: {
    listenPathname({ history,dispatch}) {
      history.listen((match) => {
        dispatch({
          type:'updateField',
          field:'pathname',
          data:match.pathname
        });
      });
    }
  },
};

