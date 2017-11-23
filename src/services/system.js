import request from '../utils/request';
import qs from 'qs';

// 系统管理 获取用户列表
export async function getAccountList(params) {
	return request(`/account/gain_account_list`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 系统管理 获取用户列表
export async function getApproveList(params) {
	return request(`/account/gain_superior_list`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 系统管理 添加账户
export async function addAccount(params) {
	params.role_id = Number(params.role_id);
	return request(`/account/`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 系统管理 修改账户
export async function updateAccount(params) {
	params.role_id = Number(params.role_id);
	return request(`/account/update`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 系统常量
export async function systemConstant(params) {
	return request(`/constants/`,
		{
			method: 'GET',
		}).then((data) => data);
}

// 供应商列表
export async function getSupplierList(params) {
	return request(`/supplier/gain_supplier_list`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 编辑供应商
export async function addSupplierAreaS(params) {
	return request(`/supplier/`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 编辑供应商
export async function editSupplier(params) {
	return request(`/supplier/update`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 供应商详情
export async function getSupplierDetailS(params) {
	return request('/supplier/get_supplier_info',
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data)
}
