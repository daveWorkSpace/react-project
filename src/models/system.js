/**
 * Created by dave 2017/4/25
 * system Model
 *
 * */
import { delay } from './../utils/delay';
import { message } from 'antd';
import {
	getAccountList,
	addAccount,
	updateAccount,
	systemConstant,
	getApproveList,
	getSupplierList,
	editSupplier,
	addSupplierAreaS,
	getSupplierDetailS,
} from './../services/system';
import {
	getEmployeeDetailS,
	getEmployeeListS,
	editEmployeeS,
} from './../services/employee';
import {
	getAreas
} from './../services/account';
import aoaoBossTools from './../utils/util'

export default {

	namespace: 'system',
	state: {
		// 账户列表
		accountList: {
			_meta: {
				result_count: 0,
			},
			data: [],
		},
		// 常量列表
		systemConstantList: {},
		// 离职申请后的员工详情以及添加账户的待筛选员工列表 数据格式为以下 不可更改去除data属性
		employeeDetail: {
			data: [],
			state: 50,
		},
		// 审批人列表
		approveList: {
			superior_list: [],
		},
		// 城市平台信息
		platformList: {
			platform: [],
			cityList: [],
			areaList: [],
		},
		// 供应商列表
		supplierList: {
			data: [],
			_meta: {
				has_more: true,
				result_count: 0,
			}
		},
		// 所有供应商信息
		allSupplierList: {
			data: [],
			_meta: {
				has_more: true,
				result_count: 0,
			}
		},
		// 供应商详情
		supplierDetail: {
			_id: '123',
			biz_district_info_list: [],
			supplier_name: 'aaa',
		},
		// 所有商圈信息
		areaList: {
			biz_district_list: []
		}
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				const { pathname } = location;
				const [limit,page] = [30, 1];  // 默认的分页以及每页数据条数

				switch (pathname) {
					// 供应商详情
					case '/System/EditSupplier':
						dispatch({
							type: 'getSupplierDetailE',
							payload: {
								supplier_id: location.query.id,
							}
						});
						break;
					// 所有供应商
					case '/System/Supplier':
						dispatch({
							type: 'getAllSupplierListE',
							payload: {
								limit: 1000,
								page: 1,
							}
						});
						dispatch({
							type: 'getSupplierListE',
							payload: {
								limit: 1000,
								page: 1,
							}
						});
						dispatch({
							type: 'getAllAreaListE',
							payload: {
								all_biz_district: 100,
							}
						});
						break;
					// 常量
					case '/Account':
						dispatch({
							type: 'getSystemConstantE',
							payload: ''
						});
						break;
					// 用户列表
					case '/System/User':
						dispatch({
							type: 'getAccountListE',
							payload: {
								limit,
								page,
								state: '100',
							}
						});
						dispatch({
							type: 'getAllSupplierListE',
							payload: {
								limit: 1000,
								page: 1,
							}
						});
						break;
					// 用户详情
					case '/Account/PersonalLeave':
						dispatch({
							type: 'getEmployeeDetailOneE',
							payload: {},
						});
						dispatch({
							type: 'getApproveListE',
							payload: {},
						});
						break;
					// 字段管理
					case '/System/Field':
						// dispatch({
						// 	type: '',
						// 	payload: {},
						// });
						break;
					// 指标管理
					case '/System/Target':
						// dispatch({
						// 	type: '',
						// 	payload: {},
						// });
						break;
				}

			})
		},
	},

	effects: {
		// 获取系统常量
		*getSystemConstantE({ payload }, { call, put }) {
			const result = yield call(systemConstant, payload);
			yield put({
				type: 'getSystemConstantR',
				payload: result,
			})
		},
		// 获取账户列表
		*getAccountListE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			const result = yield call(getAccountList, payload);
			yield put({
				type: 'getAccountListR',
				payload: result,
			})
		},
		// 获取员工详情列表
		*getEmployeeDetailOneE({ payload }, { call, put }) {
			const staffId = aoaoBossTools.readDataFromLocal(1, 'staff_id');
			payload.staff_id = staffId;
			const result = yield call(getEmployeeDetailS, payload);
			yield put({
				type: 'getEmployeeDetailOneR',
				payload: result,
			})
		},
		// 获取员工列表
		*getEmployeeListOfAccountE({ payload }, { call, put }) {
			const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = accountId;
			let biz_district_id_list = payload.biz_district_id_list && payload.biz_district_id_list;  // 存储商圈列表
			const value = payload;
			payload = aoaoBossTools.ItemOfArrayToNubmer(value);   // 转换参数数据格式
			payload.biz_district_id_list = biz_district_id_list;  // 商圈列表参数为string,需提前存储
			const result = yield call(getEmployeeListS, payload);
			yield put({
				type: 'getEmployeeDetailOneR',
				payload: result,
			})
		},
		// 获取审批人列表
		*getApproveListE({ payload }, { call, put }) {
			const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = accountId;
			const result = yield call(getApproveList, payload);
			yield put({
				type: 'getApproveListR',
				payload: result,
			})
		},
		// 提出离职申请
		*leaveApplication({ payload }, { call, put }) {
			const staffId = aoaoBossTools.readDataFromLocal(1, 'staff_id');
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.staff_id = staffId;
			payload.account_id = account_id;
			const result = yield call(editEmployeeS, payload);
			if (result.ok) {
				message.success('申请成功');
				yield put({
					type: 'getEmployeeDetailOneE',
					payload: {}
				})
			}
		},
		// 添加账户
		*addAccountE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			const result = yield call(addAccount, payload);
			if (result.ok) {
				/*aoaoBossTools.messageInfo('success','已成功','新的账户已经添加成功',1);*/
				message.success('添加成功');
				yield put({
					type: 'getAccountListE',
					payload: {
						limit: 500,
						page: 1,
					}
				})
			}
		},
		// 编辑账户信息
		*updateAccountE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			const result = yield call(updateAccount, payload);
			if (result.ok) {
				message.success('账户更新成功');
				yield put({
					type: 'getAccountListE',
					payload: {
						limit: 30,
						page: 1,
					}
				})
			}
		},

		// 获取供应商列表
		*getSupplierListE({ payload }, { call, put }) {
			const result = yield call(getSupplierList, payload);
			yield put({
				type: 'getSupplierListR',
				payload: result,
			})
		},

		// 获取所有供应商列表
		*getAllSupplierListE({ payload }, { call, put }) {
			const result = yield call(getSupplierList, payload);
			yield put({
				type: 'getAllSupplierListR',
				payload: result,
			})
		},

		// 禁用供应商
		*disableSupplierE({ payload }, { call, put }) {
			const result = yield call(editSupplier, payload);
			if (result.ok) {
				message.success('操作成功');
				yield put({
					type: 'getSupplierListE',
					payload: {
						limit: 1000,
						page: 1,
					}
				});
			}
		},

		// 添加供应商
		*addSupplierAreaE({ payload }, { call, put }) {
			const result = yield call(addSupplierAreaS, payload);
			if (result.ok) {
				message.success('添加成功');
				location.href = '/#/System/Supplier';
			}
		},

		// 获取供应商详情
		*getSupplierDetailE({ payload }, { call, put }) {
			const result = yield call(getSupplierDetailS, payload);
			yield put({
				type: 'getSupplierDetailR',
				payload: result,
			})
		},

		// 获取所有商圈
		*getAllAreaListE({ payload }, { call, put }) {
			const result = yield call(getAreas, payload);
			yield put({
				type: 'getAllAreaListR',
				payload: result,
			})
		}
	},

	reducers: {
		// 账户列表
		getAccountListR(state, action) {
			return {
				...state,
				accountList: action.payload,
			};
		},
		// 系统常量
		getSystemConstantR(state, action) {
			const constant = JSON.stringify(action.payload);
			window.localStorage.setItem('AOAOBOSS_CONSTANT', constant);
			return {
				...state,
				systemConstantList: action.payload,
			}
		},
		// 员工详情列表
		getEmployeeDetailOneR(state, action) {
			return {
				...state,
				employeeDetail: action.payload,
			}
		},
		// 审批人列表
		getApproveListR(state, action) {
			return {
				...state,
				approveList: action.payload,
			}
		},
		// 员工详情级联数据
		platformListR(state, action) {
			const platform = aoaoBossTools.readDataFromLocal(1, 'region'); // 平台数据
			const platFormCode = aoaoBossTools.getArrayFormObject(platform, 'platform_code');  // 平台id列表
			const cityList = aoaoBossTools.getArrayFromIndex(platform, platFormCode, 'city_name_joint'); // 城市数据
			const cityIdList = aoaoBossTools.getArrayFormObject(cityList, 'city_spelling');  // 城市id列表
			const areaList = aoaoBossTools.getArrayItemIndex(cityList, cityIdList, 'city_spelling'); //  城市下所对应的商圈
			const areaData = aoaoBossTools.getAreaListFromCityList(areaList, cityList); // 商圈信息
			return {
				...state,
				platformList: {
					platform: platform,
					cityList: cityList,
					areaList: areaData,
				},
			}
		},
		// 供应商列表
		getSupplierListR(state, action) {
			return {
				...state,
				supplierList: action.payload,
			}
		},
		// 所有供应商信息
		getAllSupplierListR(state, action) {
			return {
				...state,
				allSupplierList: action.payload,
			}
		},
		// 供应商详情
		getSupplierDetailR(state, action) {
			return {
				...state,
				supplierDetail: action.payload,
			}
		},
		// 商圈信息
		getAllAreaListR(state, action) {
			return {
				...state,
				areaList: action.payload,
			}
		},
		// 商圈添加列表缓存
		setAreaBundleListR(state, action) {
			const { supplierDetail } = state;
			supplierDetail.biz_district_info_list = action.payload;
			return {
				...state,
				supplierDetail,
			}
		}
	},

};
