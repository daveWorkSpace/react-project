/**
 * Created by dave 2017/09/08
 * 采购|报废 -- 采购单报错
 *
 */
import React, { Component } from 'react';
import { Link } from 'react-router';
import style from './purchase.less';
import Table from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
import { Row, Col, Form, Button, Modal } from 'antd';
import { connect } from 'dva';
const [FormItem] = [Form.Item];

class ErrorOrder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			type: '8001',
			collectTotal: '',
			collectMoney: '',
			title: '提示',
			detail: props.materials.pickDetail,
			columns: [{
				title: '操作城市',
				dataIndex: 'city_name_joint',
				key: 'city_name_joint',
			}, {
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
				title: '采购数量（件）',
				dataIndex: 'procurement_amount',
				key: 'procurement_amount',
			}, {
				title: '实收数量（件）',
				dataIndex: 'real_procurement_amount',
				key: 'real_procurement_amount',
				render: (text, record, index) => {
					return (<InputNumber min={0} defaultValue={0} onChange={this.handleNumberChange.bind(this, index)}/>)
				}
			}],
			dataSource: props.materials.pickDetail.material_list || [],
		}
	}

	// 接受父级数据
	componentWillReceiveProps(nextProps) {
		this.setState({
			detail: nextProps.materials.pickDetail,
			dataSource: nextProps.materials.pickDetail.material_list || [],
		})
	}

	// 数量变化
	handleNumberChange(index, value) {
		const { dataSource } = this.state;
		dataSource[index]['procurement_amount'] = value;
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
				total += item.procurement_amount;
				realDataSource.push(item);
			}
		});
		this.setState({
			visible: true,
			collectMoney: money,
			collectTotal: total,
		});
	};

	// 单子报错
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
				dispatch({
					type: 'materials/editOrderToErrorListE',
					payload: {
						order_id: this.state.detail.order_id,
						material_list: this.state.dataSource,
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
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return (<div className="mgt16">
			<Row className={style.purchase}>
				<Row className={style.top}>
					<Col sm={12}>单号:</Col>
				</Row>
				<Col className={`ftw7 ft20 ${style.border}`}>
					<h3 className="mgl16 mgt16">操作信息</h3>
				</Col>
				<Col sm={8}>
					<FormItem {...formItemLayout} label={`类型`} className="ftw6">
						<span>{this.state.detail.handle_type}</span>
					</FormItem>
				</Col>
				<Col sm={8}>
					<FormItem {...formItemLayout} label={`申请人`} className="ftw6">
						<span>{this.state.detail.applicant_name}</span>
					</FormItem>
				</Col>
				<Col sm={8}>
					<FormItem {...formItemLayout} label={`申请人联系方式`} className="ftw6">
						<span>{this.state.detail.applicant_phone}</span>
					</FormItem>
				</Col>
				<Col sm={8}>
					<FormItem {...formItemLayout} label={`采购总品数（种）`} className="ftw6">
						<span>{this.state.detail.item_amount}</span>
					</FormItem>
				</Col>
				<Col sm={8}>
					<FormItem {...formItemLayout} label={`申请总数量（件）`} className="ftw6">
						<span>{this.state.detail.handle_amount}</span>
					</FormItem>
				</Col>
				<Col sm={8}>
					<FormItem {...formItemLayout} label={`申请总金额（元）`} className="ftw6">
						<span>{this.state.detail.total_money}</span>
					</FormItem>
				</Col>
				<Col sm={8}>
					<FormItem {...formItemLayout} label={`采购创建时间`} className="ftw6">
						<span>{this.state.detail.created_at}</span>
					</FormItem>
				</Col>
				<Row>
					<Col className={`ftw7 ft20 ${style.border}`} sm={24}>
						<h3 className="mgl16 mgt16">物资清单</h3>
					</Col>
				</Row>
				<Table columns={this.state.columns} dataSource={this.state.dataSource}/>
			</Row>
			{
				this.state.dataSource.length > 0 ? <Row type="flex" justify="center">
					<Col className='mgt16'>
						<Button type="primary" className='mgl16' onClick={this.handleSubmit}>提交</Button>
					</Col>
				</Row> : ''

			}
			<Modal
				title={this.state.title}
				visible={this.state.visible}
				onOk={this.handleOk}
				onCancel={this.handleCancel}
			>
				<Row type="flex" justify="center">
					<h3 className={`textCenter`}>请核对采购报错汇总信息</h3>
				</Row>
				<p className="mgt8">物资总品数（种）：{this.state.detail.item_amount}</p>
				<p className="mgt8">物资总数量（件）：{this.state.collectTotal}</p>
				<p className="mgt8">物资总金额（元）：{this.state.collectMoney}</p>
			</Modal>
		</div>)
	}
}

function mapStateToProps({ materials }) {
	return { materials }
}

export default connect(mapStateToProps)(Form.create()(ErrorOrder));
