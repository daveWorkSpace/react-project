/**
 * Created by dave 2017/4/25
 * 业务量查询
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './business.less';

const data = '2017/4/25'
class Tab extends Component {
	constructor(props) {
		super(props);
		this.state = {
			focusLeft: true,
			focusRight: false,
			kpiDataUpdate: props.kpiDataUpdate,
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			focusLeft: nextProps.focusLeft,
			focusRight: nextProps.focusRight,
			kpiDataUpdate: nextProps.kpiDataUpdate,
		})
	}

	// 通知父级更改 tab 高亮，从而切换 content
	typeChange(type) {
		this.props.typeChange(type);
	};

	render() {
		return (
			<div className={styles.business}>
				<div className={`${styles.tab} ftw4`}>
					<div className={this.state.focusLeft === true ? styles.tabSelected : ''}
							 onClick={this.typeChange.bind(this, 'LEFT')}>商圈
					</div>
					<div className={this.state.focusRight === true ? styles.tabSelected : ''}
							 onClick={this.typeChange.bind(this, 'RIGHT')}>城市
					</div>
				</div>
				<div className="mgt8">
					手工账单数据已出至{this.state.kpiDataUpdate && this.state.kpiDataUpdate.bill_date && this.state.kpiDataUpdate.bill_date || '--'}日，
					最新账单数据已出至{this.state.kpiDataUpdate && this.state.kpiDataUpdate.newest_data_date && this.state.kpiDataUpdate.newest_data_date || '--'}日
				</div>
			</div>
		)
	}
}
export default connect()(Tab);
