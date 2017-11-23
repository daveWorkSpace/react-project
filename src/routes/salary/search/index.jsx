/**
 * Created by dave 2017/09/24
 * 薪资查询模块
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router';
import { Form, Row, Col, Select, Button, Input, DatePicker, Table, Pagination, Modal, Icon } from 'antd';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
const [FormItem,Option] = [Form.Item, Select.Option];

class IndexPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			total: props.salaryModel.salaryList._meta.result_count || 0,
			page: 1,													// 默认页码
			current: 1,												// 默认的高亮页码
			pageSize: 30,
			searchValue: {},
			visible: false,
			type: '',
			collectContent: '',
			cityList: [],
			areaList: [],
			selectedRowKeys: [],    // 选中的表格索引
			selectedRows: [],       // 选中的数据
			columns: [{
				title: '城市',
				dataIndex: 'city_list',
				key: 'city_list',
				width: '150px',
				render: (text, record) => {
					return (
						<span>{record.city_list && record.city_list.map((item, index) => {
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
							<span>{record.biz_district_list && record.biz_district_list.map((item, index) => {
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
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				width: '115px',
			}, {
				title: '性别',
				dataIndex: 'gender_id',
				key: 'gender_id',
				render: (text) => {
					return aoaoBossTools.enumerationConversion(text);
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
				title: '在职状态',
				dataIndex: 'state',
				key: 'state',
				render: (text) => {
					return aoaoBossTools.enumerationConversion(text);
				}
			}, {
				title: '年月',
				dataIndex: 'month',
				key: 'month',
			}, {
				title: '薪资/元',
				dataIndex: 'salary',
				key: 'salary',
			}, {
				title: '审核状态',
				dataIndex: 'approval_state',
				key: 'approval_state',
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
							<span><Link to={`Salary/Search/Detail?id=${record._id}`}
													className="mgl8 systemTextColor pointer">查看详情</Link></span>
						</span>
					)
				}
			}],
			dataSource: props.salaryModel.salaryList.data || [],
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: nextProps.salaryModel.salaryList.data,
			total: nextProps.salaryModel.salaryList._meta.result_count,
		})
	}

	// 生成平台下拉选项
	createPlatformList() {
		const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
		return dataList;
	}

	// 获取城市列表
	platformChange = (data) => {
		this.props.form.resetFields(['biz_district_id_list', 'city_spelling_list']);
		const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), data, 'city_name_joint');
		this.setState({
			cityList: cityList,
		})
	};

	// 生成商圈下拉选项
	handleCityChange = (key) => {
		this.props.form.resetFields(['biz_district_id_list']);
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

	// 可选时间为当月及之前
	disableDateOfMonth = (current) => {
		return current && current > new Date();
	};

	// 收集查询条件 查询数据
	handleSubmit = () => {
		const { dispatch } = this.props;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				this.setState({
					current: 1,
					page: 1,
				});
				const values = this.props.form.getFieldsValue();
				const month = values.date && aoaoBossTools.prctoMinute(values.date._d, 1);
				delete values.date;
				values.month = month;
				values.page = 1;
				values.limit = 30;
				dispatch({
					type: 'salaryModel/getSalaryListE',
					payload: values,
				});
			}
		});
	};

	// 重置
	handleReset = () => {
		this.props.form.resetFields();
	};

	// 批量选中
	onSelectChange = (selectedRowKeys, selectedRows) => {
		this.setState({ selectedRowKeys, selectedRows });
	};

	// 同意对话框
	showModal = () => {
		this.setState({
			visible: true,
			type: 'AGREE'
		});
		const { selectedRows } = this.state;
		let money = 0;
		let people = selectedRows.length;
		let data = aoaoBossTools.prctoMinute(new Date(), 1);
		selectedRows.map((item, index) => {
			money += item.salary;
			data = item.month;
		});
		const collectContent = <div>
			<span>
				<Icon type="exclamation-circle" style={{ color: '#ffbf00', fontSize: 18 }}/>
				{`年月:${data}   总人数:${people}   总金额（元）：${money}`}
			</span>
			<p>您确定要同意该薪资申请吗？</p>
		</div>;
		this.setState({
			collectContent: collectContent,
		})
	};

	// 驳回对话框
	showModals = () => {
		this.setState({
			visible: true,
			type: 'RESET',
		});
		const { selectedRows } = this.state;
		let money = 0;
		let people = selectedRows.length;
		let data = aoaoBossTools.prctoMinute(new Date(), 1);
		selectedRows.map((item, index) => {
			money += item.salary && item.salary;
			data = item.month && item.month;
		});
		const collectContent = <div>
			<span>
				<Icon type="exclamation-circle" style={{ color: '#ffbf00', fontSize: 18 }}/>
				{`年月:${data}   总人数:${people}   总金额（元）：${money}`}
			</span>
			<p>您确定要驳回该薪资申请吗？</p>
		</div>;
		this.setState({
			collectContent: collectContent,
		})
	};

	// 审批同意
	handleOk = () => {
		const { selectedRows } = this.state;
		const { dispatch } = this.props;
		let idList = [];
		selectedRows.map((item, index) => {
			idList.push(item._id);
		});
		if (selectedRows.length > 0) {
			if (this.state.type == 'AGREE') {
				dispatch({
					type: 'salaryModel/approveOfSalaryE',
					payload: {
						_id_list: idList,
						approval_state: 10002,
					}
				});
			} else {
				dispatch({
					type: 'salaryModel/approveOfSalaryE',
					payload: {
						_id_list: idList,
						approval_state: 10003,
					}
				});
			}
		}
		this.setState({
			visible: false,
			collectContent: '',
		})
	};

	// Modal取消
	handleCancel = () => {
		this.setState({
			visible: false,
			collectContent: '',
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
			type: 'salaryModel/getSalaryListE',
			payload: value,
		})
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { selectedRowKeys } = this.state;
		const positionList = new Permission().searchPositionFilter('jurisdictional_position_list'); // 职位列表
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		return (
			<div className="mgt8">
				<Form>
					<Row>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`平台`}>
								{getFieldDecorator(`platform_code_list`, {
									rules: [{
										type: 'array', message: '请选择平台',
									}, {
										required: false, message: '请选择平台',
									}],
								})(
									<Select mode="multiple" placeholder="请选择平台"
													onChange={this.platformChange}>
										{
											this.createPlatformList().map((item, index) => {
												return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>
											})
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
						<Col sm={6}>
							<FormItem label='年月' {...formItemLayout}>
								{getFieldDecorator('date', {
									rules: [{ required: false, message: '请选择时间', trigger: 'onBlur', type: 'object' }],
								})(
									<MonthPicker placeholder="请选择月份"
															 disabledDate={this.disableDateOfMonth}/>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem label='姓名' {...formItemLayout}>
								{getFieldDecorator('name', {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<Input placeholder="请输入姓名"
												 disabledDate={this.disableDateOfMonth}/>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem label='性别' {...formItemLayout}>
								{getFieldDecorator('gender_id', {
									rules: [{
										type: 'string', message: '请选择性别',
									}, {
										required: false, message: '请选择性别',
									}],
								})(
									<Select placeholder="请选择性别">
										<Option value={`10`}>男</Option>
										<Option value={`20`}>女</Option>
									</Select>
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
							<FormItem label='在职状态' {...formItemLayout}>
								{getFieldDecorator('state', {
									rules: [{
										type: 'string', message: '请选择在职状态',
									}, {
										required: false, message: '请选择在职状态',
									}],
								})(
									<Select placeholder="请选择在职状态">
										<Option value={`50`}>在职</Option>
										<Option value={`1`}>离职待审核</Option>
										<Option value={`-50`}>离职</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem label='审核状态' {...formItemLayout}>
								{getFieldDecorator('approval_state_list', {
									rules: [{
										type: 'string', message: '请选择审核状态',
									}, {
										required: false, message: '请选择审核状态',
									}],
								})(
									<Select placeholder="请选择审核状态">
										<Option value={`10001`}>待审核</Option>
										<Option value={`10002`}>审核通过</Option>
										<Option value={`10003`}>未通过</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<Col sm={3}/>
							<Button type="primary" className={`mgr8`} onClick={this.handleSubmit}>查询</Button>
							<Button className={`mgr8`} onClick={this.handleReset}>重置</Button>
						</Col>
					</Row>
				</Form>
				<Table columns={this.state.columns} dataSource={this.state.dataSource}
							 rowSelection={new Permission().approvalSalary() ? rowSelection : null}
							 rowKey={(record, index) => {
								 return index;
							 }} pagination={false}/>
				{
					new Permission().approvalSalary() && this.state.dataSource.length && this.state.dataSource.length > 0 ?
						<span>
							<Button type="primary" className='mgt8' onClick={this.showModal}>同意</Button>
							<Button className='mgl16 mgt8' onClick={this.showModals}>驳回</Button>
						</span> : ''
				}
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
				<Modal title='确认信息' visible={this.state.visible}
							 onOk={this.handleOk} onCancel={this.handleCancel}
							 okText="确认" cancelText="取消">
					<div className="textCenter">
						{this.state.collectContent}
					</div>
				</Modal>
			</div>
		)
	}
}
function mapStateToProps({ salaryModel }) {
	return { salaryModel }
}

export default connect(mapStateToProps)(Form.create()(IndexPage));
