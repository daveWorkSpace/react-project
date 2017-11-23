/**
 * Created by dave 2017/08/07
 * 骑士离职详情模块
 *
 */
import React, { Component } from 'react';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
import { Modal, Form, Row, Col, Select, Input, } from 'antd';
const [FormItem,Option] = [Form.Item, Select.Option];

class KnightLeaveCheck extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: props.visible,
			detail: props.detail,
		}
	}

	// 接受父级的 ModalInfo 信息对弹窗架子填充
	componentWillReceiveProps = (nextProps) => {
		this.setState({
			visible: nextProps.visible,
			detail: nextProps.detail,
		})
	};

	// 取消弹框
	handleCancel = () => {
		this.props.handleCancel();
		this.props.form.resetFields();
	};

	// 确认离职
	handleOk = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				this.props.handleOk(values);
				this.props.form.resetFields();
			}
		});
	};

	render() {
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 14 },
			},
		};
		const { getFieldDecorator } = this.props.form;
		const departureReasonList = aoaoBossTools.readDataFromLocal(2, 'departure_reason');
		return (
			<Modal title={'离职信息校验'} visible={this.state.visible} onCancel={this.handleCancel}
						 onText={'确认离职'} style={{ minWidth: '700px' }}
						 onOk={this.handleOk}
			>
				<Form>
					<Row>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`姓名`}>
								{getFieldDecorator(`name`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>{this.state.detail && this.state.detail.name}</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`联系电话`}>
								{getFieldDecorator(`phone`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>{this.state.detail && this.state.detail.phone}</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`身份证号`}>
								{getFieldDecorator(`identity_card_id`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>{this.state.detail && this.state.detail.identity_card_id}</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`供应商名称`}>
								{getFieldDecorator(`supplier_name`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>{this.state.detail && this.state.detail.supplier_name}</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`平台`}>
								{getFieldDecorator(`identity_card_id`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>
											{this.state.detail && this.state.detail.platform_list.map((item, index) => {
												return <span key={index}>{item.platform_name}</span>
											})}
										</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`城市`}>
								{getFieldDecorator(`city_list`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>
											{this.state.detail && this.state.detail.city_list.map((item, index) => {
												return <span key={index}>{item.city_name_joint}</span>
											})}
										</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`商圈`}>
								{getFieldDecorator(`biz_district_list`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>
											{this.state.detail && this.state.detail.biz_district_list.map((item, index) => {
												return <span key={index}>{item.biz_district_name}</span>
											})}
										</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`职位`}>
								{getFieldDecorator(`identity_card_id`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>{aoaoBossTools.enumerationConversion(this.state.detail && this.state.detail.position_id)}</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`骑士类型`}>
								{getFieldDecorator(`identity_card_id`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>{aoaoBossTools.enumerationConversion(this.state.detail && this.state.detail.job_category_id)}</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`离职原因`}>
								{getFieldDecorator(`departure_reason`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<Select placeholder="请选择离职原因">
										{
											departureReasonList.map((item, index) => {
												return (<Option value={item.constant_name} key={item.constant_id}>{item.constant_name}</Option>)
											})
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`入职日期`}>
								{getFieldDecorator(`entry_date`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>{aoaoBossTools.prctoMinute(this.state.detail && this.state.detail.entry_date, 0)}</span>
								)}
							</FormItem>
						</Col>
					</Row>
				</Form>
			</Modal>
		)
	}
}

KnightLeaveCheck = Form.create()(KnightLeaveCheck);

export default KnightLeaveCheck;
