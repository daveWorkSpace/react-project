import React from "react";
import { connect } from "dva";
import { Row, Col, Input, Upload, DatePicker, Button } from 'antd';
import style from '../../employee/search/search.less';

class FinanceApplyDetail extends React.Component{
	constructor(){
		super();
		this.state = {};
	}

	// 点击返回按钮
	handleBack(){

	}

	render(){
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
					<Row className='mgl32'>
						<Col sm={6}>
							<span>收款人姓名：张三</span>
						</Col>
						<Col sm={6}>
							<span>收款人银行卡号：2222222</span>
						</Col>
						<Col sm={6}>
							<span>开户行：建设银行广渠路支行</span>
						</Col>
					</Row>
					<Row className='mgl32' style={{marginTop:'30px'}}>
						<Col sm={6}>
							<span>其他费用金额：1000元</span>
						</Col>
						<Col sm={6}>
							<span>收款人：张三</span>
						</Col>
						<Col sm={6}>
							<span>收款人银行卡号：222222</span>
						</Col>
						<Col sm={6}>
							<span>开户行：建设银行广渠路支行</span>
						</Col>
					</Row>
					<Row className='mgl32' style={{marginTop:'30px'}}>
						<Col sm={6}>
							<span>支付租期：2017-06-01 ~ 2017-08-01</span>
						</Col>
					</Row>
				</div>
				<Row style={{marginTop:'30px'}}>
					<Col className='textRight' sm={12}>
						<Button type="primary" onClick={this.handleBack}>返回</Button>
					</Col>
				</Row>
			</div>
		)
	}

}

function mapStateToProps({finance}) {
  return {finance};
}
export default connect(mapStateToProps)(FinanceApplyDetail);