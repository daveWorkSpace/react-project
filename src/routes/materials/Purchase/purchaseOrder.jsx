/**
 * Created by dave 2017/09/08
 * 采购|报废 - 新建采购|报废单
 *
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, Input, DatePicker, InputNumber, Modal } from 'antd';
import Table from './../../../components/table';
import moment from 'moment';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
const { MonthPicker, RangePicker } = DatePicker;
const [FormItem,Option] = [Form.Item, Select.Option];

class PurchaseOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			type: '8001',
			collectTotal: '',
			collectMoney: '',
			modalContent: '',
			title: '提示',
			cityList: [],
			columns: [{
				title: '物资名称',
				dataIndex: 'material_name',
				key: 'material_name',
			}, {
				title: '物资规格',
				dataIndex: 'material_type',
				key: 'material_type',
			}, {
				title: '物资采购价（元）',
				dataIndex: 'purchase_price',
				key: 'purchase_price',
			}, {
				title: '当前库存数量（件）',
				dataIndex: 'stock_amount',
				key: 'stock_amount',
			}, {
				title: '采购数量（件）',
				dataIndex: 'procurement_amount',
				key: 'procurement_amount',
				render: (text, record, index) => {
					return (<InputNumber min={0} defaultValue={0} onChange={this.handleNumberChange.bind(this, index)}/>)
				}
			}, {
				title: '紧急程度',
				dataIndex: 'emergency_degree',
				key: 'emergency_degree',
				render: (text, record, index) => {
					return (
						<Select defaultValue="601" onChange={this.levelChange.bind(this, index)}>
							<Option value="601">紧急</Option>
							<Option value="602">一般</Option>
							<Option value="603">不急</Option>
						</Select>)
				}
			}],
			dataSource: props.materials.itemModules.material_list || [],
			realDataSource: []
		}
	}

	// 接受父级数据
	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: nextProps.materials.itemModules.material_list,
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

	// 更改单子类型
	orderTypeChange = (value) => {
		if (value === '8001') {
			const columns = [{
				title: '物资名称',
				dataIndex: 'materials_name',
				key: 'materials_name',
			}, {
				title: '物资规格',
				dataIndex: 'material_type',
				key: 'material_type',
			}, {
				title: '物资采购价（元）',
				dataIndex: 'purchase_price',
				key: 'purchase_price',
			}, {
				title: '当前库存数量（件）',
				dataIndex: 'stock_amount',
				key: 'stock_amount',
			}, {
				title: '采购数量（件）',
				dataIndex: 'procurement_amount',
				key: 'procurement_amount',
				render: (text, record, index) => {
					return (<InputNumber min={0} defaultValue={0} onChange={this.handleNumberChange.bind(this, index)}/>)
				}
			}, {
				title: '紧急程度',
				dataIndex: 'emergency_degree',
				key: 'emergency_degree',
				render: (text, record, index) => {
					return (
						<Select defaultValue="601" onChange={this.levelChange.bind(this, index)}>
							<Option value="601">紧急</Option>
							<Option value="602">一般</Option>
							<Option value="603">不急</Option>
						</Select>)
				}
			}];
			this.setState({
				columns: columns,
				type: value,
			})
		} else if (value === '8002') {
			const columns = [{
				title: '物资名称',
				dataIndex: 'materials_name',
				key: 'materials_name',
			}, {
				title: '物资规格',
				dataIndex: 'material_type',
				key: 'material_type',
			}, {
				title: '采购数量（件）',
				dataIndex: 'procurement_amount',
				key: 'procurement_amount',
				render: (text, record, index) => {
					return (<InputNumber min={0} defaultValue={0} onChange={this.handleNumberChange.bind(this, index)}/>)
				}
			}];
			this.setState({
				columns: columns,
				type: value,
			})
		}
	};

	// 查询模板
	handleSearch = () => {
		const { dispatch } = this.props;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				dispatch({
					type: 'materials/createBaseItemListE',
					payload: {
						platform_code: values.platform_code,
						city_spelling: values.city_spelling,
					}
				})
			}
		});
	};

	// 数量变化
	handleNumberChange(index, value) {
		const { dataSource } = this.state;
		dataSource[index]['procurement_amount'] = value;
		this.setState({
			dataSource,
		});
	}

	// 紧急程度变化
	levelChange(index, value) {
		const { dataSource } = this.state;
		const data = Number(value);
		dataSource[index]['emergency_degree'] = data;
		this.setState({
			dataSource,
		});
	}

	// 提交添加的采购或者报废单
	handleSubmit = () => {
		let money = 0;
		let total = 0;
		const { dataSource } = this.state;
		const realDataSource = [];
		dataSource.forEach((item, index) => {
			if (item.hasOwnProperty('procurement_amount')) {
				money += item.purchase_price * item.procurement_amount;
				total += item.procurement_amount
				realDataSource.push(item);
			}
		});
		this.setState({
			visible: true,
			collectMoney: money,
			collectTotal: total,
		});

		// 判断单子类型去修改汇总信息模板
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				if (values.handle_type == '8002') {
					this.setState({
						modalContent: '',
					})
				} else {
					this.setState({
						modalContent: <p className="mgt8">物资总金额：{money}</p>,
					})
				}
			}
		});
	};

	// 创建单子
	handleOk = () => {
		const { form, dispatch } =this.props;
		this.setState({
			visible: false,
		});
		form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				// 赋值初始化紧急程度
				this.state.dataSource.forEach((item, index) => {
					if (item.hasOwnProperty('emergency_degree') == false) {
						item['emergency_degree'] = 601;
					}
				});
				dispatch({
					type: 'materials/createNewOrderE',
					payload: {
						handle_type: Number(values.handle_type),
						platform_code: values.platform_code,
						city_spelling: values.city_spelling,
						material_list: this.state.dataSource,
						procurement_reason: values.procurement_reason,
						return_money: values.return_money,
					}
				})
			}
		});
	};

	// 返回
	handleCancel = () => {
		this.setState({
			visible: false,
		})
	};

	render() {
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		const { getFieldDecorator } = this.props.form;
		return (<div className="mgt8">
			<Form>
				<Row>
					<Col sm={6}>
						<FormItem {...formItemLayout} label={`平台`}>
							{getFieldDecorator(`platform_code`, {
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
							{getFieldDecorator('city_spelling', {
								rules: [{
									type: 'string', message: '请选择城市',
								}, {
									required: false, message: '请选择城市',
								}],
							})(
								<Select placeholder="请选择城市">
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
						<FormItem label='操作类型' {...formItemLayout}>
							{getFieldDecorator('handle_type', {
								rules: [{ required: false, message: '请选择时间', trigger: 'onBlur', type: 'string' }],
								initialValue: `8001`,
							})(
								<Select placeholder="请选择城市" onChange={this.orderTypeChange}>
									<Option value="8001">采购</Option>
									<Option value="8002">报废</Option>
								</Select>
							)}
						</FormItem>
					</Col>
					<Col sm={6}>
						<Col sm={3}/>
						<Button type="primary" className={`mgr8`} onClick={this.handleSearch}>查询</Button>
					</Col>
				</Row>
			</Form>
			<Table columns={this.state.columns} dataSource={this.state.dataSource}/>
			{
				this.state.dataSource.length > 0 ? <Form className="mgt16">
					<Row>
						{
							this.state.type == '8001' ? <Col sm={6}>
								<FormItem {...formItemLayout} label={`原因`}>
									{getFieldDecorator(`procurement_reason`, {
										rules: [{ required: false, message: '请输采购原因', trigger: 'onBlur', type: 'string' }],
									})(
										<textarea style={{ width: '100%', height: 100 }} placeholder="请输入工作交接备注内容"
															disabled={this.state.flag}/>
									)}
								</FormItem>
							</Col> :
								<Col sm={8}>
									<FormItem {...formItemLayout} label={`回收金额 (元)`}>
										{getFieldDecorator(`procurement_reason`, {
											rules: [{ required: false, message: '请输入回收金额', trigger: 'onBlur', type: 'string' }],
										})(
											<Input placeholder="请输入"/>
										)}
									</FormItem>
								</Col>
						}
					</Row>
					<Row type="flex" justify="center">
						<Col>
							<Button type="primary" onClick={this.handleSubmit}>提交</Button>
						</Col>
					</Row>
				</Form> : ''
			}
			<Modal
				title={this.state.title}
				visible={this.state.visible}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
			>
				<Row type="flex" justify="center">
					<h3 className={`textCenter`}>请核对汇总信息</h3>
				</Row>
				<p className="mgt8">物资总数量：{this.state.collectTotal}</p>
				{this.state.modalContent}
			</Modal>
		</div>)
	}
}

function mapStateToProps({ materials }) {
	return { materials }
}

export default connect(mapStateToProps)(Form.create()(PurchaseOrder));
