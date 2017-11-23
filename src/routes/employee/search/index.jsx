/**
 * Created by dave  2017/7/11
 * 员工查询模块
 *
 */
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'dva';
import Search from './search';
import Table from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
import KnightLeaveCheck from './knightLeaveCheck';
import { Pagination, Modal } from 'antd';

class Page extends Component {
	constructor(props) {
		super(props);
		this.state = {
			total: 0,
			page: 1,													// 默认页码
			current: 1,												// 默认的高亮页码
			pageSize: 30,
			searchValue: { state: 50 },
			visible: false,
			staffId: '',
			detail: props.employee.employeeDetail,
			dataSource: props.employee.employeeList.data,
			knightColumns: [{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				width: '115px',
			}, {
				title: '手机号',
				dataIndex: 'phone',
				key: 'phone',
				width: '115px',
			}, {
				title: '平台',
				dataIndex: 'platform_list',
				key: 'platform_list',
				width: '60px',
				// TODO 平台数据结构暂不清楚
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
				// TODO 城市列表数据结构暂不清楚
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
				width: '250px',
				render: (text, record) => {
					if (new Permission().knightShow(record.position_id) == true) {
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
				title: '职位',
				dataIndex: 'position_id',
				key: 'position_id',
				width: '80px',
				render: (text) => {
					return aoaoBossTools.enumerationConversion(text);
				}
			}, {
				title: '骑士类型',
				dataIndex: 'job_category_id',
				key: 'job_category_id',
				width: '76px',
				render: (text, record) => {
					if (new Permission().knightTypeShow(record.position_id) == true) {
						return aoaoBossTools.enumerationConversion(text);
					} else {
						return '--';
					}
				}
			}, {
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				width: '115px',
				render: (text) => {
					return aoaoBossTools.enumerationConversion(text);
				}
			}, {
				title: '操作',
				dataIndex: '_id',
				key: '_id',
				width: '145px',
				render: (text, record, index) => {
					return (
						<span>
							<span><Link to={`Employee/Detail?id=${record._id}`} className="mgl8 systemTextColor pointer">查看详情</Link></span>
							{
								new Permission().editEmployeePositionFilter('jurisdictional_position_list', record.position_id) == true ?
									<span><Link to={`Employee/Edit?id=${record._id}`}
															className="mgl8 systemTextColor pointer">编辑</Link></span> : ''
							}

							{
								record.state == -50 || record.position_id <= 2007 || [1007, 1000].indexOf(aoaoBossTools.readDataFromLocal(1, 'role_id')) == -1 ? '' :
									<span onClick={this.employeeLeave.bind(this, record._id)}
												className="mgl8 systemTextColor pointer">离职</span>
							}
						</span>
					)
				}
			}]
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: nextProps.employee.employeeList.data,
			total: nextProps.employee.employeeList._meta.result_count,
			detail: nextProps.employee.employeeDetail,
		})
	}

	// 弹窗显示
	showModal = () => {
		this.setState({
			visible: true,
		});
	};

	// 员工离职
	employeeLeave(params) {
		const { dispatch } = this.props;
		// this.showModal();
		this.setState({
			visible: true,
			staffId: params,
		});
		dispatch({
			type: 'employee/getEmployeeDetailE',
			payload: {
				staff_id: params,
			},
		})
	};

	// 分页
	pageChange = (page, pageSize) => {
		const { dispatch } = this.props;
		this.setState({
			current: page,
			pageSize: pageSize,
		});
		const value = this.state.searchValue;
		value.limit = pageSize;
		value.page = page;
		dispatch({
			type: 'employee/getEmployeeListE',
			payload: value,
		})
	};

	// 弹窗取消事件
	handleCancel = () => {
		this.setState({
			visible: false,
		});
	};

	handleOk = (values) => {
		this.setState({
			visible: false,
		});
		const { dispatch } = this.props;
		const departureApproverAccountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
		values.state = -50;
		values.staff_id = this.state.staffId;
		values.departure_approver_account_id = departureApproverAccountId;
		values.account_id = departureApproverAccountId;
		dispatch({
			type: 'employee/employeeEditE',
			payload: values,
		})
	};

	// 查询
	handleSearch = (value) => {
		const { dispatch } = this.props;
		this.setState({
			searchValue: value,
			current: 1,
		});
		value.limit = this.state.pageSize;
		value.page = this.state.page;
		dispatch({
			type: 'employee/getEmployeeListE',
			payload: value,
		})
	};

	// 导出员工
	exportEmployee = (value) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'employee/exportEmployeeE',
			payload: value,
		})
	};

	render() {
		const props = {
			columns: this.state.knightColumns,
			dataSource: this.state.dataSource,
		};
		return (
			<div>
				<Search search={this.handleSearch}
								export={this.exportEmployee}/>
				<Table {...props}/>
				<div className="fltr">
					{
						this.state.total > 0 ?
							<Pagination onChange={this.pageChange}
													className="mgt8"
													total={this.state.total}
													showTotal={total => `总共 ${total} 条，${this.state.pageSize}条/页 `}
													pageSize={this.state.pageSize}
													current={ this.state.current }/>
							: ''
					}
				</div>
				<KnightLeaveCheck {...{ detail: this.state.detail, visible: this.state.visible }}
													handleCancel={this.handleCancel}
													handleOk={this.handleOk}/>
			</div>
		)
	}

}
function mapStateToProps({ employee }) {
	return { employee };
}
export default connect(mapStateToProps)(Page);

