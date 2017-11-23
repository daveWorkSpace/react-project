/**
 * Created by dave 2017/4/ 20
 * */
// import { getVerifyCode, login, loginClear } from '../services/login.js';
import Permission from './../routes/role/role';
import aoaoBossTools from './../utils/util';
import { delay } from './../utils/delay';
import { message } from 'antd';
import catchError from './../utils/catchError';

export default {

	namespace: 'finance',

	state: {
		data: [
		{
			"_id": 14,
			"name": "李四",
			"apply_type": "新租申请",
			"apply_date": "2016-09-21",
			"apply_city": "北京_饿了么",
			"apply_money": "12000",
			"apply_state": "通过",
			"id": ["详情","续租","断组"]
		}
		, {
			"_id": 15,
			"name": "李四",
			"apply_type": "新租申请",
			"apply_date": "2016-09-21",
			"apply_city": "北京_饿了么",
			"apply_money": "12000",
			"apply_state": "通过",
			"id": ["详情","续租","断组"]
		}, {
			"_id": 16,
			"name": "李四",
			"apply_type": "新租申请",
			"apply_date": "2016-09-21",
			"apply_city": "北京_饿了么",
			"apply_money": "12000",
			"apply_state": "通过",
			"id": ["详情","续租","断组"]
		}
		]
	},

	// subscriptions: {
	// 	setup({
	// 		dispatch,
	// 		history
	// 	}) {

	// 	},
	// },

	effects: {
		
	},

	reducers: {

	},

};