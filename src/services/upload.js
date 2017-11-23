import request from '../utils/request';
import qs from 'qs';

// 获取七牛的token
export async function getUploadTkoen(params) {
	return request(`/upload/get_token`,
		{
			method: 'GET',
		}).then((data) => data);
}

// 获取上传文件记录
export async function getUploadList(params) {
	return request(`/upload/get_upload_record?${qs.stringify(params)}`,
		{
			method: 'GET',
		}).then((data) => data);
}

// 上传导入的kpi数据信息
export async function postUploadFile(params) {
	return request(`/upload/get_upload_data`,
		{
			method: 'POST',
			mode: "no-cors",
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 获取上传文件后的校验数据
export async function postCheckFileDetail(params) {
	return request(`/upload/`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}
// 文件上传七牛
export async function postFileToQINIU(params) {
	return request('https://upload-z1.qbox.me', {
		method: "POST",
		body: params
	}).then((data) => data)
}
// 获取七牛图片地址
export async function getQINIUimgUrl(params) {
	return request(`/upload/get_url?${qs.stringify(params)}`, {
		method: "GET",
	}).then((data) => data)
}
