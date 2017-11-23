/**
 * Created by dave 2017/4/24
 *  侧栏导航
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router';
import styles from './layout.less';
import superAdmin from './../role/super';
import Permission from './../role/role';
import aoaoBossTools from './../../utils/util';
const SubMenu = Menu.SubMenu;

class Nav extends Component {
	constructor(props) {
		super(props);
		this.state = {
			theme: 'dark',
			current: props.publicModel.key, // 选中高亮的项通过key标识
			navList: props.publicModel.navList, // 菜单导航数据
		}
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({
			current: nextProps.publicModel.key,
			navList: nextProps.publicModel.navList,
		})
	};

	handleClick = (e) => {
		this.setState({
			current: e.key,
		});
		// 通知 Model 层更改面包屑
		const { dispatch } = this.props;
		dispatch({
			type: 'publicModel/navHighLightR',
			payload: e.key,
		})
	};

	render() {
		const roleId = aoaoBossTools.readDataFromLocal(1, 'role_id');
		const navList = new Permission().filterNavItem(roleId) || [];
		return (
			<Menu
				theme={this.state.theme}
				onClick={this.handleClick}
				defaultOpenKeys={['solution']}
				selectedKeys={[this.state.current]}
				mode="inline"
				className={styles.menu}
			>
				{
					navList.map((item, index) => {
						return (
							<SubMenu key={item.iconType} title={<span><Icon type={item.iconType}/><span>{item.title}</span></span>}>
								{
									item.MenuItem.map((item, index) => {
										return (
											item.children === 'true' ?
												<SubMenu key={item.title}
														 className="menu-two-subMenu"
														 title={<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.title}</span>}>
													{
														item.MenuItemChildren.map((item, index) => {
															return (
																<Menu.Item key={item.key}><Link to={item.url}>{item.text}</Link></Menu.Item>
															)
														})
													}
												</SubMenu> :
												<Menu.Item key={item.key}><Link to={item.url}>{item.text}</Link></Menu.Item>
										)
									})
								}
							</SubMenu>
						)
					})
				}
			</Menu>
		)
	}
}

function mapStateToProps({ publicModel }) {
	return { publicModel }
}
export default connect(mapStateToProps)(Nav);
