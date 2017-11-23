/**
 * Created by dave 2017/09/24
 * 骑士补款详情
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Button } from 'antd';
import { Link } from 'react-router';
import Table from './../../../components/table';
import Information from './../../../components/informationTemplate';

class Detail extends Component {
	constructor(props) {
		super();
		this.state = {
			info: {
				topTitle: '汇总信息',
				content: [{
					sm: 8,
					title: '年月',
					data: props.salaryModel.knightFillingMessage.month && props.salaryModel.knightFillingMessage.month,
				}, {
					sm: 8,
					title: '总人数',
					data: props.salaryModel.knightFillingMessage.total_people && props.salaryModel.knightFillingMessage.total_people,
				}, {
					sm: 8,
					title: '总金额',
					data: props.salaryModel.knightFillingMessage.total_money && props.salaryModel.knightFillingMessage.total_money,
				}]
			},
			columns: [{
				title: '城市',
				dataIndex: 'city_name_joint',
				key: 'city_name_joint',
			}, {
				title: '商圈',
				dataIndex: 'biz_district_name',
				key: 'biz_district_name',
			}, {
				title: '骑士',
				dataIndex: 'name',
				key: 'name',
			}, {
				title: '手机号',
				dataIndex: 'phone',
				key: 'phone',
			}, {
				title: '补款金额',
				dataIndex: 'fund_amount',
				key: 'fund_amount',
			}, {
				title: '原因',
				dataIndex: 'fund_reason',
				key: 'fund_reason',
			},],
			dataSource: props.salaryModel.knightFillingMessage.fund_list && props.salaryModel.knightFillingMessage.fund_list,
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			info: {
				topTitle: '扣款详情',
				content: [{
					sm: 8,
					title: '年月',
					data: nextProps.salaryModel.knightFillingMessage.month && nextProps.salaryModel.knightFillingMessage.month,
				}, {
					sm: 8,
					title: '总人数',
					data: nextProps.salaryModel.knightFillingMessage.total_people && nextProps.salaryModel.knightFillingMessage.total_people,
				}, {
					sm: 8,
					title: '总金额',
					data: nextProps.salaryModel.knightFillingMessage.total_money && nextProps.salaryModel.knightFillingMessage.total_money,
				}]
			},
			dataSource: nextProps.salaryModel.knightFillingMessage.fund_list && nextProps.salaryModel.knightFillingMessage.fund_list,
		})
	}

	render() {
		return (
			<div className="mgt16">
				<Information {...this.state.info}/>
				<Table columns={this.state.columns} dataSource={this.state.dataSource}/>
				<Row type="flex" justify="center">
					<Col className='mgt16'>
						<Button className='mgl16'><Link to="Salary/FillingMoney">返回</Link></Button>
					</Col>
				</Row>
			</div>)
	}
}

const mapStateToProps = ({ salaryModel }) => {
	return { salaryModel };
};

export default connect(mapStateToProps)(Detail);
