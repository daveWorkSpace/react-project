import request from '../utils/request';
import qs from 'qs';

// 获取验证码
export async function getVerifyCode(params) {
	return request(`/auth/send_verify_code?${qs.stringify(params)}`,
		{
			method: 'GET',
		}, "X-AUTH").then((data) => data);
}

// 登录
export async function login(params) {
	return request(`/auth/login`,
		{
			method: 'post',
			body: JSON.stringify(params),
		}, "X-AUTH").then((data) => data);
}

// 注销登录
export async function loginClear(params) {
	return request(`/auth/logout`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}, "X-AUTH").then((data) => data);
}
