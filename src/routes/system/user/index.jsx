/**
 * Created by dave 2017/4/25
 * 用户管理
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Input, Spin } from 'antd';
import ModalPage from './modal';
import aoaoBossTools from './../../../utils/util';
import permission from './../../../utils/permission';
import Permission from './../../role/role';
import EditModalPage from './edit';
import Search from './search';

class User extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			title: '添加用户',
			content: '',
			columns: [{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				width: '65px',
			}, {
				title: '手机',
				dataIndex: 'phone',
				key: 'phone',
				width: '115px',
			}, {
				title: '角色',
				dataIndex: 'role_id',
				key: 'role_id',
				width: '85px',
				render: (text, record) => {
					return (
						<span>
							{aoaoBossTools.enumerationConversion(text)}
						</span>
					)
				}
			}, {
				title: '平台',
				dataIndex: 'platform_list',
				key: 'platform_list',
				width: '60px',
				render: (text, record) => {
					return (
						<span>{record.platform_list.map((item, index) => {
							return (
								<span
									key={index}>{`${item.platform_name}${ index == record.platform_list.length - 1 ? '' : '、'}`}</span>)
						})}</span>
					)
				}
			}, {
				title: '城市',
				dataIndex: 'city_list',
				key: 'city_list',
				render: (text, record) => {
					return (
						<span>{record.city_list.map((item, index) => {
							return (<span
								key={index}>{`${item.city_name_joint}${ index == record.city_list.length - 1 ? '' : '、'}`}</span>)
						})}</span>
					)
				}
			}, {
				title: '商圈',
				dataIndex: 'biz_district_list',
				key: 'biz_district_list',
				width: '200px',
				render: (text, record) => {
					if (new Permission().userAreaPermission(record.role_id) == true) {
						return (
							<span>{record.biz_district_list.map((item, index) => {
								return (
									<span
										key={index}>{`${item.biz_district_name}${ index == record.biz_district_list.length - 1 ? '' : '、'}`}</span>)
							})}</span>
						)
					} else {
						return '全部';
					}
				}
			}, {
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				width: '60px',
				render: (text, record) => {
					return (
						<span>{text === 100 ? '开启' : '关闭'}</span>
					)
				}
			}, {
				title: '创建时间',
				dataIndex: 'created_at',
				key: 'created_at',
				width: '140px',
				render: (text, record) => {
					return (
						<div>{aoaoBossTools.prctoMinute(record.created_at, 3)}</div>
					)
				}
			}, {
				title: '操作',
				dataIndex: '_id',
				key: '_id',
				width: '45px',
				render: (text, record) => {
					const positionList = new Permission().editFilter('jurisdictional_role_list'); // 职位列表
					const roleCheck = [];
					for (let i = 0; i < positionList.length; i++) {
						roleCheck.push(positionList[i].role_id);
					}
					return (
						roleCheck.indexOf(record.role_id)!=-1?<a className="systemTextColor" onClick={this.showEditPage.bind(this, record)}>编辑</a>: ''
					)
				}
			}],
			dataSource: props.system.accountList.data,
			editPage: 'none',
			userID: '',
			userDetail: '',
			employeeDetail: props.system.employeeDetail,
			cityList: props.system.platformList.cityList,
			areaList: props.system.platformList.areaList,
			supplierList: props.system.allSupplierList.data || [],
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: nextProps.system.accountList.data,
			employeeDetail: nextProps.system.employeeDetail,
			cityList: nextProps.system.platformList.cityList,
			areaList: nextProps.system.platformList.areaList,
			supplierList: nextProps.system.allSupplierList.data || [],
		})
	}

	// 弹窗显示
	showModal = () => {
		this.setState({
			visible: true,
		});
	};
	// 弹窗确认事件
	handleOk = (values) => {
		this.setState({
			visible: false,
			editPage: 'none',
		});
		const { dispatch } = this.props;
		dispatch({
			type: 'system/addAccountE',
			payload: values,
		})
	};

	// 编辑弹窗确认事件
	editHandleOk = (values) => {
		this.setState({
			visible: false,
			editPage: 'none',
		});
		const { dispatch } = this.props;
		// values.supplier_id = this.state.userDetail.supplier_id;
		dispatch({
			type: 'system/updateAccountE',
			payload: values,
		})
	};

	// 弹窗取消事件
	handleCancel = () => {
		this.setState({
			visible: false,
			editPage: 'none',
		});
	};

	handleSubmit = (e) => {
		e.preventDefault();
	};

	// 查询员工列表信息
	getEmployeeList = (value) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'system/getEmployeeListOfAccountE',
			payload: value,
		})
	};

	// 控制编辑页面的加载
	showEditPage = (record) => {
		const { dispatch } = this.props;
		this.setState({
			editPage: 'block',
			userDetail: record,
		});
		dispatch({
			type: 'system/platformListR',
			payload: {},
		});
	};

	// 编辑用户信息
	editModal = () => {
		const props = {
			visible: this.state.visible,
			userDetail: this.state.userDetail,
			cityList: this.state.cityList,
			areaList: this.state.areaList,
		};
		return <div>
			<EditModalPage {...props}
										 handleCancel={this.handleCancel}
										 handleOk={this.editHandleOk}/>
		</div>
	};

	render() {
		const props = {
			visible: this.state.visible,
			title: this.state.title,
			content: this.state.content,
			employeeDetail: this.state.employeeDetail,
			supplierList: this.state.supplierList,
		};

		return (
			<div>
				<Search/>
				<Table pagination={false} columns={this.state.columns} dataSource={this.state.dataSource}
							 rowKey={(record, index) => {
								 return index;
							 }}/>
				<div className="textCenter">
					<Button type="primary" className='mgt8' onClick={this.showModal}>添加用户</Button>
					<ModalPage {...props}
										 handleCancel={this.handleCancel}
										 handleOk={this.handleOk}
										 getEmployeeList={this.getEmployeeList}/>
					{
						this.state.editPage == 'block' ? this.editModal() : ''
					}
				</div>
			</div>
		)
	}
}

function mapStateToProps({ system }) {
	return { system }
}

export default connect(mapStateToProps)(User);
