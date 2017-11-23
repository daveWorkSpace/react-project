/**
 * Created by dave 2017/08/01
 * 个人离职模块
 *
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Progress, Input, Button, Mention, Select } from 'antd';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
const [ FormItem, Option ] = [Form.Item, Select.Option];
const { toString, toEditorState, toContentState } = Mention;

class PersonalLeave extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flag: false,
			detail: props.system.employeeDetail,
			approveList: props.system.approveList,
		}
	}

	// 从上层接收数据
	componentWillReceiveProps(nextProps) {
		this.setState({
			detail: nextProps.system.employeeDetail,
			approveList: nextProps.system.approveList,
		});
		if (nextProps.system.employeeDetail.state == 1) {
			this.setState({
				flag: true,
			})
		} else if (nextProps.system.employeeDetail.state == 50) {
			this.setState({
				flag: false,
			})
		}
	}

	// 提出离职
	editEmployeeLeave = () => {
		const { dispatch } = this.props;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				values.state = 1;
				// values.job_transfer_remark = toString(values.job_transfer_remark);
				// values.departure_reason = toString(values.departure_reason);
				dispatch({
					type: 'system/leaveApplication',
					payload: values,
				});
				this.props.form.setFields();
			}
		});
	};

	// 取消离职申请
	resetFormInitValue = () => {
		this.props.form.resetFields();
	};

	// 离职进度条转换
	showProgress() {
		let progressPercent = this.state.detail.state;
		switch (progressPercent) {
			case -50:
				progressPercent = 100;
			case 1:
				progressPercent = 50;
		}
		if (this.state.detail.state == 50
			&& this.state.detail.departure_log
			&& this.state.detail.departure_log.length > 0) {
			return <Progress percent={progressPercent} showInfo format={() => null}
											 strokeWidth={20} status="exception"/>
		} else if (this.state.detail.state != 50) {
			return <Progress percent={progressPercent} showInfo format={() => null}
											 strokeWidth={20}/>
		} else {
			return null;
		}
	}

	mentionChange = (editorState) => {

	};
	// 状态对应值改变

	render() {
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 14 },
			},
		};
		const { getFieldDecorator } = this.props.form;
		const { toString, toEditorState, toContentState } = Mention;
		return (
			<div>
				<Row className='mg20' type="flex" justify="center">
					<Col sm={22}>
						<Col sm={20}>
							{
								this.showProgress()
							}
						</Col>
						{
							this.showProgress() != null ? <Col sm={4}>
								<div>{aoaoBossTools.enumerationConversion(this.state.detail.state)}</div>
							</Col> : null
						}
					</Col>
				</Row>
				<Form>
					<Row>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`姓名`}>
								{getFieldDecorator(`name`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>{this.state.detail.name && this.state.detail.name}</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`联系电话`}>
								{getFieldDecorator(`phone`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>{this.state.detail.phone && this.state.detail.phone}</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`身份证号`}>
								{getFieldDecorator(`identity_card_id`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>{this.state.detail.identity_card_id && this.state.detail.identity_card_id}</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`供应商名称`}>
								{getFieldDecorator(`supplier_name`, {
									rules: [{ required: false, message: '请输入供应商名称', trigger: 'onBlur', type: 'string' }],
								})(
									<span>{this.state.detail.supplier_name && this.state.detail.supplier_name}</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`平台`}>
								{getFieldDecorator(`identity_card_id`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>
											{this.state.detail.platform_list && this.state.detail.platform_list.map((item, index) => {
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
											{this.state.detail.city_list && this.state.detail.city_list.map((item, index) => {
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
											{this.state.detail.biz_district_list && this.state.detail.biz_district_list.map((item, index) => {
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
									<span>{aoaoBossTools.enumerationConversion(this.state.detail.position_id)}</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`入职日期`}>
								{getFieldDecorator(`entry_date`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<span>{this.state.detail.entry_date && this.state.detail.entry_date}</span>
								)}
							</FormItem>
						</Col>
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`离职原因`}>
								{getFieldDecorator(`departure_reason`, {
									rules: [{ required: false, message: '请输入离职原因', trigger: 'onBlur', type: 'string' }],
									initialValue: this.state.detail.departure_reason && this.state.detail.departure_reason,
								})(
									<textarea style={{ width: '100%', height: 100 }} placeholder="请输入离职原因" disabled={this.state.flag}/>
								)}
							</FormItem>
						</Col>
						{
							this.state.status != -50 ? '' :
								<Col sm={12}>
									<FormItem {...formItemLayout} label={`离职日期`}>
										{getFieldDecorator(`departure_date`, {
											rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
										})(
											<span>{this.state.detail.departure_date && this.state.detail.departure_date}</span>
										)}
									</FormItem>
								</Col>

						}
						{
							new Permission().knightTypeShow(this.state.detail.position_id) == true ? '' : <Col sm={12}>
								<FormItem {...formItemLayout} label={`工作交接备注`}>
									{getFieldDecorator(`job_transfer_remark`, {
										rules: [{ required: false, message: '请输入工作交接备注内容', trigger: 'onBlur', type: 'string' }],
										initialValue: this.state.detail.job_transfer_remark && this.state.detail.job_transfer_remark,
									})(
										<textarea style={{ width: '100%', height: 100 }} placeholder="请输入工作交接备注内容"
															disabled={this.state.flag}/>
									)}
								</FormItem>
							</Col>
						}
						<Col sm={12}>
							<FormItem {...formItemLayout} label={`审批人`}>
								{getFieldDecorator(`departure_approver_account_id`, {
									rules: [{ required: true, message: '请选择审批人', trigger: 'onBlur', type: 'string' }],
									initialValue: '',
								})(
									<Select placeholder="请选择审批人" disabled={this.state.flag}>
										{
											this.state.approveList.superior_list.map((item, index)=> {
												return (<Option value={item._id}
																				key={item._id}>{`${item.name}(${aoaoBossTools.enumerationConversion(item.role_id)})`}</Option>)
											})
										}
									</Select>
								)}
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col className='textRight' sm={9}>
							<Button onClick={this.editEmployeeLeave} type="primary" disabled={this.state.flag}>发送</Button>
						</Col>
						<Col sm={2}></Col>
						<Col className='textLeft' sm={11}>
							<Button onClick={this.resetFormInitValue} disabled={this.state.flag}>取消</Button>
						</Col>
					</Row>
				</Form>
			</div>)
	}
}
PersonalLeave = Form.create()(PersonalLeave);

function mapStateToProps({ system }) {
	return { system }
}
export default connect(mapStateToProps)(PersonalLeave);
