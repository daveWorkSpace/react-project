/**
 * Created by dave 2017/4/25
 * 业务量查询
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col } from 'antd';
import styles from './business.less';
import aoaoBossTools from './../../utils/util';

class Summary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			focusLeft: true,
			focusRight: false,
			businessDetail: props.businessDetail,
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			focusLeft: nextProps.focusLeft,
			focusRight: nextProps.focusRight,
			businessDetail: nextProps.businessDetail
		})
	}

	render() {
		const avgEfficiency = Number(this.state.businessDetail.avg_efficiency).toFixed(2);

		return (
			<div className={styles.business}>
				<Row>
					<Col sm={12}>
						<div className={styles.lfct}>
							<div>
								<span className={styles.blueLable}></span>
								&nbsp;<b>汇总</b>
							</div>
							<div style={{ height: 16 }}></div>
							<Col sm={12} className='mgt8'>
                <span>
                  {`单量： ${this.state.businessDetail.valid_order_count} 单`}
                </span>
							</Col>
							<Col sm={12} className='mgt8'>
                <span>
                  {`出勤人数： ${this.state.businessDetail.attendance_number} 人`}
                </span>
							</Col>
							<Col sm={12} className='mgt8'>
                <span>
                  {`人效： ${avgEfficiency} 单/人`}
                </span>
							</Col>
						</div>
					</Col>
					<Col sm={12}>
						<div className={styles.rgct}>
							<div>
								<span className={styles.greenLable}></span>
								&nbsp;<b>日均</b>
							</div>
							<div style={{ height: 16 }}></div>
							<Col sm={12} className='mgt8'>
                <span>
                  {`单量： ${aoaoBossTools.ToFixed(this.state.businessDetail.avg_valid_order_count, 2)} 单`}
                </span>
							</Col>
							<Col sm={12} className='mgt8'>
                <span>
                  {`出勤人数： ${aoaoBossTools.ToFixed(this.state.businessDetail.avg_attendance_number, 2)} 人`}
                </span>
							</Col>
							<Col sm={12} className='mgt8'>
                <span>
                  {`人效： ${avgEfficiency} 单/人`}
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
