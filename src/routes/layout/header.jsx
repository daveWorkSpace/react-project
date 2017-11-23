/**
 * Created by dave 2017/4/24
 *
 * */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Icon } from 'antd';
import styles from './layout.less';
import headerLogo from './static/navLogo@2x.png';
import user from './static/userIcon.png';

class Header extends Component {
  constructor() {
    super();
    this.state = {
      user: '',
    }
  }

  // 接收父级时回调
  componentWillReceiveProps = (nextProps) => {

  };

  // 注销用户
  logout = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'login/loginClear',
			payload: '',
		});
  };

  render() {
    const userInfo = JSON.parse(window.localStorage.getItem('AOAOBOSS'));
    const userName = userInfo && userInfo.name && userInfo.name || '用户名获取失败';
		const userPhone = userInfo && userInfo.phone && userInfo.phone || '获取失败';
    return (
      <header className={styles.header}>
        <div className={styles.div1}>
          <img src={headerLogo} alt="趣活科技" className={styles.img}/>
          <span></span>
        </div>
        <div className={styles.div2}>嗷嗷BOSS系统
          <div className={styles.user}>
            <Dropdown overlay={
              <Menu onClick={this.logout} className={styles.logout}>
                <Menu.Item key="1" id={styles.hover}>退出</Menu.Item>
              </Menu>
            }>
              <div className="ant-dropdown-link">
                <div>
                  <img src={user} alt=""/>
                </div>
                &nbsp;<span>{userName}</span>&nbsp;<Icon type="down"/>
              </div>
            </Dropdown>
          </div>
        </div>
      </header>
    )
  }
}
function mapStateToProps({ login }) {
	return { login }
}

export default connect(mapStateToProps)(Header);
