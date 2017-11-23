/**
 * Created by dave 2017/09/08
 * 采购|报废 -- 单号详情
 *
 */
import React, { Component } from 'react';
import { Link } from 'react-router';
import style from './../Purchase/purchase.less';
import Table from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
import { Row, Col, Form, Button, Radio } from 'antd';
import { connect } from 'dva';
const [FormItem, RadioGroup] = [Form.Item, Radio.Group];

class DistributeDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
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
				title: '付款方式',
				dataIndex: 'payment_way',
				key: 'payment_way',
				render: (text, record) => {
					return (<span>
						{aoaoBossTools.enumerationConversion(text)}
					</span>)
				}
			}, {
				title: '付款金额（元）',
				dataIndex: 'stock_amount',
				key: 'stock_amount',
				render: (text, record) => {
					return (<span>
						{
							aoaoBossTools.knightPaywayToPrice(record['payment_way'], record)
						}
					</span>)
				}
			}],
			detail: props.materials.distributeLogDetail,
			dataSource: props.materials.distributeLogDetail.material_list || [],
		}
	}

	// 接受父级数据
	componentWillReceiveProps(nextProps) {
		this.setState({
			detail: nextProps.materials.distributeLogDetail,
			dataSource: nextProps.materials.distributeLogDetail.material_list || [],
		})
	}

	// 驳回
	reject = () => {
		const { dispatch } = this.props;
		const { detail } = this.state;
		const { handle_type, _id } = detail;
		let flowState = '';
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
	agree = () => {
		const { dispatch } = this.props;
		const { detail } = this.state;
		const { handle_type, _id } = detail;
		let flowState = '';
		let depositState = '';
		switch (handle_type) {
			case 8004:
				flowState = 9003;  // 分发单驳回
				break;
			case 8005:
				flowState = 9015;  // 退货单驳回
				break;
		}
		;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				depositState = values.deposit_state;
			}
		});
		dispatch({
			type: 'materials/editDistributeOrderE',
			payload: {
				order_id: _id,
				flow_state: flowState,
				deposit_state: depositState,
			},
		});
	};

	render() {
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		const { getFieldDecorator } = this.props.form;
		return (<div className="mgt16">
			<Form>
				<Row className={style.purchase}>
					<Row className={style.top}>
						<Col sm={12}>单号:{this.state.detail.order_id}</Col>
						<Col sm={12}
								 className="textRight">操作时间:{aoaoBossTools.prctoMinute(this.state.detail.created_at && this.state.detail.created_at, 3)}</Col>
					</Row>
					<Col className={`ftw7 ft20 ${style.border}`}>
						<h4 className="mgl16 mgt16">操作信息</h4>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`操作类型`} className="ftw6">
							<span>{aoaoBossTools.enumerationConversion(this.state.detail.handle_type && this.state.detail.handle_type)}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`操作人`} className="ftw6">
							<span>{this.state.detail.applicant_name && this.state.detail.applicant_name}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`操作人联系方式`} className="ftw6">
							<span>{this.state.detail.applicant_phone && this.state.detail.applicant_phone}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`操作总品数（种）`} className="ftw6">
							<span>{this.state.detail.handle_amount && this.state.detail.handle_amount}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`操作总数量（件）`} className="ftw6">
							<span>{this.state.detail.handle_item_amount && this.state.detail.handle_item_amount}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`操作总金额（元）`} className="ftw6">
							<span>{this.state.detail.handle_total_money && this.state.detail.handle_total_money}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`商圈`} className="ftw6">
							<span>{this.state.detail.biz_district_name && this.state.detail.biz_district_name}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`骑士`} className="ftw6">
							<span>{this.state.detail.knight_name && this.state.detail.knight_name}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`骑士手机号`} className="ftw6">
							<span>{this.state.detail.knight_phone && this.state.detail.knight_phone}</span>
						</FormItem>
					</Col>
					<Col className={`ftw7 ft20 ${style.border}`}>
						<h4 className="mgl16 mgt16">物资清单</h4>
					</Col>
					<Table columns={this.state.columns} dataSource={this.state.dataSource}/>
					{
						this.state.detail.handle_type == 8005 ? <Col sm={8}>
							<FormItem {...formItemLayout} label={`是否归还押金`}>
								{getFieldDecorator(`deposit_state`, {
									initialValue: 1,
								})(
									<RadioGroup>
										<Radio value={1}>是</Radio>
										<Radio value={2}>否</Radio>
									</RadioGroup>
								)}
							</FormItem>
						</Col> : ''
					}
				</Row>
				<Row type="flex" justify="center">
					<Col className='mgt16'>
						<Button className='mgl16'><Link to="Materiel/Dispatcher/Log">返回</Link></Button>
						{
							new Permission().agreeDistributeMaterials(this.state.detail.flow_state) == true ?
								<span>
								<Button className='mgl16' onClick={this.reject}>驳回</Button>
								<Button type="primary" className='mgl16' onClick={this.agree}>同意</Button>
							</span> : ''
						}
					</Col>
				</Row>
			</Form>
		</div>)
	}
}

function mapStateToProps({ materials }) {
	return { materials }
}

export default connect(mapStateToProps)(Form.create()(DistributeDetail));
