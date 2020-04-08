import {random} from "wangct-util";

export default {
  namespace:'global',
  state:{
    name:'wangct',
  },
  watch:{
    'name'(name,data){
      console.log('watch');
      return {
        newName:name + ' wang',
        data:{
          ...data,
          newName:name,
        }
      };
    },
    'data.name'(data){
      console.log('data.name');
      return {
        data:{
          ...data,
          newName:'wangct_' + random(),
        }
      }
    }
  }
}
