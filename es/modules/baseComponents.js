import {PureComponent} from "react";
import {getProps, toPromise} from "wangct-util";

/**
 * 自定义组件
 */
export class DefineComponent extends PureComponent {

  getOptions(){
    return getProps(this).options || [];
  }

  getValue(){
    return getProps(this).value;
  }

  loadOptions(){
    const {loadOptions} = getProps(this);
    if(!loadOptions){
      return;
    }
    toPromise(loadOptions).then(data => {
      this.setState({
        options:data,
      });
    });
  }

  getTextField(){
    return getProps(this).textField || 'text';
  }

  getValueField(){
    return getProps(this).valueField || 'value';
  }

  getItemValue(item){
    return item && item[this.getValueField()];
  }

  getItemText(item){
    return item && item[this.getTextField()];
  }

  setTarget = (target) => {
    this.refTarget = target;
  };

  getTarget(){
    return this.refTarget;
  }

}
