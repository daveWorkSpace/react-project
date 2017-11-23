/**
 * Created by dave 2017/4/19
 *
 * */
import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import styles from './error.less';

class Error extends Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <div>
        <div className={styles.error}>
          <div className="errorWrapper">
            <div className='errorPin'></div>
            <div className='errorCode'>
              error
              <span>404</span>
            </div>
            <p>你所找的页面已进入外太空</p>
            <p>请刷新页面或者 <a>
              <Button type="primary"><a href="#/Account">返回首页</a></Button>
            </a></p>
          </div>
        </div>
      </div>
    )
  }
}
export default connect()(Error);
