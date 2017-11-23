/**
 * Created by dave 2017/4/21
 * */
import { message } from 'antd';
import React from 'react';

let index = 0;
const catchError = {
	error: (code) => {
		if (code === undefined) {
			return;
		} else {
			if (code.err_code) {
				const codeDict = {
					"401009": "手机号已存在",
					"404001": "未找到符合条件的数据",
					"408002": "账号不可用",
					"401001": "参数缺失或错误",
					"415001": "账户已过期，请重新登录",
					"409001": "App不可用",
					"401002": "发送验证码过于频繁,请一分钟后再发",
					"416001": "发送验证码失败",
					"415002": "请重新登录",
					"408004": "账号更新内容错误",
					"410001": "Appkey不可用",
					"401008": "验证码错误",
					"408001": "账号没有找到",
					"401007": "身份证号已存在",
					"405002": "没有操作参数中角色或职位的权限",
					"405003": "账户信息不匹配",
					"405001": "该账号没有权限",
					"1005": "请求外部数据失败",
					"1014": "该员工不存在，无法添加账号",
					"1006": "未找到文件",
					"1007": "获取数据失败",
					"1008": "所选员工已有账号",
					"1009": "请确认是否选择了平台或者城市",
					"1010": "找不到城市",
					"1011": "找不到平台",
					"1012": "找不到商圈",
					"1013": "缺失工作性质",
					"1015": "角色与职位不匹配",
					"1016": "参数类型错误",
					"1017": "该商圈已绑定站长",
					"1018": "匹配不到其他平台员工",
					"1019": "关联平台身份证已被绑定",
					"1021": "找不到供应商",
					"1022": "商圈已存在供应商",
					"1023": "供应商已存在",
					"1024": "存在未离职员工",
					"1025": "供应商已存在coo",
					"1026": "供应商已停用",
					"1027": "物资已经存在",
					"1028": "该账号未找到供应商",
					"1029": "material_list字段内容错误",
					"1030": "单子没找到",
					"1031": "非采购审核通过的单子无法报错",
					"1032": "该单子无法被审核",
					"1033": "物资库存量不够",
					"1034": "找不到该品目",
					"1035": "错误的职位状态操作",
				};
				if (code.err_code == 415001 || code.err_code == 415002) {
					index++;
					if (index == 1) {
						const timer = setTimeout(() => {
							window.localStorage.removeItem('AOAOBOSS');
							window.location.href = '/#/';
							window.location.reload();
							clearTimeout(timer);
						}, 1000);
						return codeDict[code.err_code] ? codeDict[code.err_code] : '错误';
					}
				} else {
					return codeDict[code.err_code] ? codeDict[code.err_code] : '错误';
				}
				/*return codeDict[code.err_code] ? codeDict[code.err_code] : '错误';*/
			} else {
				return code;
			}
		}

	},
	number: (n) => {
		let m = n;
		m++;
		return m;
	},
	index: 0,
};
export default catchError;
