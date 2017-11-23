import request from '../utils/request';
import qs from 'qs';

// 业务量查询 汇总信息详情
export async function getBusinessDetail(params) {
	return request(`/kpi/gain_business_volume_gather`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 收支查询 汇总信息详情
export async function getBalanceDetail(params) {
	return request(`/kpi/gain_money_io_gather`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 根据（平台、城市、商圈）查询 KPI 数据 (业务量查询[数据维度])
export async function getPlatformList(params) {
	return request(`/kpi/gain_business_volume`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 根据（平台、城市、商圈）查询 KPI 数据 (业务量查询[城市纬维度])
export async function getPlatformCityList(params) {
	return request(`/kpi/gain_city_business_volume`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 根据（平台、城市、商圈）查询 KPI 数据 (收支查询[数据纬度])
export async function getPlatformListBalance(params) {
	return request(`/kpi/gain_money_io`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 根据（平台、城市、商圈）查询 KPI 数据 (收支查询[城市纬度])
export async function getPlatformCityListBalance(params) {
	return request(`/kpi/gain_city_money_io`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 获取平台及平台下的城市
export async function getPlatformAndCityList(params) {
	return request(`/platform/get_platform_and_city`,
		{
			method: 'GET',
		}).then((data) => data);
}

// 根据平台及城市 获取商圈
export async function getAreas(params) {
	return request(`/platform/get_biz_district`,
		{
			method: 'POST',
			body: JSON.stringify(params),
		}).then((data) => data);
}

// 获取账单日期及kpi日期
export async function getGainData(params) {
	return request(`/kpi/gain_data_date`,
		{
			method: 'GET',
		}).then((data) => data);
}
