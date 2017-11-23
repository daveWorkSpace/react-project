/**
 * Created by dave 2017/4/ 20
 * */
import { getVerifyCode, login, loginClear } from '../services/login.js';
import Permission from './../routes/role/role';
import aoaoBossTools from './../utils/util';
import { delay } from './../utils/delay';
import { message } from 'antd';
import catchError from './../utils/catchError';

export default {

	namespace: 'login',

	state: {
		verify_code: '',
	},

	subscriptions: {
		setup({ dispatch, history }) {
			/*history.listen(location => {
			 const {pathname} = location;
			 const accountInfo = JSON.parse(window.localStorage.getItem('AOAOBOSS'));
			 if (accountInfo == null) {
			 if (pathname !== '/login' && pathname !=='/') {
			 window.location.href = '/#/login'
			 }
			 } else {
			 if (pathname === '/login' || pathname ==='/') {
			 window.location.href = '/#/index'
			 }
			 }
			 })*/
		},
	},

	effects: {
		// 获取验证码
		*getVerifyCodeE({ payload }, { call, put }) {
			const result = yield call(getVerifyCode, payload);
			if (result.ok) {
					message.success(`验证码发送成功`, 2);
			} else if(result.verify_code) {
				message.success(`验证码为 ${result.verify_code}`, 2);
			}else {
				/*message.error(catchError.error(result), 2);*/
			}
		},
		// 登录
		*loginE({ payload }, { call, put }) {
			const result = yield call(login, payload);
			if (!result || result.err_code) {
				/*message.error(`登录失败,${catchError.error(result)}`, 3);*/
				return;
			} else {
				//存储token,方便调用
				const accountInfo = JSON.stringify(result);
				if(accountInfo!=undefined) {
					window.localStorage.setItem('AOAOBOSS', accountInfo);
					const account = JSON.parse(window.localStorage.getItem('AOAOBOSS'));
					if (account != undefined) {
						message.success('登录成功');
						// Todo 待优化的动态菜单栏数据源
						const roleId = aoaoBossTools.readDataFromLocal(1, 'role_id');
						const navList = new Permission().filterNavItem(roleId);
						yield put({
							type: 'publicModel/navCreateR',
							payload: navList,
						});
						window.location.href = '/#/Account';
						window.location.reload();
					} else {
						message.error('登录失败，请重试');
					}
				}else {
					return;
				}

			}
		},
		// 注销登录
		*loginClear({ payload }, { call, put }) {
			const account = JSON.parse(window.localStorage.getItem('AOAOBOSS'));
			payload = {
				access_token: account.access_token // 注销的用户 token
			};
			const result = yield call(loginClear, payload);
			if (!result || result.err_code) {
				message.error(`退出失败${result.message}`, 2);
			} else if(result.ok) {
				message.success('注销成功', 1);
				setTimeout(function() {
					window.localStorage.removeItem('AOAOBOSS');
					location.href='/#/';
					window.location.reload();
				}, 500);

			}
		},
	},

	reducers: {
		getVerifyCodeR(state, action) {
			return {
				...state,
				verify_code: action.payload,
			};
		},
	},

};
