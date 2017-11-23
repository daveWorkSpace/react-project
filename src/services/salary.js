/**
 * Created by dave 2017/09/25
 * 薪资 service 层
 */

import request from '../utils/request';
import qs from 'qs';

// 获取薪资列表
export async function getSalaryListS(params) {
	return request(`/salary_inquiries/gain_salary_list`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 薪资审批
export async function approveOfSalaryS(params) {
	return request(`/salary_inquiries/salary_audit`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 薪资明细
export async function getSalaryDetailS(params) {
	return request(`/salary_inquiries/gain_salary_detail`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 扣补款单列表
export async function getFillingMoneyListS(params) {
	return request(`/deduction_and_payment/deduction_and_payment_list`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 扣补款单审核
export async function approveOfKnightSalaryS(params) {
	return request(`/deduction_and_payment/deduction_and_payment_audit`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 扣补款单详情
export async function getFillingMoneyDetailS(params) {
	return request(`/deduction_and_payment/deduction_and_payment_detail`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 扣补款单新建
export async function createMoneyOrderOfKnightS(params) {
	return request(`/deduction_and_payment/create_deduction_and_payment`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}
