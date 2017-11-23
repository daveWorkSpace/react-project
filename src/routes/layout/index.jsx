/**
 * Created by dave 2017/4/24
 *
 * */

import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './layout.less';
import Header from './header';
import Nav from './nav';
import BreadCrumb from './../../components/breadCrumb';

class IndexPage extends Component {
  constructor() {
    super();
    this.state = {}
  }

  render() {
    return (
      <div className={styles.layout}>
        <Header className={styles.header}/>
        <div className={'navbox'}>
          <Nav className={styles.menu}/>
        </div>
        <div className={`content ${styles.contents}`}>
          <BreadCrumb style={{}}/>
          <div>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
export default connect()(IndexPage);


