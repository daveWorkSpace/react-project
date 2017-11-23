/**
 * Created by dave 2017/09/24
 * 新建骑士扣款
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router';
import { Form, Row, Col, Select, Button, Input, message, DatePicker, InputNumber, Modal, Table, Icon } from 'antd';
import moment from 'moment';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
const { MonthPicker, RangePicker } = DatePicker;
const [FormItem, Option] = [Form.Item, Select.Option];

class Create extends Component {
	constructor(props) {
		super();
		this.state = {
			columns: [{
				title: '骑士姓名',
				dataIndex: 'name',
				key: 'name',
			}, {
				title: '骑士手机号',
				dataIndex: 'phone',
				key: 'phone',
			}, {
				title: '扣款金额(元)',
				dataIndex: 'fund_amount',
				key: 'fund_amount',
				width: '150px',
				render: (text, record, index) => {
					return (
						<InputNumber onChange={this.handleNumberChange.bind(this, index)} step={100} min={0}
									 defaultValue={0}/>)
				}
			}, {
				title: '原因',
				dataIndex: 'fund_reason',
				key: 'fund_reason',
				render: (text, record, index) => {
					return (<Input onChange={this.handleReasonChange.bind(this, index)}/>)
				}
			},],
			dataSource: props.materials.knightList.data,
			selectedRowKeys: [],
			selectedRows: [],
			visible: false,
			content: '',
			bizDistrictId: '',
			month: '',
		}
	}

	componentWillMount() {
		const areaList = aoaoBossTools.getAllAreaFromPermission('biz_district_list');
		const month = aoaoBossTools.prctoMinute(new Date(), 1);
		this.setState({
			month: month,
			bizDistrictId: areaList[0]['biz_district_id'],
		})
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: nextProps.materials.knightList.data || [],
		})
	}

	// 查询骑士
	handleSearchKnight = (value) => {
		const { dispatch } = this.props;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				dispatch({
					type: 'materials/getKnightListE',
					payload: {
						state: 50,
						position_id_list: [2008, 2009],
						biz_district_id_list: [value],
						limit: 1000,
						page: 1,
					}
				})
			}
		});
	};

	// 可选时间为当月及之前
	disableDateOfMonth = (current) => {
		return current && current > new Date();
	};

	// 扣款金额变化
	handleNumberChange(index, value) {
		const { dataSource } = this.state;
		dataSource[index]['fund_amount'] = value;
		this.setState({
			dataSource,
		});
	}

	// 扣款原因变化
	handleReasonChange(index, e) {
		const { dataSource } = this.state;
		dataSource[index]['fund_reason'] = e.target.value;
		this.setState({
			dataSource,
		});
	}

	// 批量选中
	onSelectChange = (selectedRowKeys, selectedRows) => {
		this.setState({ selectedRowKeys, selectedRows });
	};

	// 创建扣款
	showCreateFillingModal = () => {
		const { dataSource, selectedRows, selectedRowKeys } = this.state;
		this.setState({
			visible: true,
		});
		let total = selectedRows.length && selectedRows.length || 0;
		let money = 0;
		selectedRowKeys.map((item, index) => {
			if (dataSource[item].hasOwnProperty('fund_amount')) {
				money += dataSource[item]['fund_amount'];
			}
		});
		const collectContent = <div>
			<span>
				<Icon type="exclamation-circle" style={{ color: '#ffbf00', fontSize: 18 }}/>
				<span className="mgr16">{`总人数:${total}`}</span>&nbsp;&nbsp;
				<span className="mgl16">{`总扣款金额:${money}`}</span>
			</span>
			<p>您确定发送该扣款申请吗？</p>
		</div>;
		this.setState({
			content: collectContent,
		})
	};

	// 创建扣补款单
	handleOk = () => {
		const { dispatch } = this.props;
		const { month, selectedRowKeys, dataSource, bizDistrictId } = this.state;
		let fundList = [];
		selectedRowKeys.map((item, index) => {
			fundList.push({
				staff_id: dataSource[item]['_id'],
				name: dataSource[item]['name'],
				phone: dataSource[item]['phone'],
				fund_amount: dataSource[item]['fund_amount'],
				fund_reason: dataSource[item]['fund_reason'],
			});
		});
		this.setState({
			visible: false,
		});
		if (selectedRowKeys.length > 0) {
			dispatch({
				type: 'salaryModel/createMoneyOrderOfKnightE',
				payload: {
					fund_id: 11001,
					biz_district_id: bizDistrictId,
					month: month,
					fund_list: fundList,
				},
			})
		}
	};

	// Modal取消
	handleCancel = () => {
		this.setState({
			visible: false,
		})
	};

	render() {
		const { selectedRowKeys } = this.state;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const { getFieldDecorator } = this.props.form;
		const areaList = aoaoBossTools.getAllAreaFromPermission('biz_district_list');
		return (<div className="mgt8">
			<Form>
				<Row>
					<Col sm={6}>
						<FormItem label='商圈' {...formItemLayout}>
							{getFieldDecorator('biz_district_id_list', {
								rules: [{
									type: 'string', message: '请选择商圈',
								}, {
									required: false, message: '请选择商圈',
								}],
								initialValue: areaList[0]['biz_district_id'],
							})(
								<Select placeholder="请选择商圈" onChange={this.handleSearchKnight}>
									{
										areaList.map((item, index) => {
											return (<Option value={item.biz_district_id}
															key={index}>{item.biz_district_name}</Option>)
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
								initialValue: moment(this.state.month),
							})(
								<MonthPicker placeholder="请选择月份"
											 disabledDate={this.disableDateOfMonth}/>
							)}
						</FormItem>
					</Col>
				</Row>
			</Form>
			<Table columns={this.state.columns} dataSource={this.state.dataSource}
				   rowSelection={rowSelection}
				   rowKey={(record, index) => {
					   return index;
				   }} pagination={false}/>
			<Row type="flex" justify="center">
				<Col className='mgt16'>
					<Button className='mgl16' type="primary" onClick={this.showCreateFillingModal}>发送</Button>
					<Button className='mgl16'><Link to="Salary/FillingMoney">返回</Link></Button>
				</Col>
			</Row>
			<Modal title={'确认信息'} visible={this.state.visible}
				   onOk={this.handleOk} onCancel={this.handleCancel}
				   okText="确认" cancelText="取消">
				<Row type="flex" justify="center">
					<Col className='mgt16'>
						{this.state.content}
					</Col>
				</Row>
			</Modal>
		</div>)
	}
}

const mapStateToProps = ({ salaryModel, materials }) => {
	return { salaryModel, materials }
};

export default connect(mapStateToProps)(Form.create()(Create));
