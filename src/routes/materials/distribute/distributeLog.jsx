/**
 * Created by dave 2017/09/17
 * 采购|报废 -- 采购 | 报废记录
 *
 */
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, Input, DatePicker, Badge, Pagination } from 'antd';
import Table from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const [FormItem,Option] = [Form.Item, Select.Option];

class DistributeLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			total: props.materials.distributeLogList._meta.result_count || 0,
			cityList: [],
			page: 1,													// 默认页码
			current: 1,												// 默认的高亮页码
			pageSize: 30,
			searchValue: {},
			columns: [{
				title: '单号',
				dataIndex: '_id',
				key: '_id',
			}, {
				title: '城市',
				dataIndex: 'city_name_joint',
				key: 'city_name_joint',
			}, {
				title: '操作类型',
				dataIndex: 'handle_type',
				key: 'handle_type',
				render: (text) => {
					return (<span>
						{aoaoBossTools.enumerationConversion(text)}
					</span>)
				}
			}, {
				title: '操作数量',
				dataIndex: 'handle_amount',
				key: 'handle_amount',
			}, {
				title: '申请创建时间',
				dataIndex: 'created_at',
				key: 'created_at',
				render: (text) => {
					return (<span>
						{aoaoBossTools.prctoMinute(text, 3)}
					</span>)
				}
			}, {
				title: '状态',
				dataIndex: 'flow_state',
				key: 'flow_state',
				render: (text, record) => {
					let status = 'success';
					const success = [9002, 9005, 9008, 9014, 9011];
					const error = [9003, 9006, 9009, 9015];
					const warning = [9002, 9005, 9008, 9014];
					if (success.indexOf(text) != -1) {
						status = 'success';
					} else if (error.indexOf(text) != -1) {
						status = 'error';
					} else {
						status = 'warning';
					}
					return (<span>
							<Badge status={status} text={aoaoBossTools.enumerationConversion(text)}/>
					</span>)
				}
			}, {
				title: '状态更新时间',
				dataIndex: 'updated_at',
				key: 'updated_at',
				render: (text) => {
					return (<span>
						{aoaoBossTools.prctoMinute(text, 3)}
					</span>)
				}
			}, {
				title: '操作',
				dataIndex: 'id',
				key: 'id',
				render: (text, record) => {
					return (
						<span>
							<span><Link to={`Materiel/Dispatcher/Detail?id=${record._id}`}
													className="mgl8 systemTextColor pointer">查看详情</Link></span>
							{
								new Permission().agreeDistributeMaterials(record.flow_state) == true ?
									<span>
										<span><Link className="mgl8 systemTextColor pointer"
																onClick={this.agree.bind(this, record)}>同意</Link></span>
										<span><Link className="mgl8 systemTextColor pointer"
																onClick={this.reject.bind(this, record)}>驳回</Link></span>
								</span> : ''
							}
						</span>
					)
				}
			}],
			dataSource: props.materials.distributeLogList.data || [],
			searchValue: {},
		}
	}

	// 接受父级数据
	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: nextProps.materials.distributeLogList.data,
			total: nextProps.materials.distributeLogList._meta.result_count,
		})
	}

	// 生成平台下拉选项
	createPlatformList() {
		const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
		return dataList;
	}

	// 获取城市列表
	platformChange = (data) => {
		this.props.form.resetFields(['city_spelling_list']);
		const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), [data], 'city_name_joint');
		this.setState({
			cityList: cityList,
		})
	};

	// 可选时间为当天及之前
	disableDateOfMonth = (current) => {
		return current && current > new Date();
	};

	// 查询
	handleSearch = () => {
		const { form, dispatch } = this.props;
		form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				// value 是表单的所有的数据，是个对象
				const values = this.props.form.getFieldsValue();
				if (values.platform_code_list) {
					values.platform_code_list = [`${values.platform_code_list}`]; 
				}
				if (values.date) {
					const startDate = aoaoBossTools.prctoMinute(values.date[0]._d, 0);
					const endDate = aoaoBossTools.prctoMinute(values.date[1]._d, 0);
					values.start_date = startDate;
					values.end_date = endDate;
					delete values.date;
				}
				this.setState({
					searchValue: values,
					current: 1,
				});
				values.limit = this.state.pageSize;
				values.page = this.state.page;
				dispatch({
					type: 'materials/getDistributeOrderListE',
					payload: values,
				})
			}
		});
	};

	// 重置
	handleReset = () => {
		this.props.form.resetFields();
	};

	// 驳回
	reject(record) {
		const { dispatch } = this.props;
		const { handle_type, _id } = record;
		let flowState = 9003;
		switch (handle_type) {
			case 8004:
				flowState = 9003;  // 分发单驳回
				break;
			case 8005:
				flowState = 9015;  // 退货单驳回
				break;
		}
		dispatch({
			type: 'materials/editDistributeOrderE',
			payload: {
				order_id: _id,
				flow_state: flowState,
			},
		})
	};

	// 审核通过
	agree(record) {
		const { dispatch } = this.props;
		const { handle_type, _id } = record;
		let flowState = '';
		switch (handle_type) {
			case 8004:
				flowState = 9003;  // 分发单通过
				break;
			case 8005:
				flowState = 9014;  // 退货单通过
				break;
		}
		;
		dispatch({
			type: 'materials/editDistributeOrderE',
			payload: {
				order_id: _id,
				flow_state: flowState,
			},
		});
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
			type: 'materials/getDistributeOrderListE',
			payload: value,
		})
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		return (<div className="mgt8">
			<Form>
				<Row>
					<Col sm={6}>
						<FormItem {...formItemLayout} label={`单号`}>
							{getFieldDecorator(`order_id`, {
								rules: [{ required: false, message: '请输入单号', trigger: 'onBlur', type: 'string' }],
							})(
								<Input placeholder="请输入单号"/>
							)}
						</FormItem>
					</Col>
					<Col sm={6}>
						<FormItem {...formItemLayout} label={`平台`}>
							{getFieldDecorator(`platform_code_list`, {
								rules: [{
									type: 'string', message: '请选择平台',
								}, {
									required: false, message: '请选择平台',
								}],
							})(
								<Select placeholder="请选择平台"
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
						<FormItem label='申请状态' {...formItemLayout}>
							{getFieldDecorator('flow_state', {
								rules: [{
									type: 'array', message: '请选择需要查询的状态',
								}, {
									required: false, message: '请选择需要查询的状态',
								}],
							})(
								<Select placeholder="请选择需要查询的状态" mode="multiple">
									<Option value={`9010`}>待骑士确认收货</Option>
									<Option value={`9011`}>骑士已确认收货</Option>
									<Option value={`9013`}>退货申请待审核</Option>
									<Option value={`9014`}>退货申请通过</Option>
									<Option value={`9016`}>退货申请不通过</Option>
								</Select>
							)}
						</FormItem>
					</Col>
					<Col sm={6}>
						<FormItem label='选择日期' {...formItemLayout}>
							{getFieldDecorator('date', {
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
						<Button type="primary" className={`mgr8`} onClick={this.handleSearch}>查询</Button>
						<Button className={`mgr8`} onClick={this.handleReset}>重置</Button>
					</Col>
				</Row>
			</Form>
			<Table columns={this.state.columns} dataSource={this.state.dataSource}/>
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
		</div>)
	}
}

function mapStateToProps({ materials }) {
	return { materials }
}
export default connect(mapStateToProps)(Form.create()(DistributeLog));
