/**
 * Created by dave 2017/4/25
 * public Model
 * @xxxxxE namespace  effect
 * @xxxxxR namespace  reducers
 *
 * */
import { message } from 'antd';
import { getBusinessDetail,
	getPlatformList,
	getPlatformAndCityList,
	getAreas,
	getGainData,
	getBalanceDetail,
	getPlatformListBalance,
	getPlatformCityList,
	getPlatformCityListBalance,
} from './../services/business';
import aoaoBossTools from './../utils/util';

export default {

	namespace: 'business',
	state: {
		// 业务查询 汇总信息详情
		businessDetail: {
			valid_order_count: '--', 			// 总单量
			avg_valid_order_count: '--',  // 每日平均单量
			attendance_number: '--', 			// 总出勤人数
			avg_efficiency: '--', 				// 平均人效
			avg_attendance_number: '--',  // 每日平均出勤人数
		},
		// 收支汇总信息
		balanceDetail: {
			delivery_income: '--', 			// 运单总收入
			punish: '--',  							// 扣罚总金额
			avg_punish: '--', 					// 日均扣罚
			total_income: '--', 				// 总收入
			kpi_income: '--',  					// kpi总收入
			avg_delivery_income: '--',  // 日均运单收入
			avg_kpi_income: '--',  			// 日均kpi收入
			avg_total_income: '--',  		// 日均总收入
		},
		// 平台及城市数据
		PlatformAndCityList: {
			platform_list: [],
		},
		// kpi数据
		kpiDataList: {
			_meta: {
				has_more: false,
				result_count: 0,
			},
			data: [],
		},
		// 商圈数据
		areaList: {
			biz_district_list: [],
		},
		// 数据更新时间
		kpiDataUpdate: {
			bill_date: '--',
			kpi_date: '--',
		}
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen((location) => {
				const { pathname } = location;
				if (pathname === '/Search/Business') {
					const accountInfo = JSON.parse(window.localStorage.getItem('AOAOBOSS'));
					const data = aoaoBossTools.GetDateStr(-2);
					// 初始业务汇总信息
					dispatch({
						type: 'businessDataE',
						payload: {
							platform_code_list: ['elem'],		// 默认平台 饿了么
							city_list: [],									// 默认所有的城市
							start_date: data,								// 默认前天
							end_date: data,									// 默认前天
						},
					});
					// 平台及城市
					dispatch({
						type: 'getPlatformAndCityListE',
						payload: '',
					});
					// 初始 kpi 数据
					dispatch({
						type: 'getKpiDataListE',
						payload: {
							platform_code_list: ['elem'],
							city_list: [],
							start_date: data,
							end_date: data,
							page: 1,
							limit: 30,
						},
					});

					// 账单的更新日期
					dispatch({
						type: 'getGainDataE',
						payload: {},
					});

				}
				// 收支查询观察者模式
				if (pathname === '/Search/Balance') {
					const data = aoaoBossTools.GetDateStr(-2);
					// 初始业务汇总信息
					dispatch({
						type: 'balanceDataE',
						payload: {
							platform_code_list: ['elem'],		// 默认平台 饿了么
							city_list: [],									// 默认所有的城市
							start_date: data,								// 默认前天
							end_date: data,									// 默认前天
						},
					});
					// 平台及城市
					dispatch({
						type: 'getPlatformAndCityListE',
						payload: '',
					});
					// 初始 kpi 数据
					dispatch({
						type: 'getKpiDataListBalanceE',
						payload: {
							platform_code_list: ['elem'],
							city_list: [],
							start_date: data,
							end_date: data,
							page: 1,
							limit: 30,
						},
					});

					// 账单的更新日期
					dispatch({
						type: 'getGainDataE',
						payload: {},
					});

				}
			})
		},
	},

	effects: {
		// 业务量查询 汇总信息
		*businessDataE({ payload }, { call, put }) {
			delete payload.query_type;
			const result = yield call(getBusinessDetail, payload);
			if(result!=undefined){
				yield put({
					type: 'businessDataR',
					payload:  result,
				});
			}
		},

		// 收支查询 汇总信息
		*balanceDataE({ payload }, { call, put }) {
			const result = yield call(getBalanceDetail, payload);
			if(result!=undefined){
				yield put({
					type: 'balanceDataR',
					payload:  result,
				});
			}
		},

		// 获取平台及城市列表
		*getPlatformAndCityListE({ payload }, { call, put }) {
			const result = yield call(getPlatformAndCityList, payload);
			if(result!=undefined){
				yield put({
					type: 'getPlatformAndCityListR',
					payload: result,
				})
			}
		},
		// 获取商圈
		*getAreaListE({ payload }, { call, put }) {
			const result = yield call(getAreas, payload);
			if(result!=undefined){
				yield put({
					type: 'getAreaListR',
					payload: result,
				})
			}
		},
		//  获取 kpi 数据列表(业务量查询[数据])
		*getKpiDataListE({ payload }, { call, put }) {
			delete payload.query_type;
			payload.sort = -1;
			const result = yield call(getPlatformList, payload);
			if(result!=undefined){
				yield put({
					type: 'getKpiDataListR',
					payload: result,
				})
			}
		},
		//  获取 kpi 数据列表(业务量查询[城市])
		*getCityKpiDataListE({ payload }, { call, put }) {
			delete payload.query_type;
			payload.sort = -1;
			const result = yield call(getPlatformCityList, payload);
			if(result!=undefined){
				yield put({
					type: 'getKpiDataListR',
					payload: result,
				})
			}
		},
		//  获取 kpi 数据列表(收支查询[数据])
		*getKpiDataListBalanceE({ payload }, { call, put }) {
			delete payload.query_type;
			payload.sort = -1;
			const result = yield call(getPlatformListBalance, payload);
			if(result!=undefined){
				yield put({
					type: 'getKpiDataListR',
					payload: result,
				})
			}
		},
		//  获取 kpi 数据列表(收支查询[城市])
		*getCityKpiDataListBalanceE({ payload }, { call, put }) {
			delete payload.query_type;
			payload.sort = -1;
			const result = yield call(getPlatformCityListBalance, payload);
			if(result!=undefined){
				yield put({
					type: 'getKpiDataListR',
					payload: result,
				})
			}
		},
		//  获取账单日期及kpi日期
		*getGainDataE({ payload }, { call, put }) {
			delete payload.query_type;
			const result = yield call(getGainData, payload);
			if(result!=undefined){
				yield put({
					type: 'getGainDataR',
					payload: result,
				})
			}
		},

	},

	reducers: {
		// 业务量查询汇总信息
		businessDataR(state, action) {
			return {
				...state,
				businessDetail: action.payload,
			}
		},
		// 收支查询汇总信息
		balanceDataR(state, action) {
			return {
				...state,
				balanceDetail: action.payload,
			}
		},
		// 平台及城市数据
		getPlatformAndCityListR(state, action) {
			return {
				...state,
				PlatformAndCityList: action.payload,
			};
		},
		// 商圈信息
		getAreaListR(state, action) {
			return {
				...state,
				areaList: action.payload,
			};
		},
		// 业务量查询列表数据
		getKpiDataListR(state, action) {
			return {
				...state,
				kpiDataList: action.payload,
			};
		},
		//
		getGainDataR(state, action) {
			return {
				...state,
				kpiDataUpdate: action.payload,
			}
		}
	},
};
