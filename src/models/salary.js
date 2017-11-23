/**
 * Created by dave 2017/09/25
 * salary Model
 *
 * */
import { message } from 'antd';
import aoaoBossTools from './../utils/util';
import Permission from './../routes/role/role';
import {
	getSalaryListS,
	approveOfSalaryS,
	getSalaryDetailS,
	getFillingMoneyListS,
	approveOfKnightSalaryS,
	getFillingMoneyDetailS,
	createMoneyOrderOfKnightS,
} from './../services/salary';

export default {

	namespace: 'salaryModel',
	state: {
		// 薪资列表
		salaryList: {
			_meta: {
				result_count: 2,
			},
			data: [{
				_id: '1',
			}, {
				_id: '2',
			}],
		},

		// 薪资明细store
		salaryDetail: {},

		// 扣款列表
		fillingMoneyList: {
			_meta: {
				result_count: 2,
			},
			data: [{
				_id: '1',
			}, {
				_id: '2',
			}],
		},

		// 扣补款详情
		knightFillingMessage: {
			fund_list: [],
		},
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				const { pathname } = location;
				switch (pathname) {
					// 薪资详情路由订阅
					case '/Salary/Search/Detail':
						dispatch({
							type: 'getSalaryDetailE',
							payload: {
								_id: location.query.id
							},
						});
						break;
					// 补扣单详情路由订阅
					case '/Salary/FillingMoney/Detail':
						dispatch({
							type: 'getFillingMoneyDetailE',
							payload: {
								_id: location.query.id
							},
						});
						break;
					// 新建骑士扣补款
					case '/Salary/FillingMoney/Create':
						const areaList = aoaoBossTools.getAllAreaFromPermission('biz_district_list');
						dispatch({
							type: 'materials/getKnightListE',
							payload: {
								state: 50,
								position_id_list: [2008, 2009],
								biz_district_id_list: [areaList[0]['biz_district_id']],
								limit: 1000,
								page: 1,
							}
						});
						break;
				}


			})
		},
	},

	effects: {
		// 薪资列表
		*getSalaryListE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			let biz_district_id_list = payload.biz_district_id_list && payload.biz_district_id_list;  // 存储商圈列表
			const value = payload;
			payload = aoaoBossTools.ItemOfArrayToNubmer(value);   // 转换参数数据格式
			payload.biz_district_id_list = biz_district_id_list;  // 商圈列表参数为string,需提前存储
			const result = yield call(getSalaryListS, payload);
			if (result) {
				yield put({
					type: 'getSalaryListR',
					payload: result,
				})
			}
		},

		// 薪资审批
		*approveOfSalaryE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			const result = yield call(approveOfSalaryS, payload);
			if (result.ok) {
				message.success('操作成功');
			}
		},

		// 薪资明细
		*getSalaryDetailE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			const result = yield call(getSalaryDetailS, payload);
			yield put({
				type: 'getSalaryDetailR',
				payload: result,
			})
		},

		// 扣款列表
		*getFillingMoneyListE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			const result = yield call(getFillingMoneyListS, payload);
			yield put({
				type: 'getFillingMoneyListR',
				payload: result,
			})
		},

		// 骑士扣补款审核
		*approveOfKnightSalaryE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			const result = yield call(approveOfKnightSalaryS, payload);
			if (result.ok) {
				message.success('操作成功');
			}
		},

		// 扣补款详情
		*getFillingMoneyDetailE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			const result = yield call(getFillingMoneyDetailS, payload);
			yield put({
				type: 'getFillingMoneyDetailR',
				payload: result,
			})
		},

		// 扣补款新建
		*createMoneyOrderOfKnightE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			const result = yield call(createMoneyOrderOfKnightS, payload);
			if (result.ok) {
				message.success('创建成功');
			}
		},

	},

	reducers: {
		// 薪资列表reducer
		getSalaryListR(state, action) {
			return {
				...state,
				salaryList: action.payload,
			};
		},

		// 薪资明细reducer
		getSalaryDetailR(state, action) {
			return {
				...state,
				salaryDetail: action.payload,
			};
		},

		// 扣款单列表reducer
		getFillingMoneyListR(state, action) {
			return {
				...state,
				fillingMoneyList: action.payload,
			};
		},

		// 扣款单详情reducer
		getFillingMoneyDetailR(state, action) {
			return {
				...state,
				knightFillingMessage: action.payload,
			};
		},

	},

};
