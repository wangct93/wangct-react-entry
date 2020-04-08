import React, {PureComponent} from "react";
import {getState, reduxConnect,dispatch} from "../../../es";
import {random} from "wangct-util";

@reduxConnect(({global}) => ({
  newName:global.newName,
  data:global.data,
}))
export default class Test extends PureComponent {

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
      <p onClick={this.doTest}>{
        this.props.newName
      }</p>

      <p onClick={this.doTest2}>{JSON.stringify(this.props.data)}</p>
    </div>
  }
}
