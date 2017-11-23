import React, { Component } from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	Radio,
	Modal,
	DatePicker,
	InputNumber,
	Row,
	Col,
	Select,
	Upload,
	Button,
	Icon,
	message,
	Spin,
} from 'antd';
import styles from './upload.less';
const [FormItem,Option] = [Form.Item, Select.Option];
const { RangePicker } = DatePicker;


class ModalPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: props.visible, // 弹框状态
			title: props.title,			// 弹窗标题
			content: props.content, // 弹窗内容
			loading: props.loading,
			token: props.token,
			path: props.path,
		}
	}

	// 接受父级的 ModalInfo 信息对弹窗架子填充
	componentWillReceiveProps = (nextProps) => {
		this.setState({
			visible: nextProps.visible,
			title: nextProps.title,
			content: nextProps.content,
			path: nextProps.path,
			token: nextProps.token,
			loading: nextProps.loading,
		})
	};

	// 弹窗确认事件
	handleOk = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				document.getElementsByClassName('ant-modal-footer')[0].style.opacity = 0.5;
				this.props.handleOk(values);
				this.props.form.resetFields();
			}
		});

	};

	// 弹窗取消事件
	handleCancel = (e) => {
		document.querySelector('#showUploadFile').innerHTML = ``;
		this.props.handleCancel();
		this.props.form.resetFields();
	};

	getToken = () => {
		this.props.getQINIUtoken();
	};

	render() {
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
			},
		};
		const { getFieldDecorator } = this.props.form;
		let { token, path } = this.state;
		const dispatch = this.props.dispatch;
		//上传文件
		const props = {
			name: "file",
			action: "", //  //jsonplaceholder.typicode.com/posts/
			showUploadList: false,
			data: function (file) {
				return {
					token: 'token',
					key: 'path',
					file: file,
				}
			},
			beforeUpload(file) {
				if (file.type !== "application/pdf") {
					message.error('只能上传pdf格式文件');
					return false;
				} else {

				}
				//如果文件正确则创建任务
				dispatch({ type: "upload/postFileToQINIUE", payload: { file: file, token: token, key: path } })
			},
		};
		return (
			<div className={styles.upload}>
				<Modal title={this.state.title} visible={this.state.visible}
							 onOk={this.handleOk} onCancel={this.handleCancel}
							 okText="保存" cancelText="取消"
							 style={{ top: "35%", overflow: 'hidden' }}
				>
					<Form>
						<Spin tip="Loading..." style={{ height: '120%' }} spinning={this.state.loading}>
							<FormItem label='时间' {...{
								labelCol: {
									xs: { span: 24 },
									sm: { span: 4 },
								},
								wrapperCol: {
									xs: { span: 24 },
									sm: { span: 20 },
								},
							}}>
								{getFieldDecorator('date', {
									rules: [{
										required: true, message: '请选择时间',
									}],
								})(
									<RangePicker />
								)}
							</FormItem>
							<p className={styles.p}>
								<span className={styles.icon}></span>
								数据匹配
							</p>
							<Row gutter={8}>
								<Col sm={8}>
									<FormItem label='团队ID:' {...{
										labelCol: {
											xs: { span: 24 },
											sm: { span: 10 },
										},
										wrapperCol: {
											xs: { span: 24 },
											sm: { span: 14 },
										},
									}}>
										<span>第&nbsp;</span>
										{getFieldDecorator('team_id_line', {
											rules: [{
												required: true, message: '请输入列数', type: 'integer'
											}],
										})(
											<InputNumber min={1} style={{ width: '50px' }}/>
										)}
										<span>列</span>
									</FormItem>
								</Col>
								<Col sm={8}>
									<FormItem label='得分:' {...formItemLayout}>
										<span>第&nbsp;</span>
										{getFieldDecorator('kpi_score_line', {
											rules: [{
												required: true, message: '请输入列数', type: 'integer'
											}],
										})(
											<InputNumber min={1} style={{ width: '50px' }}/>
										)}
										<span>列</span>
									</FormItem>
								</Col>
								<Col sm={8}>
									<FormItem label='城市:' {...formItemLayout}>
										<span>第&nbsp;</span>
										{getFieldDecorator('city_line', {
											rules: [{
												required: true, message: '请输入列数', type: 'integer'
											}],
										})(
											<InputNumber min={1} style={{ width: '50px' }}/>
										)}
										<span>列</span>
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col sm={17} id={styles.btn}>
									<FormItem label="文件" {...{
										labelCol: {
											xs: { span: 24 },
											sm: { span: 6 },
										},
										wrapperCol: {
											xs: { span: 24 },
											sm: { span: 18 },
										},
									}}>
										<Col sm={24} style={{ border: '1px solid #e3e3e3', width: '100%', borderRadius: '4px' }}>
											<div>
												<Col sm={14}>
													<div id="showUploadFile" style={{ minWidth: '200px' }}></div>
												</Col>
												<Col sm={10}>
													{getFieldDecorator('file', {
														rules: [{
															required: true, message: '请上传文件'
														}],
													})(
														<Upload {...props}>
															<Button className={styles.resetHover} onClick={this.getToken}>
																<Icon type="upload"/> 点击上传
															</Button>
														</Upload>
													)}
												</Col>

											</div>
										</Col>
									</FormItem>
								</Col>
							</Row>
						</Spin>
					</Form>
				</Modal>
			</div>
		);
	}
}

ModalPage = Form.create()(ModalPage);
export default connect()(ModalPage);
