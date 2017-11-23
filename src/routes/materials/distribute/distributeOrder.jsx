/**
 * Created by dave 2017/09/08
 * 采购|报废 - 新建采购|报废单
 *
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, Input, message, DatePicker, InputNumber, Modal } from 'antd';
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
			knightId: '',
			areaList: [],
			knightList: props.materials.knightList.data || [],
			collectTotal: '',
			collectMoney: '',
			collectKind: '',
			title: '提示',
			columns: [{
				title: '物资名称',
				dataIndex: 'material_name',
				key: 'material_name',
			}, {
				title: '物资规格',
				dataIndex: 'material_type',
				key: 'material_type',
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
				title: '付款方式',
				dataIndex: 'payment_way',
				key: 'payment_way',
				width: '300px',
				render: (text, record, index) => {
					return (
						<Select defaultValue="301" onChange={this.levelChange.bind(this, index)}>
							<Option value="301">一次性</Option>
							<Option value="302">月付</Option>
							<Option value="303">押金</Option>
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
			knightList: nextProps.materials.knightList.data,
		})
	}

	// 查询骑士
	handleSearchKnight = (value) => {
		const { dispatch } = this.props;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				dispatch({
					type: 'materials/getKnightListE',
					payload: {
						state: 50,
						position_id_list: [2008, 2009],
						biz_district_id_list: value,
						limit: 1000,
						page: 1,
					}
				})
			}
		});
	};

	// 骑士改变
	knightChange = (value) => {
		this.setState({
			knightId: value,
		});
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
		dataSource[index]['distribute_amount'] = value;
		this.setState({
			dataSource,
		});
	}

	// 付款方式变化
	levelChange(index, value) {
		const { dataSource } = this.state;
		const data = Number(value);
		dataSource[index]['payment_way'] = data;
		this.setState({
			dataSource,
		});
	}

	// 提交添加的采购或者报废单
	handleSubmit = () => {
		const { knightId } = this.state;
		if (knightId == '') {
			message.error('请选择一名骑士');
			return;
		} else {
			let money = 0;
			let total = 0;
			let kind = 0;
			const { dataSource } = this.state;
			const realDataSource = [];
			dataSource.forEach((item, index) => {
				if (item.hasOwnProperty('distribute_amount')) {
					switch (item['payment_way']) {
						case 301:
							money += item.purchase_price * item.distribute_amount;
							break;
						case 302:
							money += item.monthly_fee * item.distribute_amount;
							break;
						case 303:
							money += item.deposit * item.distribute_amount;
							break;
						default:
							money += item.purchase_price * item.distribute_amount;
							break;
					}
					if (item['distribute_amount'] > 0) {
						kind++;
					}
					total += item.distribute_amount;
					realDataSource.push(item);
				}
			});
			this.setState({
				visible: true,
				collectMoney: money,
				collectTotal: total,
				collectKind: kind,
			});
		}

	};

	// 创建单子
	handleCreateOk = () => {
		this.setState({
			visible: false,
		});
		const { dispatch } = this.props;
		const { dataSource, knightId } = this.state;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				console.log(values);
				for (let i = 0; i < dataSource.length; i++) {
					if (dataSource[i].hasOwnProperty('payment_way') == false) {
						dataSource[i]['payment_way'] = 301;
					}
				}
				dispatch({
					type: 'materials/createDistributeOrderE',
					payload: {
						staff_id: knightId,
						material_list: dataSource,
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
		const areaList = aoaoBossTools.getAllAreaFromPermission('biz_district_list');
		return (<div className="mgt8">
			<Form>
				<Row>
					<Col sm={6}>
						<FormItem label='商圈' {...formItemLayout}>
							{getFieldDecorator('biz_district_id_list', {
								rules: [{
									type: 'array', message: '请选择商圈',
								}, {
									required: false, message: '请选择商圈',
								}],
							})(
								<Select placeholder="请选择商圈" mode="multiple"
												onChange={this.handleSearchKnight}>
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
						<FormItem label='骑士' {...formItemLayout}>
							{getFieldDecorator('staff_id', {
								rules: [{ required: false, message: '请选择骑士', trigger: 'onBlur', type: 'string' }],
							})(
								<Select placeholder="请选择骑士" onChange={this.knightChange}
												showSearch
												optionFilterProp='children'>
									{
										this.state.knightList.map((item, index) => {
											return (<Option value={item._id} key={index}>{`${item.name}-${item.phone}`}</Option>)
										})
									}
								</Select>
							)}
						</FormItem>
					</Col>
				</Row>
			</Form>
			<Table columns={this.state.columns} dataSource={this.state.dataSource}/>
			{
				this.state.dataSource.length > 0 ? <Form className="mgt16">
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
				onOk={this.handleCreateOk}
				onCancel={this.handleCancel}
			>
				<Row type="flex" justify="center">
					<h3 className={`textCenter`}>请核对汇总信息</h3>
				</Row>
				<p className="mgt8">物资总品数（种）：{this.state.collectKind}</p>
				<p className="mgt8">物资总数量（件）：{this.state.collectTotal}</p>
				<p className="mgt8">支付金额（元）：{this.state.collectMoney}</p>
			</Modal>
		</div>)
	}
}

function mapStateToProps({ materials }) {
	return { materials }
}

export default connect(mapStateToProps)(Form.create()(PurchaseOrder));
