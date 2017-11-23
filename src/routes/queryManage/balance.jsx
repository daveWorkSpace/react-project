/**
 * Created by dave 2017/4/25
 * 业务量查询
 * @string  LEFT 数据查询
 * @string  RIGHT 城市查询
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Pagination, Form } from 'antd';
import Tab from './tabs';
import Search from './search';
import Summary from './balanceDetail';
import styles from './business.less';
import Table from './../../components/table';
import columns from './columns';
import aoaoBossTools from './../../utils/util';

class Balance extends Component {
	constructor(props) {
		super(props);
		const data = aoaoBossTools.GetDateStr(-2);
		this.state = {
			focusLeft: true,
			focusRight: false,
			dataSource: [],
			columns: columns.balanceDataColumns,
			total: props.business.kpiDataList._meta.result_count,
			page: 1,
			current: 1,
			pageSize: 30,
			resetFields: 'COLLECT',   // 清除Form状态  COLLECT: 收集数据  CLEAR: 清除状态
			searchValues: {
				platform_code_list: ['elem'],		// 默认平台 饿了么
				city_list: [],									// 默认所有的城市
				start_date: data,								// 默认前天
				end_date: data,									// 默认前天
			},					// 查询条件
			balanceDetail: props.business.balanceDetail,
			kpiDataUpdate: props.business.kpiDataUpdate,
			PlatformAndCityList: props.business.PlatformAndCityList,
			areaList: props.business.areaList.biz_district_list,
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			balanceDetail: nextProps.business.balanceDetail,
			dataSource: nextProps.business.kpiDataList.data,
			total: nextProps.business.kpiDataList._meta.result_count,
			kpiDataUpdate: nextProps.business.kpiDataUpdate,
			PlatformAndCityList: nextProps.business.PlatformAndCityList,
			areaList: nextProps.business.areaList.biz_district_list,
		})
	}

	typeChange = (type) => {
		this.clearFormState();
		// 获取默认数据（按数据查询）
		const { dispatch } = this.props;
		const data = aoaoBossTools.GetDateStr(-2);
		dispatch({
			type: 'business/balanceDataE',
			payload: {
				platform_code_list: ['elem'],		// 默认平台 饿了么
				city_list: [],									// 默认所有的城市
				start_date: data,								// 默认前天
				end_date: data,									// 默认前天
			},
		});

		// 左右 tab 切换的回调
		switch (type) {
			case 'LEFT':
				this.setState({
					focusLeft: true,
					focusRight: false,
					current: 1,
					columns: columns.balanceDataColumns,
				});
				// 默认列表信息
				dispatch({
					type: 'business/getKpiDataListBalanceE',
					payload: {
						platform_code_list: ['elem'],
						city_list: [],
						start_date: data,
						end_date: data,
						page: 1,
						limit: 30,
					},
				});
				break;
			case 'RIGHT':
				this.setState({
					focusLeft: false,
					focusRight: true,
					current: 1,
					columns: columns.balanceCityColumns,
				});
				// 默认列表信息
				dispatch({
					type: 'business/getCityKpiDataListBalanceE',
					payload: {
						platform_code_list: ['elem'],
						city_list: [],
						start_date: data,
						end_date: data,
						page: 1,
						limit: 30,
					},
				});
				break;
		}
	};

	// 查询
	handleSearch = (values) => {
		const { dispatch } = this.props;
		// 统计详情信息
		dispatch({
			type: 'business/balanceDataE',
			payload: values,
		});
		this.setState({
			searchValues: values,
			current: 1,
		});
		values.limit = this.state.pageSize;
		values.page = this.state.page;
		// 判断 tab 通知不同的 store
		const focus = this.state.focusLeft;
		if(focus) {
			dispatch({
				type: 'business/getKpiDataListBalanceE',
				payload: values,
			})
		}else {
			dispatch({
				type: 'business/getCityKpiDataListBalanceE',
				payload: values,
			})
		}

	};

	// 查询商圈
	handleSearchArea = (values) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'business/getAreaListE',
			payload: values,
		});
	};

	// 分页
	pageChange = (page, pageSize) => {
		let values = this.state.searchValues;
		this.setState({
			current: page,
			pageSize: pageSize,
		});
		values.page = page;
		values.limit = pageSize;
		const { dispatch } = this.props;
		// 判断 tab 通知不同的 store
		const focus = this.state.focusLeft;
		if(focus) {
			dispatch({
				type: 'business/getKpiDataListBalanceE',
				payload: values,
			})
		}else {
			dispatch({
				type: 'business/getCityKpiDataListBalanceE',
				payload: values,
			})
		}

	};

	// 清除 Form 状态
	clearFormState = () => {
		this.setState({
			resetFields: 'CLEAR'
		})
	};

	// 重置 Form 开关
	clearReset = () => {
		this.setState({
			resetFields: 'COLLECT'
		});
	};

	render() {
		const props = {
			focusLeft: this.state.focusLeft,
			focusRight: this.state.focusRight,
			columns: this.state.columns,
			dataSource: this.state.dataSource,
			total: this.state.total,
			page: this.state.page,
			current: this.state.current,
			pageSize: this.state.pageSize,
			resetFields: this.state.resetFields,
			businessDetail: this.state.balanceDetail,
			kpiDataUpdate: this.state.kpiDataUpdate,
			PlatformAndCityList: this.state.PlatformAndCityList,
			areaList: this.state.areaList,
		};

		return (
			<div className={styles.business}>
				<Tab {...props}
						 typeChange={this.typeChange}/>
				<Search {...props}
								clearReset={this.clearReset}
								search={this.handleSearch}
								searchArea={this.handleSearchArea}/>
				<Summary {...props}/>
				<Table {...props}/>
				<div className="fltr">
					{
						this.state.total > 0 ?
							<Pagination onChange={this.pageChange}
													className="mgt8"
													total={this.state.total}
													showTotal={total => `总共 ${total} 条，${this.state.pageSize}条/页 `}
													pageSize={this.state.pageSize}
													current={ this.state.current }/>
							: ''
					}
				</div>
			</div>
		)
	}
}

function mapStateToProps({ business }) {
	return { business }
}
export default connect(mapStateToProps)(Balance);
