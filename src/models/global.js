
export default {
  namespace:'global',
  state:{
    name:'wangct',
    data:{
      name:'www',
    }
  },
  watch:{
    name(name){
      return {
        newName:name + ' wang',
        data:{
          newName:name,
        }
      };
    },
  }
}
