import {Fields} from "../options";

const initState = {};

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

  },
};

