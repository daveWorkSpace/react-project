/**
 * Created by dave 2017/09/24
 * 薪资查询明细
 */
import React, { Component } from 'react';
import { Link } from 'react-router';
import Table from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
import { Row, Col, Form, Button, Radio } from 'antd';
import { connect } from 'dva';
const [FormItem, RadioGroup] = [Form.Item, Radio.Group];

class Detail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detail: props.salaryModel.salaryDetail && props.salaryModel.salaryDetail,
			columns: [{
				title: '城市',
				dataIndex: 'city_name_joint',
				key: 'city_name_joint',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '商圈',
				dataIndex: 'biz_district_name',
				key: 'biz_district_name',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '人效',
				dataIndex: 'efficiency',
				key: 'efficiency',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '出勤天数',
				dataIndex: 'attendance_days',
				key: 'attendance_days',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '有效出勤',
				dataIndex: 'effective_attendance_days',
				key: 'effective_attendance_days',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '完成单量',
				dataIndex: 'order_count',
				key: 'order_count',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '准时单量',
				dataIndex: 'on_time_order_count',
				key: 'on_time_order_count',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '超时单量',
				dataIndex: 'timeout_order_count',
				key: 'timeout_order_count',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '底薪',
				dataIndex: 'basic_salary',
				key: 'basic_salary',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '提成',
				dataIndex: 'commission',
				key: 'commission',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '奖金',
				dataIndex: 'bonus',
				key: 'bonus',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '扣罚',
				dataIndex: 'punished',
				key: 'punished',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '线下补款',
				dataIndex: 'payment_amount',
				key: 'payment_amount',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '补款原因',
				dataIndex: 'payment_reason',
				key: 'payment_reason',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '线下扣款',
				dataIndex: 'deduction_amount',
				key: 'deduction_amount',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '扣款原因',
				dataIndex: 'deduction_reason',
				key: 'deduction_reason',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '物资扣款',
				dataIndex: 'material_charge',
				key: 'material_charge',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			}, {
				title: '应发工资',
				dataIndex: 'total_salary',
				key: 'total_salary',
				render: (text) => {
					return (<span>
						{text}
					</span>)
				}
			},],
			dataSource: [props.salaryModel.salaryDetail && props.salaryModel.salaryDetail],
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: [nextProps.salaryModel.salaryDetail && nextProps.salaryModel.salaryDetail],
			detail: nextProps.salaryModel.salaryDetail && nextProps.salaryModel.salaryDetail,
		})
	}

	render() {
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return (<div className="mgt16 detail">
			<Form>
				<Row>
					<Row className={'top'}>
						<Col sm={12}></Col>
						<Col sm={12}
								 className="textRight">月份:{this.state.detail.month && this.state.detail.month}</Col>
					</Row>
					<Col className={`ftw7 ft20 border`}>
						<h4 className="mgl16 mgt16">入职信息</h4>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`姓名`} className="ftw6">
							<span>{this.state.detail.name && this.state.detail.name}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`身份证号码`} className="ftw6">
							<span>{this.state.detail.identity_card_id && this.state.detail.identity_card_id}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`联系方式`} className="ftw6">
							<span>{this.state.detail.phone && this.state.detail.phone}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`银行卡号`} className="ftw6">
							<span>{this.state.detail.bank_card_id && this.state.detail.bank_card_id}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`开户行`} className="ftw6">
							<span>{this.state.detail.bank_branch && this.state.detail.bank_branch}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`职位`} className="ftw6">
							<span>{aoaoBossTools.enumerationConversion(this.state.detail.position_id && this.state.detail.position_id)}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`状态`} className="ftw6">
							<span>{this.state.detail.state && this.state.detail.state}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`骑士类型`} className="ftw6">
							<span>{aoaoBossTools.enumerationConversion(this.state.detail.job_category_id && this.state.detail.job_category_id)}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`入职时间`} className="ftw6">
							<span>{this.state.detail.entry_date && this.state.detail.entry_date}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`离职时间`} className="ftw6">
							<span>{this.state.detail.departure_date && this.state.detail.departure_date}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`上次离职时间`} className="ftw6">
							<span>{this.state.detail.last_departure_date && this.state.detail.last_departure_date}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`应聘渠道`} className="ftw6">
							<span>{this.state.detail.recruitment_channel_id && this.state.detail.recruitment_channel_id}</span>
						</FormItem>
					</Col>
					<Col sm={8}>
						<FormItem {...formItemLayout} label={`合同归属`} className="ftw6">
							<span>{this.state.detail.contract_belong_id && this.state.detail.contract_belong_id}</span>
						</FormItem>
					</Col>
				</Row>
				<div className={`ftw7 ft20 border`}>
					<h4 className="mgl16 mgt16">薪资清单</h4>
				</div>
				<Table columns={this.state.columns} dataSource={this.state.dataSource}/>
				<Row type="flex" justify="center">
					<Col className='mgt16'>
						<Button className='mgl16'><Link to="Salary/Search">返回</Link></Button>
					</Col>
				</Row>
			</Form>
		</div>)
	}
}

function mapStateToProps({ salaryModel }) {
	return { salaryModel }
}

export default connect(mapStateToProps)(Detail);
