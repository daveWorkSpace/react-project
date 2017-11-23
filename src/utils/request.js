import fetch from 'dva/fetch';
const create_Head = require('./createHead');
import config from "./../../config";
import catchError from './catchError';
import { message } from 'antd';
const baseUrl = config.prod;
const refreshTokenUrl = config.refreshToken;
const localInfoNameSpace = config.nameSpace;
const hours = config.hours;
/*
 *封装的请求方法
 * post 用的是Json 方法
 * */
function parseJSON(response) {
	return response.json();
}

function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}
	if (response.status >= 400 && response.status < 500) {
		return response;
	}
	if (response.status == 500) {
		throw("网络错误");
		return response;
	}

	return response;
}


function request(api, options, type) {
	const accountInfo = JSON.parse(window.localStorage.getItem(localInfoNameSpace));
	if (accountInfo != undefined) {
		refreshToken();
	}
	let _options = options || { method: 'GET' };
	let _api = baseUrl + api;
	_options.headers = {};
	if (['https://upload-z1.qbox.me'].indexOf(api) !== -1) {
		_api = api;
	} else {
		_options.headers = create_Head(type ? 'X-AUTH' : 'X-TOKEN');
		if (_options.method !== 'GET') {
			_options.headers["Content-Type"] = "application/json";
		}
		;
	}

	Object.assign(_options, {
		"mode": "cors",
	});
	return fetch(_api, _options)
		.then(checkStatus)
		.then(parseJSON)
		.then((data) => {
			if(data) {
				if (data.err_code) {
					return message.error(catchError.error(data));
				} else {
					return data
				}
			}else {
				message.error('服务器异常错误');
			}
		})
		.catch(function (err) {
			return err
		});
}

// 判断token是否过期

function refreshToken() {
	let timestamp = Date.parse(new Date());
	const head = create_Head('X-TOKEN');
	head["Content-Type"] = "application/json";
	timestamp = timestamp / 1000;
	const accountInfo = JSON.parse(window.localStorage.getItem(localInfoNameSpace));
	if (accountInfo != undefined) {
		if (accountInfo.expired_at < timestamp) {
			message.error('账户过期请重新登录');
			window.localStorage.removeItem(localInfoNameSpace);
			window.location.href = "/#/";
			window.location.reload();
			return;
		}
		// 提前一天刷新token
		else if (accountInfo.expired_at - timestamp < 3600 * hours && accountInfo.expired_at - timestamp > 0) {
			fetch(`${baseUrl}${refreshTokenUrl}`,
				{
					method: 'POST',
					headers: head,
					body: JSON.stringify({
						refresh_token: accountInfo.refresh_token
					})
				}).then(checkStatus)
				.then(parseJSON)
				.then(function (data) {
					if (data.err_code) {
						if (data.err_code == 415001 || data.err_code == 415002) {
							const timer = setTimeout(() => {
								window.localStorage.removeItem('AOAOBOSS');
								window.location.href = '/#/';
								window.location.reload();
								clearTimeout(timer);
							}, 1000);
							return message.error('请重新登录');
						}
					} else {
						const refresh_result = data;
						let accountInfo = JSON.parse(window.localStorage.getItem(localInfoNameSpace));
						accountInfo.expired_at = refresh_result.expired_at;
						accountInfo.access_token = refresh_result.access_token;
						accountInfo.refresh_token = refresh_result.refresh_token;
						accountInfo.account_id = refresh_result.account_id;
						accountInfo = JSON.stringify(accountInfo);
						window.localStorage.setItem(localInfoNameSpace, accountInfo);
					}
				}).catch(function (err) {
				return err
			});
		}
	} else {
		window.localStorage.removeItem(localInfoNameSpace);
		return;
	}
}

export  default  request;
