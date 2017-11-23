import React from "react";
import { connect } from "dva";
import { Row, Col, Input, Upload, DatePicker, Button, Form, Modal } from 'antd';
import style from '../../employee/search/search.less';
import MoreInfo from './moreInfo';
const FormItem = Form.Item;

class FinanceApplyRelet extends React.Component{
	constructor(){
		super();
		this.state = {
			visible : false
		};
	}

	// 点击发送按钮
	handleSend(){

	}

	// 点击返回按钮
	handleReset(){

	}
	// 点击添加更多信息
	handleAddMoreInfo(){
		this.setState({
  			visible : true
  		})
	}

	// 点击模态框的取消按钮
	handleCancel(){
		this.setState({
	        visible: false
	    });
	}
	// 点击确认按钮
	handleOk(){

	}

	render(){
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		return (
			<div className={style.information}>
				<div className="mgt16">
					<div className="mgb8">
						<span className={style.greenLable}></span>
						<span className="mgl8">
							<b>站点信息</b>
						</span>
						<span style={{float:'right'}}>
							<b>申请日期：2017-06-01</b>
						</span>
					</div>
					<p className={`${style.top}`}></p>
					<Row className='mgl32'>
						<Col sm={6}>
							<span>物理站点名称：宇宙biubiu站</span>
						</Col>
						<Col sm={6}>
							<span>城市：北京饿了么</span>
						</Col>
						<Col sm={6}>
							<span>房屋类型：站点</span>
						</Col>
						<Col sm={6}>
							<span>覆盖商圈：朝阳、四惠</span>
						</Col>
					</Row>
				</div>

				<div className="mgt16">
					<div className="mgb8">
						<span className={style.greenLable}></span>
						<span className="mgl8">
							<b>合同信息</b>
						</span>
					</div>
					<p className={`${style.top}`}></p>
					<Row className='mgl32'>
						<Col sm={6}>
							<span>是否开具发票：是</span>
						</Col>
						<Col sm={6}>
							<span>月租金（含税）：5000元</span>
						</Col>
						<Col sm={6}>
							<span>合同租期：2017-06-01 ~ 2018-06-01</span>
						</Col>
						<Col sm={6}>
							<span>押金：5000元</span>
						</Col>
					</Row>

					<Row className='mgl32' style={{marginTop:'30px'}}>
						<Col sm={6}>
							<span>次付款月数：2月/次</span>
						</Col>
						<Col sm={6}>
							<span>房屋地址：朝阳区汇通河畔1004号</span>
						</Col>
						<Col sm={6}>
							<span>房屋面积：100 m2</span>
						</Col>
					</Row>

					<Row className='mgl32' style={{marginTop:'30px'}}>
						<p>合同拍照</p>
						<span style={{marginLeft:50,width:100,height:120,display:'inline-block',textAlign:'center',marginRight:30}}>
							<img style={{width:100,height:100}}/>
							<b>图片名称.jpg</b>
						</span>
						<span style={{width:100,height:120,display:'inline-block',textAlign:'center'}}>
							<img style={{width:100,height:100}}/>
							<b>图片名称.jpg</b>
						</span>
					</Row>
					<Row className='mgl32' style={{marginTop:'30px'}}>
						<p>收据拍照</p>
						<span style={{marginLeft:50,width:100,height:120,display:'inline-block',textAlign:'center',marginRight:30}}>
							<img style={{width:100,height:100}}/>
							<b>图片名称.jpg</b>
						</span>
						<span style={{width:100,height:120,display:'inline-block',textAlign:'center'}}>
							<img style={{width:100,height:100}}/>
							<b>图片名称.jpg</b>
						</span>
					</Row>
				</div>

				<div className="mgt16">
					<div className="mgb8">
						<span className={style.greenLable}></span>
						<span className="mgl8">
							<b>支付信息</b>
						</span>
					</div>
					<p className={`${style.top}`}></p>
					<Form>
						<Row>
							<Col sm={8}>
								<FormItem {...formItemLayout} label={`房租收款人`}>
									{getFieldDecorator(`name`, {
										rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
									})(
										<Input placeholder="请输入姓名"/>
									)}
								</FormItem>
							</Col>
							<Col sm={8}>
								<FormItem {...formItemLayout} label={`收款账户`}>
									{getFieldDecorator(`account`, {
										rules: [{ required: false,type: 'string', message: '请选择平台'}],
									})(
										<Input placeholder="请输入卡号"/>
									)}
								</FormItem>
							</Col>
							<Col sm={8}>
								<FormItem label='开户支行' {...formItemLayout}>
									{getFieldDecorator('accountBank', {
										rules: [{
											type: 'string', message: '请选择开户行',
										}, {
											required: false, message: '请选择开户行',
										}],
									})(
										<Input placeholder="请输入全称"/>
									)}
								</FormItem>
							</Col>
						</Row>
						<Row style={{marginTop:'16px'}}>
							<Col className='mgl16'>
								<Button type="primary" onClick={this.handleAddMoreInfo.bind(this)}>点击添加其他费用信息</Button>
							</Col>
						</Row>

						<Row style={{marginTop:'30px'}}>
							<Col className='textRight' sm={11}>
								<Button type="primary" onClick={this.handleSend}>发送</Button>
							</Col>
							<Col sm={2}></Col>
							<Col className='textLeft' sm={11}>
								<Button onClick={this.handleReset}>返回</Button>
							</Col>
						</Row>
					</Form>
				</div>
				<div>
					<Modal
			          	title="其他费用"
			          	visible={this.state.visible}
			          	onCancel={this.handleCancel.bind(this)}
			          	width = '450px'
			          	onOk={this.handleOk.bind(this)} 
						okText="确认" 
						cancelText="取消"
			        >
			        	<MoreInfo handleCancel={this.handleCancel.bind(this)}></MoreInfo>
			        </Modal>
				</div>
			</div>
		)
	}
}

function mapStateToProps({finance}) {
  return {finance};
}
export default connect(mapStateToProps)(Form.create()(FinanceApplyRelet));
