import config from './../../config';
import { Alert } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';

const aoaoBossTools = {
	// 时间戳转换为 y-m-d h:m:s
	utctoTime: function (timestamp) {
		var date = new Date(timestamp);
		var Y, M, D, h, m, s;
		Y = date.getFullYear() + '-';
		M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		D = date.getDate() + ' ';
		h = date.getHours() + ':';
		m = date.getMinutes() + ':';
		s = date.getSeconds();
		return (Y + M + D + h + m + s);
	},
	// 时间戳转换为 y/m/d h:m
	utctoMinute: function (timestamp) {
		var year, month, day, hours, minnute, s;
		var timestamp = timestamp * 1000;
		var date = new Date(timestamp);
		year = date.getFullYear() + '/';
		month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
		day = (date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ');
		hours = (date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':');
		minnute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
		return (year + month + day + hours + minnute);
	},
	// 排序
	sortNumber: function (a, b) {
		return a - b
	},
	/**
	 * 将 prc 时间格式转换为 year-month-day  hour:minute:seconds
	 * @ method prctoMinute
	 * @ param {string,integer}
	 *  string 为 prc 时间格式，
	 *  integer: {
	 *   1: month
     *   0: year
     *   2：minutes
     *   3：second
     *  }
	 *
	 * @ return {string}
	 */
	prctoMinute: function (prc, lengths) {
		let dates = new Date(prc);
		let length = lengths || 3;
		const [y,m,d,h,min,sec] = [dates.getFullYear(), dates.getMonth() + 1, dates.getDate(), dates.getHours(), dates.getMinutes(), dates.getSeconds()];
		let stringDate = {
			date: [y, this.checkIsBiger10(m), this.checkIsBiger10(d)],
			time: [this.checkIsBiger10(h), this.checkIsBiger10(min), this.checkIsBiger10(sec)]
		};
		stringDate.time.length = length;
		if (length === 0) {
			return `${stringDate.date.join('-')}`
		} else if (length === 1) {
			const [data, data2] = stringDate.date;
			const value = [data, data2];
			return `${value.join('-')}`;
		} else {
			return `${stringDate.date.join('-')} ${stringDate.time.join(':')}`;
		}
	},
	checkIsBiger10: function (num) {
		return num >= 10 ? num : ('0' + num);
	},
	// 下载的url
	downloadURI: function (url, name) {
		let link = document.createElement("a");
		link.download = name;
		link.href = url;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		link = null;

	},
	// 数据处理
	numberDateToStr: function (num) {
		const date = num + '';
		return `${date.substr(0, 4)}-${date.substr(4, 2)}-${date.substr(6, 2)}`;
	},
	// 给数组添加分隔符
	sqlit: function (arr, type) {
		var s = arr[0];
		for (var i = 1; i < arr.length; i++) {
			s = s + type + arr[i];
		}
		return s;
	},
	// 日期格式整理
	utcToDate: function (dateStr) {
		const date = new Date(dateStr);
		const [y,m,d,h,min,sec] = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
		return {
			date: [y, this.checkIsBiger10(m), this.checkIsBiger10(d)],
			time: [this.checkIsBiger10(h), this.checkIsBiger10(min), this.checkIsBiger10(sec)]
		};
	},
	// 获取某个月的天数
	getMonthDays: function (month) {
		const demo = new Date();
		const [y,m,d] = [demo.getFullYear(), demo.getMonth() + 1, demo.getDate()];
		var month = month ? month * 1 : m;
		if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) !== -1) {
			return 31;
		}
		;
		if ([4, 6, 9, 11].indexOf(month) !== -1) {
			return 30;
		}
		const temp = new Date(`${y}/3/0`);
		return temp.getDate();
	},
	// 日期的格式化
	dateFormat(stamp) {
		const date = stamp ? new Date(stamp) : new Date();
		const [y,m,d] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
		return [y, m >= 10 ? m : ('0' + m), d >= 10 ? d : ('0' + d)];
	},
	// 刷新token
	refreshToken() {
		var timestamp = Date.parse(new Date());
		const head = create_Head('X-AUTH');
		head["Content-Type"] = "application/json";
		timestamp = timestamp / 1000;
		const accountInfo = JSON.parse(window.localStorage.getItem(config.nameSpace));
		if (accountInfo) {
			if (accountInfo.expired_at < timestamp) {
				window.localStorage.removeItem(config.nameSpace);
				window.location.href = "/#/login";
			}
			// 提前一天刷新token
			if (accountInfo.expired_at - timestamp < 3600 * 24) {
				fetch(`${config.prod}${config.refreshToken}`,
					{
						method: 'POST',
						headers: head,
						body: JSON.stringify({
							refresh_token: accountInfo.refresh_token
						})
					}).then(checkStatus)
					.then(parseJSON)
					.then(function (data) {
						const refresh_result = data;
						let accountInfo = JSON.parse(window.localStorage.getItem(config.nameSpace));
						accountInfo.expired_at = refresh_result.expired_at;
						accountInfo.access_token = refresh_result.access_token;
						accountInfo.refresh_token = refresh_result.refresh_token;
						accountInfo = JSON.stringify(accountInfo);
						window.localStorage.setItem(config.nameSpace, accountInfo);
					}).catch(function (err) {
					return err
				});
			}
		}
	},
	//判断是否是数组
	isArray(value){
		return Object.prototype.toString.call(value) == [object, Array];
	},

	/** TODO 暂不支持 多天数  只支持昨天
	 * createdTime
	 * 生成固定格式的时间
	 * @params day string
	 * day => YESTERDAY:昨天  BYESTERDAY:前天 TWO:前两天 THREE:前三天  WEEK:过去一周 MONTH:这个月
	 * */
	createdTime(day) {
		var Y, M, D, h, m, s;
		var date = new Date();
		Y = date.getFullYear();
		M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
		D = date.getDate();
		h = date.getHours();
		m = date.getMinutes();
		s = date.getSeconds();
		switch (day) {
			case 'YESTERDAY':
				if (D - 1 === 0) {
					const m = this.getMonthDays(M);
					return (`${Y}-${M - 1}-${m}`)
				} else {
					return (`${Y}-${M}-${D - 1}`);
				}
				break;
			case 'BYESTERDAY':
				if (D - 2 <= 0) {
					const m = this.getMonthDays(M);
					return (`${Y}-${M - 1}-${m}`)
				} else {
					return (`${Y}-${M}-${D - 2}`);
				}
				break;
			case 'TWO':
				return (Y + M + D);
				break;
			case 'THREE':
				return (Y + M + D);
				break;
			case 'WEEK':
				return (Y + M + D);
				break;
			case 'MONTH':
				return (Y + M + D);
				break;

		}
		return (Y + M + D + h + m + s);
	},
	// messageInfo: function (type, title, text) {
	// 	const box = document.getElementById('message');
	// 	box.style.zIndex = 999;
	// 	const num = (Math.random()) * (Math.random()) * (3 - Math.random());
	// 	switch (type) {
	// 		case 'success':
	// 			return ReactDOM.render(<Alert
	// 				message={title}
	// 				description={text}
	// 				type="success"
	// 				closable
	// 				showIcon
	// 				onClose={this.onClose}
	// 				key={num}
	// 			/>, document.getElementById('message'));
	// 		default:
	// 			return ReactDOM.render(<Alert
	// 				message={title}
	// 				description={text}
	// 				type="warning"
	// 				closable
	// 				showIcon
	// 				onClose={this.onClose}
	// 				key={num}
	// 			/>, document.getElementById('message'));
	// 	}
	// },
	onClose() {
		const box = document.getElementById('message');
		/*box.innerHTML='';*/
		location.href = '/#/System/User';
		box.style.zIndex = '-999';
	},
	GetDateStr: function (AddDayCount) {
		var dd = new Date();
		dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
		var y = dd.getFullYear();
		var m = dd.getMonth() + 1//获取当前月份的日期
		var d = dd.getDate();
		m = this.checkIsBiger10(m)
		d = this.checkIsBiger10(d)
		return y + "-" + m + "-" + d;
	},
	// 从数组中某一值所对应索引获取该数组下其他元素为数组的值
	getArrayFromIndex: function (data, array, type) {
		const types = type || 'city';
		let newArray = [];
		if (data.length == 0) {
			return;
		} else {
			for (var i = 0; i < data.length; i++) {
				const item = data[i].platform_code && data[i].platform_code || '';
				for (var j = 0; j < array.length; j++) {
					if (array[j] === item) {
						for (var k = 0; k < data[i].city_list.length; k++) {
							newArray.push(data[i].city_list[k]);
						}
					}
				}
			}
			;
			return this.removeRepeatItem(newArray, types);
		}
	},
	// 城市数组去重
	removeRepeatItem: function (a, type) {
		var ret = [],
			hash = {};
		for (var i = 0, len = a.length; i < len; i++) {
			var item = a[i][type];
			var items = a[i];
			var key = typeof(item) + item;
			if (hash[key] !== 1) {
				ret.push(items);
				hash[key] = 1;
			}
		}
		return ret;
	},
	// 浮点数保留两位小数
	ToFixed: function (a, b) {
		return Number(a).toFixed(b);
	},
	// 系统枚举值转换
	enumerationConversion(params) {
		const data = {
			// 性别
			'10': '男',
			'20': '女',
			// 审批
			'51': '申请离职',
			'52': '同意',
			'53': '驳回',
			'6001': '审核成功',
			'6002': '审核中',
			'6003': '审核失败',
			// 状态
			'100': '启用',
			'-100': '禁用',
			// 合同归属
			'4001': '趣活',
			'4002': '伯渡',
			'4003': '盛世昌达',
			'4004': '众鑫',
			// 职位
			'2020': '客户',
			'2003': '总监',
			'2004': '城市经理',
			'2005': '城市助理',
			'2006': '调度',
			'2007': '站长',
			'2008': '骑士长',
			'2009': '骑士',
			// 角色
			'1000': '超级管理员',
			'1001': 'COO',
			'1002': '运营管理',
			'1003': '总监',
			'1004': '城市经理',
			'1005': '城市助理',
			'1006': '调度',
			'1007': '站长',
			'1008': '采购',
			'1020': '客户',
			// 工作类型
			'3001': '全职白班',
			'3002': '全职夜班',
			'3003': '全职早餐',
			'3004': '兼职',
			// 骑士状态
			'50': '在职',
			// '0': '待审核',
			'-50': '离职',
			'1': '离职待审核',
			// 招聘渠道
			'5001': '第三方',
			'5002': '个人',
			'5003': '其他',
			'': '--',
			// 供应商状态
			'60': '启用',
			'-60': '禁用',
			// 物资模块
			'80': '启用',  // 物资品目启用
			'-80': '禁用', // 物资品目禁用
			'301': '一次性',
			'302': '月付',
			'303': '押金',
			'601': '紧急',
			'602': '一般',
			'603': '不紧急',
			'8001': '采购',
			'8002': '报废',
			'8003': '报错',
			'8004': '分发',
			'8005': '退货',
			'9001': '采购待审核',
			'9002': '采购审核通过',
			'9003': '采购审核不通过',
			'9004': '报错待审核',
			'9005': '报错审核通过',
			'9006': '报错审核不通过',
			'9007': '报废待审核',
			'9008': '报废审核通过',
			'9009': '报废审核不通过',
			'9010': '待骑士确认收货',
			'9011': '骑士已确认收货',
			'9012': '骑士未收货',
			'9013': '退货申请待审核',
			'9014': '退货申请审核通过',
			'9015': '退货申请审核不通过',
			// 薪资管理
			'10001': '待审核',
			'10002': '审核通过',
			'10003': '未通过',
		};
		if (data.hasOwnProperty(params)) {
			return data[params];
		}
	},
	// 系统常量
	filterSystemConstant(type) {
		const constants_list = {
			"action_type": [
				{
					"constant_id": "51",
					"constant_name": "申请离职"
				},
				{
					"constant_id": "52",
					"constant_name": "同意"
				},
				{
					"constant_id": "53",
					"constant_name": "驳回"
				}
			],
			"contract_belong": [
				{
					"constant_id": "4001",
					"constant_name": "趣活"
				},
				{
					"constant_id": "4002",
					"constant_name": "伯渡"
				},
				{
					"constant_id": "4003",
					"constant_name": "盛世昌达"
				},
				{
					"constant_id": "4004",
					"constant_name": "众鑫"
				}
			],
			"gender": [
				{
					"constant_id": "10",
					"constant_name": "男"
				},
				{
					"constant_id": "20",
					"constant_name": "女"
				}
			],
			"job_category": [
				{
					"constant_id": "3001",
					"constant_name": "全职白班"
				},
				{
					"constant_id": "3002",
					"constant_name": "全职夜班"
				},
				{
					"constant_id": "3003",
					"constant_name": "全职早餐"
				},
				{
					"constant_id": "3004",
					"constant_name": "兼职"
				}
			],
			"position": [
				{
					"constant_id": "2020",
					"constant_name": "客户"
				},
				{
					"constant_id": "2003",
					"constant_name": "总监"
				},
				{
					"constant_id": "2004",
					"constant_name": "城市经理"
				},
				{
					"constant_id": "2005",
					"constant_name": "城市助理"
				},
				{
					"constant_id": "2006",
					"constant_name": "调度"
				},
				{
					"constant_id": "2007",
					"constant_name": "站长"
				},
				{
					"constant_id": "2008",
					"constant_name": "骑士长"
				},
				{
					"constant_id": "2009",
					"constant_name": "骑士"
				}
			],
			"position_state": [
				{
					"constant_id": "1",
					"constant_name": "审核中"
				},
				{
					"constant_id": "50",
					"constant_name": "在职"
				},
				{
					"constant_id": "-50",
					"constant_name": "离职"
				}
			],
			"recruitment_channel": [
				{
					"constant_id": "5001",
					"constant_name": "第三方"
				},
				{
					"constant_id": "5002",
					"constant_name": "个人"
				},
				{
					"constant_id": "5003",
					"constant_name": "其他"
				}
			],
			"role": [
				{
					"constant_id": "1000",
					"constant_name": "超级管理员"
				},
				{
					"constant_id": "1001",
					"constant_name": "COO"
				},
				{
					"constant_id": "1002",
					"constant_name": "运营管理"
				},
				{
					"constant_id": "1003",
					"constant_name": "总监"
				},
				{
					"constant_id": "1004",
					"constant_name": "城市经理"
				},
				{
					"constant_id": "1005",
					"constant_name": "城市助理"
				},
				{
					"constant_id": "1006",
					"constant_name": "调度"
				},
				{
					"constant_id": "1007",
					"constant_name": "站长"
				},
				{
					"constant_id": "1020",
					"constant_name": "客户"
				}
			],
			"state": [
				{
					"constant_id": "100",
					"constant_name": "启用"
				},
				{
					"constant_id": "-100",
					"constant_name": "禁用"
				}
			],
			"verify_state": [
				{
					"constant_id": "6001",
					"constant_name": "审核成功"
				},
				{
					"constant_id": "6002",
					"constant_name": "审核中"
				},
				{
					"constant_id": "6003",
					"constant_name": "审核失败"
				}
			]
		};
		if (constants_list.hasOwnProperty(type)) {
			return constants_list[type];
		}
		;
	},
	/**
	 * 从本地读取数据
	 * @params {localType} init  1:本地缓存AOAOBOSS
	 * @params {type} string  1:缓存对象的字段名
	 * @return
	 */
	readDataFromLocal(localType, type) {
		const local = window.localStorage.getItem('AOAOBOSS');
		if (local !== undefined && local !== 'null' && local !== null) {
			let localData = [];
			if (localType == 1) {
				localData = JSON.parse(window.localStorage.getItem('AOAOBOSS'));
			} else if (localType == 2) {
				localData = JSON.parse(window.localStorage.getItem('AOAOBOSS_CONSTANT')).constants_list;
			} else {
				return;
			}
			try {
				if (localData.hasOwnProperty(type)) {
					return localData[type];
				}
			}
			catch (e) {
				const message = new Error('未找到');
				console.error(message);
			}
		}
	},
	// 获取对应的index值
	getArrayItemIndex(array, itemValue, key) {
		const data = array || [];
		const keyArray = itemValue || [];
		let indexArray = [];
		try {
			if (key == []) {
				return;
			}
			// let index = 0;
			for (let i = 0; i < data.length; i++) {
				for (let j = 0; j < keyArray.length; j++) {
					if (data[i][key] == keyArray[j]) {
						indexArray.push(i);
					}
				}
			}
			return indexArray;
		} catch (e) {
			console.error('未找到');
		}
	},
	// 递归获取数组元素
	traversalObject(obj) {
		let dataArray = [];
		for (var a in obj) {
			if (typeof (obj[a]) == "object") {
				this.traversalObject(obj[a]); //递归遍历
			}
			else {
				// dataArray.push(obj);
				this.createAreaList.push(obj);
			}
		}
		// return dataArray;
	},
	createAreaList: [],

	/**
	 * 提取数据源为数组中object元素中某个key及value
	 * @params data {array} 数据源
	 * @params key {string} 键
	 * @return array {array} 新的数组
	 */
	getArrayFormObject(data, key) {
		const array = [];
		try {
			if (Array.isArray(data) == true && key !== undefined) {
				for (let i = 0; i < data.length; i++) {
					array.push(data[i][key]);
				}
				return array;
			} else {
				// return new Error('type not found');
			}
		}
		catch (e) {
			console.error(e.message);
		}
	},
	/**
	 * 转换请求参数中数据为数组，数组中的元素为String 将String 转换为 Number
	 * @params data {object} 请求参数
	 * @return data {object}
	 */
	ItemOfArrayToNubmer: function (data) {
		const value = {};
		this.createAreaList = [];
		// Object.assign(value, data);
		for (let a in data) {
			value[a] = data[a];
			if (Array.isArray(value[a])) {
				if (value[a][0] * 1 > 0) {
					let newArray = [];
					for (let i = 0; i < value[a].length; i++) {
						newArray.push(Number(value[a][i]));
					}
					value[a] = newArray;
				}
			}
		}
		return value;
	},
	/**
	 * 将两个数组中的差异元素过滤出来
	 * @params start {array} 数据一
	 * @params end {array} 数据二
	 * @return data {array} 结果
	 */
	filterDiffOfArray: function (start, end) {
		const data = [];
		let startValue = start || [];
		let endValue = end || [];
		for (var i = 0; i < startValue.length; i++) {
			if (endValue.indexOf(startValue[i]) === -1) {
				data.push(startValue[i]);
			}
		}
		return data;
	},
	/**
	 * 对照俩个数组，并移除其中一个数组中相同的元素
	 * @params arrayFilter {array} 需要移除的数组
	 * @params arrayList {array} 对照的数组
	 * @return data {array} 结果
	 *
	 */
	removeItemOfFilter(arrayFilters, arrayList) {
		const data = [];
		const arrayFilter = arrayFilters || [];
		const arrayLists = arrayList || [];
		for (var i = 0; i < arrayFilter.length; i++) {
			if (arrayLists.indexOf(arrayFilter[i]) != -1) {
				arrayFilter[i] = '';
			}
		}
		for (let i = 0; i < arrayFilter.length; i++) {
			if (arrayFilter[i] !== '') {
				data.push(arrayFilter[i]);
			}
		}
		return data;
	},
	/**
	 * 从级联数据城市中获取商圈列表
	 * @params keyList {array} 城市数据
	 * @params cityData {array} 城市数据
	 * @return areaData {array} 商圈结果
	 */
	getAreaListFromCityList: function (keyList, cityData) {
		let areaArray = [];
		let areaData = [];
		keyList.forEach(function (item, index) {
			areaArray.push(cityData[item].biz_district_list);
		});
		for (var i = 0; i < areaArray.length; i++) {
			areaArray[i].forEach(function (item, index) {
				areaData.push(item);
			})
		}
		return areaData;
	},
	/**
	 * 提取列表中的id 组成新的数组
	 * @params data {array} 数据源
	 * @params key {string} 键
	 * @return idList {array} 返回id列表
	 */
	getIdFromArrayInfo: function (data, key) {
		const idList = [];
		for (let i = 0; i < data.length; i++) {
			idList.push(data[i][key]);
		}
		return idList;
	},
	/**
	 * 获取当前权限拥有的商圈信息
	 * @params key {string} 平台|城市|商圈
	 * @return allList {array} 相应的所有数据列表
	 */
	getAllAreaFromPermission: function (key) {
		let allList = [];
		const data = this.readDataFromLocal(1, 'region');
		switch (key) {
			case 'platform_code':
				data.forEach((item, index) => {
					allList.push(item);
				});
				break;
			case 'city_list':
				data.forEach((item, index) => {
					for (let i = 0; i < item[key].length; i++) {
						allList.push(item[key][i]);
					}
				});
				break;
			case 'biz_district_list':
				data.forEach((item, index) => {
					for (let i = 0; i < item['city_list'].length; i++) {
						for (let k = 0; k < item['city_list'][i][key].length; k++) {
							allList.push(item['city_list'][i][key][k]);
						}
					}
				});
				break;
		}
		// 数组去重
		allList = [...new Set(allList)];
		return allList;
	},
	/**
	 * 骑士付款方式转换
	 * @params way {string} 骑士付款方式
	 * @param data {object} 骑士信息
	 * @return price {string} 骑士付款金额
	 */
	knightPaywayToPrice: function (way, data) {
		try {
			const ways = way;
			// 合并对象，过滤掉nan或undefined
			let dataValue = Object.assign({}, data);
			console.log(ways, typeof ways, dataValue);
			let price = '';
			switch (ways) {
				case 301:
					price = dataValue['purchase_price'];
					break;
				case 302:
					price = dataValue['monthly_fee'];
					console.log(dataValue['monthly_fee']);
					break;
				case 303:
					price = dataValue['deposit'];
					break;
				default:
					throw new Error('typeError')
			}
			return price;
		}
		catch (e) {
			console.error(e.message);
		}
	}
};

export default aoaoBossTools;
