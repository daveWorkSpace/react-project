/**
 * Created by dave 2017/7/25
 * Employee Model
 *
 * */
import { message } from 'antd';
import {
	getUploadTkoen,
	postFileToQINIU,
	getQINIUimgUrl,
} from './../services/upload';
import {
	editEmployeeS,
	getEmployeeDetailS,
	AddEmployeeS,
	exportEmployeeS,
	getEmployeeListS,
} from './../services/employee';
import aoaoBossTools from './../utils/util';

export default {

	namespace: 'employee',
	state: {
		employeeList: {
			data: [],
			_meta: {
				result_count: 0,
			},
		},
		employeeDetail: {
			name: 'zhangsan',
			education: '',
			phone: '',
			gender_id: '',
			national: '',
			emergency_contact_phone: '',
			identity_card_id: '',
			associated_identity_card_id: '',
			identity_card_front: '',
			identity_card_back: '',
			bank_card_id: '',
			bank_branch: '',
			bank_card_front: '',
			bust: '',
			health_certificate: '',
			platform_list: [],
			biz_district_list: [],
			city_list: [],
			state: '',
			position_id: '',
			job_category_id: '',
			recruitment_channel_id: '',
			entry_date: '',
			contract_belong_id: '',
		},    // 员工详情
		token: '',    	       // 七牛token
		path: '',    		       // 七牛文件地址
		loading: false,        // 动画开关
		field: '',             // 对应图片字段
		download_url: '',      // 导出文件地址
		leaveDetail: {
			name: 'xiaoming',
			phone: '11111',
			platform_list: [],
			city_list: [],
			biz_district_list: [],
			job_category_id: 'www',
			position_id: 1001,
			state: 500,
			_id: 'aaaaa',
		},       // 离职详情
		ModalFlag: false,      // 离职Modal 显示开关
		imgKeyList: {          // 员工图片详情
			identity_card_front: '',
			health_certificate: '',
			bust: '',
			bank_card_front: '',
			contract_photo: '',
			identity_card_back: '',
		},
		platformList: {
			platform: [],
			cityList: [],
			areaList: [],
		}
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				const { pathname } = location;
				// 查询员工详情
				if (pathname == '/Employee/Edit' || pathname == '/Employee/Detail') {
					dispatch({
						type: 'getEmployeeDetailE',
						payload: {
							staff_id: location.query.id,
						},
					});

					dispatch({
						type: 'platformListR',
						payload: {},
					});
				}
				// 查询员工列表
				if (pathname === '/Employee/Search') {
					dispatch({
						type: 'getEmployeeListE',
						payload: {
							limit: 30,
							page: 1,
							state: 50,
						},
					})
				}
				// 查询离职员工列表
				if (pathname === '/Employee/LeaveFlow') {
					const departureApproverAccountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
					dispatch({
						type: 'getEmployeeListE',
						payload: {
							limit: 30,
							page: 1,
							state: 1,
							departure_approver_account_id: departureApproverAccountId,
						},
					})
				}
			})
		},
	},

	effects: {
		// 获取七牛的token
		*getUploadTokenE({ payload }, { call, put }) {
			const result = yield call(getUploadTkoen, payload);
			// 更新相应的图片字段
			yield put({
				type: 'imgFieldR',
				payload: payload,
			});
			if (result.ok) {
				yield put({
					type: 'getUploadTokenR',
					payload: result.token,
				});
				yield put({
					type: 'getUploadPathR',
					payload: result.path,
				});
			}
		},
		// 上传文件到七牛
		*postFileToQINIUE({ payload }, { call, put }) {
			// form形式上传文件
			if (payload.token) {
				let formdata = new FormData();
				formdata.append('key', payload.key);
				formdata.append('token', payload.token);
				formdata.append('file', payload.file);
				// 上传成功后七牛返回的key
				const result = yield call(postFileToQINIU, formdata);
				if (result.key) {
					// 根据七牛的key去获取相应文件的地址
					const resultUrl = yield call(getQINIUimgUrl, { target_id: payload.key, name: payload.field });
					if (resultUrl.ok) {
						// 通知reducer 更新相应的图片地址
						yield put({
							type: 'getEmployeeDetailImgR',
							payload: {
								name: resultUrl.name,
								url: resultUrl.url,
								key: resultUrl.target_id,
							}
						});
					}
					yield put({
						type: 'getUploadLoadingR',
						payload: false,
					});
					message.success('上传成功');
				}
			}
		},
		// 获取员工列表
		*getEmployeeListE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			let biz_district_id_list = payload.biz_district_id_list && payload.biz_district_id_list;  // 存储商圈列表
			const value = payload;
			payload = aoaoBossTools.ItemOfArrayToNubmer(value);   // 转换参数数据格式
			payload.biz_district_id_list = biz_district_id_list;  // 商圈列表参数为string,需提前存储
			const result = yield call(getEmployeeListS, payload);
			yield put({
				type: 'getEmployeeListR',
				payload: result,
			})
		},
		// 获取员工离职待审核列表
		*getEmployeeLeaveListE({ payload }, { call, put }) {
			const leaveId = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.departure_approver_account_id = leaveId;
			const accountId = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = accountId;
			let biz_district_id_list = payload.biz_district_id_list && payload.biz_district_id_list;  // 存储商圈列表
			const value = payload;
			payload = aoaoBossTools.ItemOfArrayToNubmer(value);   // 转换参数数据格式
			payload.biz_district_id_list = biz_district_id_list;  // 商圈列表参数为string,需提前存储
			const result = yield call(getEmployeeListS, payload);
			yield put({
				type: 'getEmployeeListR',
				payload: result,
			})
		},
		// 编辑员工
		*employeeEditE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			if(payload.entry_date) {
				payload.entry_date = aoaoBossTools.prctoMinute(payload.entry_date, 0);
			}
			payload.account_id = account_id;
			const result = yield call(editEmployeeS, payload);
			if (result.ok) {
				message.success('操作成功');
				location.href = '/#/Employee/Search';
				yield put({
					type: 'getEmployeeListE',
					payload: {
						limit: 30,
						page: 1,
						state: '50',
					}
				})
			}
		},
		// 获取员工详情
		*getEmployeeDetailE({ payload }, { call, put }) {
			const result = yield call(getEmployeeDetailS, payload);
			yield put({
				type: 'getEmployeeDetailR',
				payload: result,
			});
		},
		// 添加员工
		*employeeAddE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			payload.entry_date = aoaoBossTools.prctoMinute(payload.entry_date, 0);
			const result = yield call(AddEmployeeS, payload);
			if (result.ok) {
				message.success('添加成功');
				location.href = '/#/Employee/Search';
			}
		},
		// 导出员工
		*exportEmployeeE({ payload }, { call, put }) {
			const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
			payload.account_id = account_id;
			const result = yield call(exportEmployeeS, payload);
			if (result.ok) {
				aoaoBossTools.downloadURI(result.download_url, 'test');
			}else {
				message.error(result.message);
			}
		},
	},

	reducers: {
		// 获取七牛的token
		getUploadTokenR(state, action) {
			return {
				...state,
				token: action.payload,
			};
		},
		// 员工详情中的图片
		getEmployeeDetailImgR(state, action) {
			const { employeeDetail, imgKeyList } = state;
			employeeDetail[action.payload.name] = action.payload.url;
			imgKeyList[action.payload.name] = action.payload.key;
			return {
				...state,
				employeeDetail,
				imgKeyList,
			};
		},
		// 员工详情
		getEmployeeDetailR(state, action) {
			return {
				...state,
				employeeDetail: action.payload,
			};
		},
		// 七牛key
		getUploadPathR(state, action) {
			return {
				...state,
				path: action.payload,
			};
		},
		// 上传动画开关
		getUploadLoadingR(state, action) {
			return {
				...state,
				loading: action.payload,
			};
		},
		// 相关照片字段
		imgFieldR(state, action) {
			return {
				...state,
				field: action.payload,
			}
		},
		// 员工列表
		getEmployeeListR(state, action) {
			return {
				...state,
				employeeList: action.payload,
			}
		},
		// 导出员工列表
		exportEmployeeR(state, action) {
			return {
				...state,
				download_url: action.payload,
			}
		},
		// 员工离职详情
		getEmployeeLeaveDetailR(state, action) {
			return {
				...state,
				leaveDetail: action.payload,
			}
		},
		// 员工详情模板显示开关
		ModalFlagR(state, action) {
			return {
				...state,
				ModalFlag: action.payload,
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
		}
	},

};
