/**
 * Created by dave  2017/7/11
 * 员工离职审批模块
 *
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import Search from './../search/search';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
import Table from './../../../components/table';
import LeaveDetail from './leaveDetail';
import { Pagination, Form, Row, Col, Select, Button, Input } from 'antd';
const [FormItem,Option] = [Form.Item, Select.Option];

class Page extends Component {
	constructor(props) {
		super(props);
		this.state = {
			total: 0,
			pageSize: 30,
			current: 1,
			leaveDetail: props.employee.leaveDetail,
			ModalFlag: props.employee.ModalFlag,
			cityList: [],
			areaList: [],
			dataSource: props.employee.employeeList.data,
			knightColumns: [{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
			}, {
				title: '手机号',
				dataIndex: 'phone',
				key: 'phone',
			}, {
				title: '平台',
				dataIndex: 'platform_list',
				key: 'platform_list',
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
				render: (text) => {
					return aoaoBossTools.enumerationConversion(text);
				}
			}, {
				title: '骑士类型',
				dataIndex: 'job_category_id',
				key: 'job_category_id',
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
				render: (text) => {
					return aoaoBossTools.enumerationConversion(text);
				}
			}, {
				title: '操作',
				dataIndex: '_id',
				key: '_id',
				render: (text, record, index) => {
					return (
						<div>
							<span onClick={this.showDetail.bind(this, index)} className="mgl8 systemTextColor pointer">查看详情</span>
							{
								record.state != 1 ? '' :
									<span>
										<span onClick={this.employeeLeave.bind(this, record._id)}
													className="mgl8 systemTextColor pointer">同意离职</span>
										<span onClick={this.reject.bind(this, record._id)}
													className="mgl8 systemTextColor pointer">驳回</span>
									</span>
							}

						</div>
					)
				}
			}]
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			leaveDetail: nextProps.employee.leaveDetail,
			dataSource: nextProps.employee.employeeList.data,
			ModalFlag: nextProps.employee.ModalFlag,
		})
	}

	// 员工离职
	employeeLeave(params) {
		const { dispatch } = this.props;
		const departureApproverAccountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
		let value = {
			state: -50,
			staff_id: params,
			departure_approver_account_id: departureApproverAccountId,
			account_id: departureApproverAccountId,
		};
		dispatch({
			type: 'employee/employeeEditE',
			payload: value,
		})
	};

	// 员工离职详情
	showDetail = (params) => {
		const detailValue = this.state.dataSource[params];
		const { dispatch } = this.props;
		dispatch({
			type: 'employee/getEmployeeLeaveDetailR',
			payload: detailValue,
		});
		dispatch({
			type: 'employee/ModalFlagR',
			payload: true,
		});
	};

	// 驳回离职申请
	reject(params) {
		const { dispatch } = this.props;
		const departureApproverAccountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
		let value = {
			state: 50,
			staff_id: params,
			departure_approver_account_id: departureApproverAccountId,
			account_id: departureApproverAccountId,
		};
		dispatch({
			type: 'employee/employeeEditE',
			payload: value,
		})
	}

	// 分页
	pageChange = (page, pageSize) => {
		this.setState({
			current: page,
			pageSize: pageSize,
		});
	};

	// 查询
	handleSubmit = (value) => {
		const { dispatch } = this.props;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				const departureApproverAccountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
				values.departure_approver_account_id = departureApproverAccountId;
				values.limit = 30;
				values.page = 1;
				dispatch({
					type: 'employee/getEmployeeListE',
					payload: values,
				});
				this.props.form.setFields();
			}
		});

	};

	// 生成平台下拉选项
	createPlatformList() {
		const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
		return (dataList.map((item, index) => {
			return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>
		}));
	}

	// 获取城市列表
	platformChange = (data) => {
		const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), data, 'city_name_joint');
		this.setState({
			cityList: cityList,
		})
	};

	// 生成商圈下拉选项
	handleCityChange = (key) => {
		const keyList = aoaoBossTools.getArrayItemIndex(this.state.cityList, key, 'city_spelling');
		const cityData = this.state.cityList;
		let areaArray = [];
		let areaData = [];
		keyList.forEach(function (item, index) {
			areaArray.push(cityData[item].biz_district_list);
		});
		for (var i = 0; i < areaArray.length; i++) {
			areaArray[i].forEach(function (item, index) {
				areaData.push(item);
			})
		}
		this.setState({
			areaList: areaData,
		});
	};

	// 弹窗状态
	changeModalFlag = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'employee/ModalFlagR',
			payload: false,
		})
	};

	render() {
		const props = {
			columns: this.state.knightColumns,
			dataSource: this.state.dataSource,
		};
		const { getFieldDecorator } = this.props.form;
		const positionList = new Permission().searchPositionFilter('jurisdictional_position_list'); // 职位列表
		const jobType = aoaoBossTools.readDataFromLocal(2, 'job_category') || [];  // 工作类型列表
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		const ModalProps = {
			ModalFlag: this.state.ModalFlag,
			detail: this.state.leaveDetail,
		};
		return (
			<div>
				<Form>
					<Row>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`姓名`}>
								{getFieldDecorator(`name`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<Input placeholder="请输入姓名"/>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`手机号`}>
								{getFieldDecorator(`phone`, {
									rules: [{ required: false, message: '请输入手机号', trigger: 'onBlur', type: 'string' }],
								})(
									<Input placeholder="请输入手机号"/>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`职位`}>
								{getFieldDecorator(`position_id_list`, {
									rules: [{ required: false, message: '请选择职位', trigger: 'onBlur', type: 'array' }],
								})(
									<Select placeholder="请选择职位"
													mode="multiple">
										{
											positionList.map((item, index) => {
												return (
													<Option value={item.position_id.toString()} key={index}>{item.position_name}</Option>)
											})
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`状态`}>
								{getFieldDecorator(`state`, {
									rules: [{ required: false, message: '请选择骑士状态', trigger: 'onBlur', type: 'string' }],
									initialValue: '1',
								})(
									<Select onChange={this.stateChange}
													placeholder="请选择骑士状态">
										<Option value={'50'}
														key={50}>在职</Option>
										<Option value={'1'}
														key={1}>离职待审核</Option>
										<Option value={'-50'}
														key={-50}>离职</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`类型`}>
								{getFieldDecorator(`job_category_id`)(
									<Select placeholder="请选择骑士类型"
													mode="multiple">
										{
											jobType.map(function (item, index) {
												return (
													<Option value={item.constant_id.toString()}
																	key={item.constant_id}>{item.constant_name}</Option>
												)
											})
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`平台`}>
								{getFieldDecorator(`platform_code_list`)(
									<Select mode="multiple" placeholder="请选择平台"
													onChange={this.platformChange}>
										{
											this.createPlatformList()
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem label='城市' {...formItemLayout}>
								{getFieldDecorator('city_spelling_list', {
									rules: [{
										type: 'array', message: '请选择城市',
									}, {
										required: false, message: '请选择城市',
									}],
								})(
									<Select placeholder="请选择城市" onChange={this.handleCityChange}
													mode="multiple">
										{
											this.state.cityList.map((item, index) => {
												return (<Option value={item.city_spelling}
																				key={index}>{item.city_name_joint}</Option>)
											})
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem label='商圈' {...formItemLayout}>
								{getFieldDecorator('biz_district_id_list', {
									rules: [{
										type: 'array', message: '请输入身份证号',
									}, {
										required: false, message: '请输入身份证号',
									}],
								})(
									<Select placeholder="请选择商圈" mode="multiple">
										{
											this.state.areaList.map((item, index) => {
												return (
													<Option value={item.biz_district_id}
																	key={item.biz_district_id}>{item.biz_district_name}</Option>
												)
											})
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<Col sm={3}/>
							<Button type="primary" className={`mgr8`} onClick={this.handleSubmit}>查询</Button>
						</Col>
					</Row>
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
					<LeaveDetail {...ModalProps} changeModalFlag={this.changeModalFlag}/>
				</Form>
			</div>
		)
	}

}
Page = Form.create()(Page);
function mapStateToProps({ employee }) {
	return { employee };
}
export default connect(mapStateToProps)(Page);

