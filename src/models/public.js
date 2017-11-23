/**
 * Created by dave 2017/4/25
 * public Model
 *
 * */
import { delay } from './../utils/delay';
import { message } from 'antd';
import config from './../../config';
import aoaoBossTools from './../utils/util';
import Permission from './../routes/role/role';
import { NavLight } from './../utils/createdBreadCumb';

export default {

	namespace: 'publicModel',
	state: {
		// 验证码
		verify_code: '',
		// 当前的路由地址
		pathname: '/Account',
		// 当前高亮显示
		key: config.lightKey,
		navList: [],
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(location => {
				const { pathname } = location;
				// 路由地址监听
				dispatch({
					type: 'filterPathnameE',
					payload: pathname,
				});
				if(new Permission().routerFilter(location) == false) {
					window.location.href = "/#/*";
					window.location.reload();
				}
				if (pathname === '/' || pathname === '/login') {
					dispatch({
						type: 'navHighLightE',
						payload: '7',
					});
				} else {
					const routerData = [
						'/Search/Business',
						'/Search/Balance',
						'/Handle/Upload',
						'/Employee/Search',
						'/Employee/Add',
						'/Employee/LeaveFlow',
						'/Account',
						'/System/User',
						'/System/Field',
						'/System/Target'];
					// let key = String(routerData.indexOf(pathname) + 1);
					let key = new NavLight().setKey(pathname);
					// if (key == 0) {
					// 	key = '7';
					// }
					dispatch({
						type: 'navHighLightE',
						payload: key,
					});
					const roleId = aoaoBossTools.readDataFromLocal(1, 'role_id');
					const navList = new Permission().filterNavItem(roleId) || [];
					dispatch({
						type: 'navCreateE',
						payload: navList,
					});
				};

			})
		},
	},

	effects: {
		// 导航高亮
		*navHighLightE({ payload }, { call, put }) {
			config.lightKey = payload;
			yield put({
				type: 'navHighLightR',
				payload: payload,
			})
		},
		// 路由地址
		*filterPathnameE({ payload }, { call, put }) {
			yield put({
				type: 'filterPathnameR',
				payload: payload,
			})
		},
		// 菜单栏
		*navCreateE({ payload }, { call, put }) {
			yield put({
				type: 'navCreateR',
				payload: payload,
			})
		}

	},

	reducers: {
		navHighLightR(state, action) {
			return {
				...state,
				key: action.payload,
			};
		},
		filterPathnameR(state, action) {
			return {
				...state,
				pathname: action.payload,
			}
		},
		navCreateR(state, action) {
			return {
				...state,
				navList: action.payload,
			}
		}
	},

};
