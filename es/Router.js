
import React,{PureComponent} from 'react';
import {Switch,Router,Route} from 'react-router-dom';
import history from './history';
import {Provider} from "react-redux";
import {ConfigProvider} from "antd";
import ZHCN from "antd/lib/locale-provider/zh_CN";
import {dispatch, getFrameState, reduxConnect, setRoutes} from "./utils";

/**
 * 路由组件
 */
export default class RouterMod extends PureComponent {
  render() {
    const {props} = this;
    return <Provider store={props.store}>
      <ConfigProvider locale={ZHCN}>
        <React.Fragment>
          <RouterContent defaultRoutes={props.routes} />
          <Fragment />
        </React.Fragment>
      </ConfigProvider>
    </Provider>
  }
}

/**
 * 路由内容
 */
@reduxConnect(({}) => ({
  routes:getFrameState().routes,
}))
class RouterContent extends PureComponent{

  componentDidMount() {
    setRoutes(this.props.defaultRoutes);
  }

  render(){
    return <Router history={history}>
      {
        getRoutes(this.props.routes)
      }
    </Router>
  }
}

/**
 * 全局组件
 */
@reduxConnect(() => ({
  fragmentList:getFrameState().fragmentList,
}))
class Fragment extends PureComponent {
  render() {
    return <React.Fragment>
      {this.props.fragmentList}
    </React.Fragment>
  }
}

/**
 * 获取路由配置
 * @param routes
 * @param indexPath
 * @returns {*}
 */
function getRoutes(routes,indexPath){
  if(!routes){
    return;
  }
  return <Switch>
    {
      routes.map(({path:routePath,component:RouteComponent = 'div',children = [],indexPath}) => {
        const props = {
          key:routePath,
          path:routePath
        };
        props.render = props => {
          return <RouteComponent {...props}>
            {
              children && children.length && getRoutes(children.map(childRoute => ({...childRoute,path:pathJoin(routePath,childRoute.path)})),indexPath && pathJoin(routePath,indexPath))
            }
          </RouteComponent>
        };
        return <Route {...props} />
      })
    }
    {
      indexPath ? <Route render={() => history.push(indexPath)} exact key="redirectRoute" path="/" /> : ''
    }
  </Switch>
}

/**
 * 路径合并
 * @param args
 * @returns {string}
 */
function pathJoin(...args){
  return args.join('/').replace(/\/+/g,'/');
}
