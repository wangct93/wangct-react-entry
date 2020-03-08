
import React,{PureComponent} from 'react';
import {Switch,Router,Route} from 'react-router-dom';
import history from './history';
import {Provider} from "react-redux";
import store from "./store";
import {ConfigProvider} from "antd";
import ZHCN from "antd/lib/locale-provider/zh_CN";
import {DefineComponent} from "./baseComponents";
import {dispatch, reduxConnect} from "./utils";
import routes from "../config/routes";

/**
 * 路由组件
 */
export default class RouterMod extends PureComponent {
  render() {
    return <Provider store={store}>
      <ConfigProvider locale={ZHCN}>
        <React.Fragment>
          <RouterContent />
          <Fragment />
        </React.Fragment>
      </ConfigProvider>
    </Provider>
  }
}

/**
 * 路由内容
 */
@reduxConnect(({global}) => ({
  routes:global && global.routes,
}))
class RouterContent extends PureComponent{

  componentDidMount() {
    dispatch({
      type:'updateField',
      field:'routes',
      data:routes,
    })
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
@reduxConnect(({global}) => ({
  fragmentList:global && global.fragmentList,
}))
class Fragment extends DefineComponent {
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
