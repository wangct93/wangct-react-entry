import React, {PureComponent} from "react";
import {getState, reduxConnect, dispatch, pathTo} from "../../../es";
import {random} from "wangct-util";

@reduxConnect(({global}) => ({
  newName:global.newName,
  data:global.data,
}))
export default class Test extends PureComponent {

  componentDidMount() {
    console.log('testdidi')
  }

  doTest(){
    dispatch({
      type:'updateField',
      field:'name',
      data:random(),
    })
  }

  doTest2(){
    dispatch({
      type:'updateField',
      field:'name',
      parentField:'data',
      data:random(),
    })
  }

  render() {
    return <div>
      <a onClick={() => pathTo('/test')}>test2</a>
    </div>
  }
}
