/**
 * Created by dave 2017/4/25
 * 业务量查询
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Tooltip, Icon } from 'antd';
import styles from './business.less';
import aoaoBossTools from './../../utils/util';

class Summary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			focusLeft: true,
			focusRight: false,
			balanceDetail: props.businessDetail,
			kpiDataUpdate: props.kpiDataUpdate,
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			focusLeft: nextProps.focusLeft,
			focusRight: nextProps.focusRight,
			balanceDetail: nextProps.businessDetail,
			kpiDataUpdate: nextProps.kpiDataUpdate,
		})
	}

	render() {
		const data = this.state.kpiDataUpdate.bill_date || '--';
		return (
			<div className={styles.business}>
				<Row>
					<Col sm={12}>
						<div className={styles.lfct2}>
							<div>
								<span className={styles.blueLable2}></span>
								&nbsp;<b>汇总</b>
							</div>
							<div style={{ height: 16 }}></div>
							<Col sm={12} className='mgt8'>
                <span>
                  {`基础配送费：${aoaoBossTools.ToFixed(this.state.balanceDetail.delivery_income, 2)} 元`}
                </span>
							</Col>
							<Col sm={12} className='mgt8'>
                <span>
                  {`手工账单（含KPI收入）：${aoaoBossTools.ToFixed(this.state.balanceDetail.kpi_income, 2)} 元 `}
									{/*<span style={{ color: '#FC5158' }}>(未完全)</span>*/}
									<span>
										<Tooltip title={
											<div>
												<p><b>手工账单（含KPI收入）</b></p>
												<p style={{ fontWeight: 100, width: 170 }}>手工账单数据最新出至{data}日</p>
											</div>}>
    									<span>&nbsp;&nbsp;<Icon type="question-circle-o"/></span>
  									</Tooltip>
									</span>
                </span>
							</Col>
							<Col sm={12} className='mgt8'>
                <span>
                  {`总收入：${aoaoBossTools.ToFixed(this.state.balanceDetail.total_income, 2)} 元 `}
									{/*<span style={{ color: '#FC5158' }}>(未完全)</span>*/}
									<span>
										<Tooltip title={
											<div>
												<p><b>总收入：</b></p>
												<p style={{ fontWeight: 100, width: 170 }}>
													若按时间查询总收入为基础配送费与扣罚的合计；<br/>
													若按账期查询总收入为基础配送费、手工账单和扣罚的合计</p>
											</div>}>
    									<span>&nbsp;&nbsp;<Icon type="question-circle-o"/></span>
  									</Tooltip>
									</span>
                </span>
							</Col>
							<Col sm={12} className='mgt8'>
                <span>
                  {`扣罚：${aoaoBossTools.ToFixed(this.state.balanceDetail.punish, 2)} 元`}
                </span>
							</Col>
						</div>
					</Col>
					<Col sm={12}>
						<div className={styles.rgct2}>
							<div>
								<span className={styles.greenLable2}></span>
								&nbsp;<b>日均</b>
							</div>
							<div style={{ height: 16 }}></div>
							<Col sm={12} className='mgt8'>
                <span>
                  {`基础配送费：${aoaoBossTools.ToFixed(this.state.balanceDetail.avg_delivery_income, 2)} 元`}
                </span>
							</Col>
							<Col sm={12} className='mgt8'>
                <span>
                  {`手工账单（含KPI收入）：${aoaoBossTools.ToFixed(this.state.balanceDetail.avg_kpi_income, 2)} 元 `}
									{/*<span style={{ color: '#FC5158' }}>(未完全)</span>*/}
									<span>
										<Tooltip title={
											<div>
												<p><b>手工账单（含KPI收入）：</b></p>
												<p style={{ fontWeight: 100, width: 170 }}>手工账单数据最新出至{data}日</p>
											</div>}>
    									<span>&nbsp;&nbsp;<Icon type="question-circle-o"/></span>
  									</Tooltip>
									</span>
                </span>
							</Col>
							<Col sm={12} className='mgt8'>
                <span>
                  {`总收入：${aoaoBossTools.ToFixed(this.state.balanceDetail.avg_total_income, 2)} 元 `}
									{/*<span style={{ color: '#FC5158' }}>(未完全)</span>*/}
									<span>
										<Tooltip title={
											<div>
												<p><b>总收入：</b></p>
												<p style={{ fontWeight: 100, width: 170 }}>
													若按时间查询总收入为基础配送费与扣罚的合计；<br/>
													若按账期查询总收入为基础配送费、手工账单和扣罚的合计
												</p>
											</div>}>
    									<span>&nbsp;&nbsp;<Icon type="question-circle-o"/></span>
  									</Tooltip>
									</span>
                </span>
							</Col>
							<Col sm={12} className='mgt8'>
                <span>
                  {`扣罚：${aoaoBossTools.ToFixed(this.state.balanceDetail.avg_punish, 2)} 元`}
                </span>
							</Col>
						</div>
					</Col>
				</Row>
			</div>
		)
	}
}
export default connect()(Summary);
