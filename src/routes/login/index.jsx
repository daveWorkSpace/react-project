/**
 * Created by dave 2017/4/20
 * 登录业务组件
 *
 **/
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Input, Checkbox, Icon, Row, Col, message }  from 'antd';
import styles from './style/login.less';
import lgBg from './static/loginBg.jpg';
import logo from './static/logo.png';
const FormItem = Form.Item;

class Login extends Component {
	constructor() {
		super();
		this.state = {
			appInfo: '',
		}
	};

	// 获取验证码
	getVerificationCode = () => {
		const { dispatch } = this.props;
		const { getFieldsValue, validateFields } = this.props.form;
		validateFields(['phone'], function (error) {
			const value = getFieldsValue();
			if (error) {
				return;
			} else {
				dispatch({
					type: 'login/getVerifyCodeE',
					payload: { phone: value.phone },
				});
			}
		});
	};

	// 登录
	handleSubmit = () => {
		const { dispatch } = this.props;
		const { getFieldsValue, validateFields } = this.props.form;
		validateFields((error) => {
			if (error) {
				return;
			} else {
				const data = getFieldsValue();
				dispatch({
					type: 'login/loginE',
					payload: {
						phone: data.phone,
						verify_code: data.verifyCode,
						app_code: 'aoao_boss',
					}
				});
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;

		return (
			<div id={styles.login} className="login">
				{/*<img src={lgBg} alt="" className={styles.lgbg}/>*/}
				<div className={styles.centerBox}>
					<div className={styles.logoBox}>
						<img src={logo} alt="" className={styles.logo}/>
					</div>
					<div id={styles.title}>
						<div className="textCenter">
							<span className={styles.line}></span>
							<p>嗷嗷BOSS系统</p>
							<span className={styles.line}></span>
						</div>
					</div>
					<Form>
						<FormItem className={styles.input}>
							{getFieldDecorator('phone', {
								rules: [{
									required: true,
									trigger: 'onBlur',
									validateTrigger: 'onFous',
									validator: (rule, value, callback) => {
										if (value == '') {
											callback('请输入手机号码');
											return;
										}
										;
										if (!(/^1[34578]\d{9}$/.test(value))) {
											callback('请输入正确的手机号码');
											return;
										}
										callback();
									}
								}],
							})(
								<Input placeholder="请输入手机号"/>
							)}
						</FormItem>
						<Row className={styles.input}>
							<Col sm={15}>
								<FormItem>
									{getFieldDecorator('verifyCode', {
										rules: [{ required: true, message: '您输入的验证码有误,请重新输入！' }],
									})(
										<Input placeholder="请输入验证码"/>
									)}
								</FormItem>
							</Col>
							<Col sm={1}></Col>
							<Col sm={8}>
								<FormItem>
									<Button className={styles.barCode} onClick={this.getVerificationCode}>获取验证码</Button>
								</FormItem>
							</Col>
						</Row>

						<FormItem>
							<Button type="primary" className={`${styles.input} loginBtn`} onClick={this.handleSubmit}>
								<span>登录</span>
							</Button>
						</FormItem>
					</Form>
				</div>
			</div>
		)
	}
}
Login = Form.create()(Login);

export default connect()(Login);
