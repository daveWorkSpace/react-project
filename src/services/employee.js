import request from '../utils/request';
import qs from 'qs';

// 编辑员工
export async function editEmployeeS(params) {
	return request(`/staff/update_staff_info`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}
// 员工详情
export async function getEmployeeDetailS(params) {
	return request(`/staff/get_staff_info`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}
// 员工列表
export async function getEmployeeListS(params) {
	return request(`/staff/gain_staff_list`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}
// 添加员工
export async function AddEmployeeS(params) {
	return request(`/staff/`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 导出员工
export async function exportEmployeeS(params) {
	return request(`/staff/download_staff_list`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}
