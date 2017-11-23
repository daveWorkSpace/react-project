/**
 * Created by dave 2017/09/24
 * 骑士扣款模块
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
			total: props.salaryModel.fillingMoneyList._meta.result_count || 0,
			page: 1,													// 默认页码
			current: 1,												// 默认的高亮页码
			pageSize: 30,
			searchValue: {},
			visible: false,
			type: '',
			orderId: '',
			collectContent: '',
			cityList: [],
			areaList: [],
			selectedRowKeys: [],    // 选中的表格索引
			selectedRows: [],       // 选中的数据
			columns: [{
				title: '单号',
				dataIndex: '_id',
				key: '_id',
			}, {
				title: '城市',
				dataIndex: 'city_name_joint',
				key: 'city_name_joint',
			}, {
				title: '商圈',
				dataIndex: 'biz_district_name',
				key: 'biz_district_name',
			}, {
				title: '扣款年月',
				dataIndex: 'month',
				key: 'month',
			}, {
				title: '扣款金额',
				dataIndex: 'total_money',
				key: 'total_money',
				render: (text) => {
					return aoaoBossTools.enumerationConversion(text);
				}
			}, {
				title: '申请创建日期',
				dataIndex: 'created_date',
				key: 'created_date',
			}, {
				title: '状态',
				dataIndex: 'approval_state',
				key: 'approval_state',
				render: (text) => {
					return aoaoBossTools.enumerationConversion(text);
				}
			}, {
				title: '操作',
				dataIndex: 'id',
				key: 'id',
				width: '145px',
				render: (text, record, index) => {
					return (
						<span>
							<span><Link to={`Salary/FillingMoney/Detail?id=${record._id}`}
										className="mgl8 systemTextColor pointer">查看详情</Link></span>
							<span className="mgl8 systemTextColor pointer"
								  onClick={this.showModal.bind(this, record, 'AGREE')}>同意</span>
							<span className="mgl8 systemTextColor pointer"
								  onClick={this.showModal.bind(this, record, 'RESET')}>驳回</span>
						</span>
					)
				}
			}],
			dataSource: props.salaryModel.fillingMoneyList.data || [],
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: nextProps.salaryModel.fillingMoneyList.data || [],
			total: nextProps.salaryModel.fillingMoneyList._meta.result_count || 0,
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
				const startDate = values.dates && aoaoBossTools.prctoMinute(values.dates[0]._d, 0);
				const endDate = values.dates && aoaoBossTools.prctoMinute(values.dates[1]._d, 0);
				values.month = month;
				if (values.dates) {
					values.start_date = startDate;
					values.end_date = endDate;
				}
				delete values.date;
				delete values.dates;
				values.fund_id = 11001;
				values.page = 1;
				values.limit = 30;
				dispatch({
					type: 'salaryModel/getFillingMoneyListE',
					payload: values,
				});
			}
		});
	};

	// 重置
	handleReset = () => {
		this.props.form.resetFields();
	};

	// 同意对话框
	showModal(record, text) {
		this.setState({
			visible: true,
			type: text,
			orderId: record._id,
		});
		const collectContent = <div>
			<span>
				<Icon type="exclamation-circle" style={{ color: '#ffbf00', fontSize: 18 }}/>
				{` 总人数:${record.total_people}   总金额（元）：${record.total_money}`}
			</span>
			<p>您确定要{`${text == 'AGREE' ? '同意' : '驳回'}`}该薪资申请吗？</p>
		</div>;
		this.setState({
			collectContent: collectContent,
		})
	};

	// 审批同意
	handleOk = () => {
		const { type, orderId } = this.state;
		const { dispatch } = this.props;
		if (type == 'AGREE') {
			dispatch({
				type: 'salaryModel/approveOfKnightSalaryE',
				payload: {
					approval_state: 12002,
					_id: orderId,
				}
			});
		} else {
			dispatch({
				type: 'salaryModel/approveOfKnightSalaryE',
				payload: {
					approval_state: 12003,
					_id: orderId,
				}
			});
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
			type: 'salaryModel/getFillingMoneyListE',
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
							<FormItem label='单号' {...formItemLayout}>
								{getFieldDecorator('order_id', {
									rules: [{ required: false, message: '请输入单号', trigger: 'onBlur', type: 'string' }],
								})(
									<Input placeholder="请输入单号"
										   disabledDate={this.disableDateOfMonth}/>
								)}
							</FormItem>
						</Col>
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
												return <Option value={item.platform_code}
															   key={index}>{item.platform_name}</Option>
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
							<FormItem label='扣款年月' {...formItemLayout}>
								{getFieldDecorator('date', {
									rules: [{ required: false, message: '请选择时间', trigger: 'onBlur', type: 'object' }],
								})(
									<MonthPicker placeholder="请选择月份"
												 disabledDate={this.disableDateOfMonth}/>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem label='申请状态' {...formItemLayout}>
								{getFieldDecorator('state', {
									rules: [{
										type: 'string', message: '请选择申请状态',
									}, {
										required: false, message: '请选择申请状态',
									}],
								})(
									<Select placeholder="请选择申请状态">
										<Option value={`10001`}>待审核</Option>
										<Option value={`10002`}>审核通过</Option>
										<Option value={`10003`}>未通过</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem label='申请日期' {...formItemLayout}>
								{getFieldDecorator('dates', {
									rules: [{ required: false, message: '请选择时间', trigger: 'onBlur', type: 'array' }],
								})(
									<RangePicker
										format={'YYYY-MM-DD'}
										disabledDate={this.disableDateOfMonth}
									/>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<Col sm={3}/>
							<Button type="primary" className={`mgr8`} onClick={this.handleSubmit}>查询</Button>
							<Button className={`mgr8`} onClick={this.handleReset}>重置</Button>
							<Button type="primary"><Link to={`Salary/FillingMoney/Create`}>新建骑士扣款</Link></Button>
						</Col>
					</Row>
				</Form>
				<Table columns={this.state.columns} dataSource={this.state.dataSource}
					   rowKey={(record, index) => {
						   return index;
					   }} pagination={false}/>
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
