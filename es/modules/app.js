import React, {PureComponent} from 'react';
import {Provider} from "react-redux";
import {LocaleProvider, Modal, Spin} from 'antd';
import ZHCN from 'antd/lib/locale-provider/zh_CN';
import css from './app.less';
import store from './store';
import Router from './router';
import {reduxConnect} from "../index";

export default class APP extends PureComponent {
  render() {
    return <Provider store={store}>
      <LocaleProvider locale={ZHCN}>
        <React.Fragment>
          <Router />
          <Loading />
        </React.Fragment>
      </LocaleProvider>
    </Provider>
  }
}

@reduxConnect(({global}) => ({
  loading:global && global.loading,
}))
class Loading extends PureComponent {
  render() {
    const {loading} = this.props;
    return !!loading && <div className={css.loading_wrap}>
      <div className={css.loading_content}>
        <Spin size="large" spinning tip={loading} />
      </div>
    </div>;
  }
}
