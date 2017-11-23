/**
 * Created by dave 2017/4/25
 * 操作管理
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './account.less';
import { Table, Button } from 'antd';
import user from './static/account.png';

class Account extends Component {
	constructor() {
		super();
		console.log(this, 'this');
		this.state = {

		}
	}

	componentWillReceiveProps(nextProps,props) {
		console.log(nextProps,props, 'a')
	}

	render() {
		const userInfo = JSON.parse(window.localStorage.getItem('AOAOBOSS'));
		const userName = userInfo && userInfo.name && userInfo.name || '用户名获取失败';
		const userPhone = userInfo && userInfo.phone && userInfo.phone || '获取失败';
		return (
			<div className={styles.account}>
				<div className="textCenter">
					<img src={user} alt=""/>
					<p>{userName}</p>
					<section>{userPhone}</section>
				</div>
			</div>
		)
	}
}
export default connect()(Account);
