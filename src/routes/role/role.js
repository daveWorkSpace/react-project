/**
 * Created by dave 2017/7/19
 * 权限处理中心
 *
 * @class
 * @extends
 */
import aoaoBossTools from './../../utils/util';
class Permission {
    constructor(params) {
		const localMessage = localStorage.getItem('AOAOBOSS');
		this.localData = localMessage;
		this.role = {
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
		};
		this.position = {
			// 职位
			'2020': '客户',
			'2003': '总监',
			'2004': '城市经理',
			'2005': '城市助理',
			'2006': '调度',
			'2007': '站长',
			'2008': '骑士长',
			'2009': '骑士',
		}
	}

	// 站长权限
	stationAgent() {
		const localData = this.localData;
	}

	// 调度权限
	yardman() {

	}

	// 城市助理权限
	assistant() {

	}

	// 城市经理权限
	cityManager() {

	}

	// 总监权限
	director() {

	}

	// 运营权限
	operation() {

	}

	// coo权限
	operationDirector() {

	}

	// 超管权限
	superAdmin() {
		const role = aoaoBossTools.readDataFromLocal(1, 'role_id');
	}

	/*********************** 薪资管理相关权限过滤 ***********************/
	// coo审核工资权限
	approvalSalary() {
		const role = aoaoBossTools.readDataFromLocal(1, 'role_id');
		const roleBox = [1001, 1000];
		if (roleBox.indexOf(role) != -1) {
			return true;
		} else {
			return false;
		}
	}
    /*********************** 物资模块权限过滤 ***********************/

	// 采购添加品目权限
	pickerAddItem() {
		const role = aoaoBossTools.readDataFromLocal(1, 'role_id');
		const roleBox = [1008];
		if (roleBox.indexOf(role) != -1) {
			return true;
		} else {
			return false;
		}
	}

	// 城市经理报错的权限
	createErrorOrder(state) {
		const states = state || 0;
		const role = aoaoBossTools.readDataFromLocal(1, 'role_id');
		const roleBox = [1004, 1005];
		const stateBox = [9002];
		if (roleBox.indexOf(role) != -1 && stateBox.indexOf(states) != -1) {
			return true;
		} else {
			return false;
		}
	}

	// 同意采购及报错以及报废审批
	agreeMaterialsApproval(state) {
		const states = state || 0;
		const role = aoaoBossTools.readDataFromLocal(1, 'role_id');
		const roleBox = [1001, 1008];  // 审批角色集合
		const cooRoleBox = [9001, 9007]; // coo 可以审批的状态
		const pickRoleBox = [9004]; // 采购 可以审批的状态
		if (role == 1001 && cooRoleBox.indexOf(states) != -1) {
			return true;
		} else if (role == 1008 && pickRoleBox.indexOf(states) != -1) {
			return true;
		} else {
			return false;
		}
	}

	// 驳回采购及报错以及报废审批
	agreeDistributeMaterials(state) {
		const states = state || 0;
		const role = aoaoBossTools.readDataFromLocal(1, 'role_id');
		const roleBox = [1006, 1007];  // 审批角色集合
		const stationRoleBox = [9013]; // 站长及调度 可以审批的状态
		if (roleBox.indexOf(role) != -1 && stationRoleBox.indexOf(states) != -1) {
			return true;
		} else {
			return false;
		}
	}

	/*********************** 骑士相关权限过滤 ***********************/

	// 骑士类型权限
	knightTypeShow(positionId) {
		if (positionId > 2007) {
			return true;
		} else {
			return false;
		}
	}

	// 骑士权限
	knightShow(positionId) {
		const role = aoaoBossTools.readDataFromLocal(1, 'role_id');
		if (positionId >= 2006) {
			return true;
		} else {
			return false;
		}
	}

	// 添加骑士 相关的option筛选
	addknightPermission(roleId) {
		const role = aoaoBossTools.readDataFromLocal(1, 'role_id');
		if (role < roleId && role != 1000) {
			return true;
		} else {
			return false;
		}
	}
    /*********************** 区域相关权限过滤 ***********************/
	// 商圈权限
	areaPermission(roleId) {
		const role = aoaoBossTools.readDataFromLocal(1, 'role_id');
		if (role < roleId && role != 1000) {
			return true;
		} else {
			return false;
		}
	}

	// 城市权限
	cityPermission(roleId) {
		const role = aoaoBossTools.readDataFromLocal(1, 'role_id');
		if (role < roleId && role != 1000) {
			return true;
		} else {
			return false;
		}
	}

	/*********************** 用户管理相关权限过滤 ***********************/
	// 用户列表商圈权限
	userAreaPermission(roleId) {
		const role = aoaoBossTools.readDataFromLocal(1, 'role_id');
		const areaRole = [1006, 1007];
		if (areaRole.indexOf(roleId) != -1 && roleId != 1000) {
			return true;
		} else {
			return false;
		}
	}

	// 添加用户权限
	addUser() {

	}

	/*********************** 员工管理相关权限过滤 ***********************/
	// 添加岗位候选列表
	editFilter(params) {
		const data = [];
		const localData = JSON.parse(window.localStorage.getItem('AOAOBOSS'));
		if (localData.hasOwnProperty(params) == true) {
			localData[params].map((item, index) => {
				if (item.operable == true) {
					data.push(item);
				}
			})
		}
		return data;
	}
	
	// 查询岗位候选列表
	searchPositionFilter(params) {
		const data = [];
		const localData = JSON.parse(window.localStorage.getItem('AOAOBOSS'));
		if (localData.hasOwnProperty(params) == true) {
			localData[params].map((item, index) => {
				if (item.operable !== '') {
					data.push(item);
				}
			})
		}
		return data;
	}

	// 编辑信息权限
	editEmployeePositionFilter(params, positionId) {
		const data = [];
		const localData = JSON.parse(window.localStorage.getItem('AOAOBOSS'));
		if (localData.hasOwnProperty(params) == true) {
			localData[params].map((item, index) => {
				if (item.operable == true) {
					data.push(item.position_id);
				}
			});
			if (data.indexOf(positionId) != -1) {
				return true;
			} else {
				return false;
			}
		}
	}

	// 路由权限
	routerFilter(location) {
		const roleRouterList = {
			// 超级管理员
			'1000': [
				'Search/Business', 'Search/Balance', // 查询管理模块
				'Handle/Upload',  // 操作管理
				'Employee/Search', 'Employee/Detail', 'Employee/Edit', 'Employee/Add', 'Employee/LeaveFlow', // 员工管理
				'Account', // 账户信息
				'System/User', 'System/Field', 'System/Target', 'System/Supplier', 'System/AddSupplier', 'System/EditSupplier',  // 系统管理
				'Materiel/Stores/Search', 'Materiel/Stores/Log/Detail', 'Materiel/Stores/Item', 'Materiel/Stores/Knight', 'Materiel/Stores/Knight/Detail', 'Materiel/Purchase/Log', 'Materiel/Purchase/Detail', 'Materiel/Purchase/ErrorOrder', 'Materiel/Dispatcher/Log', 'Materiel/Dispatcher/Detail',  // 物资管理
				'Finance/FinanceApply', 'Finance/NewFinanceApply', 'Finance/FinanceApply/Detail', 'Finance/FinanceApply/Relet', // 财务管理
				'Salary/Search', 'Salary/Search/Detail', 'Salary/FillingMoney', 'Salary/FillingMoney/Create', 'Salary/FillingMoney/Detail', 'Salary/Deductions', 'Salary/Deductions/Create', 'Salary/Deductions/Detail', 'Salary/Setting', 'Salary/Setting/Create', 'Salary/Setting/Detail',  // 薪资管理
			],
			// coo
			'1001': [
				'Search/Business', 'Search/Balance',  // 查询管理模块
				'Handle/Upload',  // 操作管理
				'Employee/Search', 'Employee/Detail', 'Employee/Edit', 'Employee/Add', 'Employee/LeaveFlow', // 员工管理
				'Account',  // 账户信息
				'System/User', 'System/Field', 'System/Target',  // 系统管理
				'Materiel/Stores/Search', 'Materiel/Stores/Log/Detail', 'Materiel/Stores/Item', 'Materiel/Stores/Knight', 'Materiel/Stores/Knight/Detail', 'Materiel/Purchase/Log', 'Materiel/Purchase/Detail', 'Materiel/Dispatcher/Log', 'Materiel/Dispatcher/Detail',  // 物资管理
			],
			// 运营管理
			'1002': [
				'Search/Business', 'Search/Balance',  // 查询管理模块
				'Handle/Upload',   // 操作管理
				'Employee/Search', 'Employee/Detail', 'Employee/Edit', 'Employee/Add', 'Employee/LeaveFlow',  // 员工管理
				'Account',  // 账户信息
				'System/User', 'System/Field', 'System/Target',  // 系统管理
				'Materiel/Stores/Search', 'Materiel/Stores/Log/Detail', 'Materiel/Stores/Item', 'Materiel/Stores/Knight', 'Materiel/Stores/Knight/Detail', 'Materiel/Purchase/Log', 'Materiel/Purchase/Detail', 'Materiel/Dispatcher/Log', 'Materiel/Dispatcher/Detail',  // 物资管理
			],
			// 总监
			'1003': [
				'Search/Business', 'Search/Balance',  // 查询管理模块
				'Handle/Upload',  // 操作管理
				'Employee/Search', 'Employee/Detail', 'Employee/Edit', 'Employee/Add', 'Employee/LeaveFlow', // 员工管理
				'Account', 'Account/PersonalLeave',  // 账户信息
				'System/User', 'System/Field', 'System/Target',  // 系统管理
				'Materiel/Stores/Search', 'Materiel/Stores/Log/Detail', 'Materiel/Stores/Item', 'Materiel/Stores/Knight', 'Materiel/Stores/Knight/Detail', 'Materiel/Purchase/Log', 'Materiel/Purchase/Detail', 'Materiel/Dispatcher/Log', 'Materiel/Dispatcher/Detail',  // 物资管理
			],
			// 城市经理
			'1004': [
				'Search/Business', 'Search/Balance',  // 查询管理模块
				'Handle/Upload',  // 操作管理
				'Employee/Search', 'Employee/Detail', 'Employee/Edit', 'Employee/Add', 'Employee/LeaveFlow',  // 员工管理
				'Account', 'Account/PersonalLeave',  // 账户信息
				'System/User', 'System/Field', 'System/Target',  // 系统管理
				'Materiel/Stores/Search', 'Materiel/Stores/Log/Detail', 'Materiel/Stores/Item', 'Materiel/Stores/Knight', 'Materiel/Stores/Knight/Detail', 'Materiel/Purchase/Log', 'Materiel/Purchase/Detail', 'Materiel/Purchase/Create', 'Materiel/Dispatcher/Log', 'Materiel/Dispatcher/Detail',  // 物资管理
			],
			// 城市助理
			'1005': [
				'Search/Business', 'Search/Balance',  // 查询管理模块
				'Handle/Upload',  // 操作管理
				'Employee/Search', 'Employee/Detail', 'Employee/Edit', 'Employee/Add', 'Employee/LeaveFlow',  // 员工管理
				'Account', 'Account/PersonalLeave',  // 账户信息
				'System/User', 'System/Field', 'System/Target',  // 系统管理
				'Materiel/Stores/Search', 'Materiel/Stores/Log/Detail', 'Materiel/Stores/Item', 'Materiel/Stores/Knight', 'Materiel/Stores/Knight/Detail', 'Materiel/Purchase/Log', 'Materiel/Purchase/Detail', 'Materiel/Purchase/Create', 'Materiel/Dispatcher/Log', 'Materiel/Dispatcher/Detail',  // 物资管理
			],
			// 调度
			'1006': [
				'Search/Business', 'Search/Balance',  // 查询管理模块
				'Handle/Upload',  // 操作管理
				'Employee/Search', 'Employee/Detail', 'Employee/Edit', 'Employee/Add',  // 员工管理
				'Account', 'Account/PersonalLeave',  // 账户信息
				'System/User', 'System/Field', 'System/Target',  // 系统管理
				'Materiel/Stores/Search', 'Materiel/Stores/Log/Detail', 'Materiel/Stores/Item', 'Materiel/Stores/Knight', 'Materiel/Stores/Knight/Detail', 'Materiel/Dispatcher/Log', 'Materiel/Dispatcher/Detail', 'Materiel/Dispatcher/Create',  // 物资管理
			],
			// 站长
			'1007': [
				'Search/Business', 'Search/Balance',  // 查询管理模块
				'Handle/Upload',  // 操作管理
				'Employee/Search', 'Employee/Detail', 'Employee/Edit', 'Employee/Add',  // 员工管理
				'Account', 'Account/PersonalLeave',  // 账户信息
				'System/User', 'System/Field', 'System/Target',  // 系统管理
				'Materiel/Stores/Search', 'Materiel/Stores/Log/Detail', 'Materiel/Stores/Item', 'Materiel/Stores/Knight', 'Materiel/Stores/Knight/Detail', 'Materiel/Dispatcher/Log', 'Materiel/Dispatcher/Detail', 'Materiel/Dispatcher/Create',  // 物资管理
			],
			// 采购
			'1008': [
				'Account',  // 账户信息
				'Materiel/Stores/Search', 'Materiel/Stores/Log/Detail', 'Materiel/Stores/Item', 'Materiel/Stores/Knight', 'Materiel/Stores/Knight/Detail', 'Materiel/Purchase/Log', 'Materiel/Purchase/Detail', 'Materiel/Dispatcher/Log', 'Materiel/Dispatcher/Detail',  // 物资管理
			],
		};
		const role = aoaoBossTools.readDataFromLocal(1, 'role_id');
		const pathname = location.pathname;
		try {
			if (location.action === 'PUSH') {
				if (roleRouterList[role].indexOf(`${pathname}`) != -1) {
					return true;
				} else {
					return false;
					throw new Error('当前用户没有权限');
				}
			}
		} catch (e) {
			console.error(e.message);
		}

	}

	// 菜单权限
	filterNavItem(roleId) {
		let array = [];
		switch (roleId) {
			// 超管权限
			case 1000:
				return array = [
					// 查询管理
					{
						iconType: 'search',
						title: '查询管理',
						MenuItem: [
							{
								url: 'Search/Business',
								text: '业务量查询',
								key: '1-1',
							},
							{
								url: 'Search/Balance',
								text: '收支查询',
								key: '1-2',
							},
						]
					},
					// 操作管理
					{
						iconType: 'desktop',
						title: '操作管理',
						MenuItem: [
							{
								url: 'Handle/Upload',
								text: '上传KPI文件',
								key: '2-1',
							},
						]
					},
					// 员工管理
					{
						iconType: 'user',
						title: '员工管理',
						MenuItem: [
							{
								url: 'Employee/Search',
								text: '查看员工',
								key: '3-1',
							},
							{
								url: 'Employee/Add',
								text: '添加员工',
								key: '3-2',
							},
							{
								url: 'Employee/LeaveFlow',
								text: '离职审批',
								key: '3-3',
							},
						]
					},
					// 物资管理
					{
						iconType: 'database',
						title: '物资管理',
						MenuItem: [
							{
								children: 'true',
								title: '库存信息',
								key: '4-1',
								MenuItemChildren: [
									{
										url: 'Materiel/Stores/Search',
										text: '查看库存',
										key: '4-1-1',
									},
									{
										url: 'Materiel/Stores/Item',
										text: '品目明细',
										key: '4-1-2',
									},
									{
										url: 'Materiel/Stores/Knight',
										text: '查看骑士物资',
										key: '4-1-3',
									}
								],
							},
							{
								children: 'true',
								title: '采购|报废',
								key: '4-2',
								MenuItemChildren: [
									{
										url: 'Materiel/Purchase/Log',
										text: '采购|报废记录',
										key: '4-2-1',
									},
								],
							},
							{
								children: 'true',
								title: '分发|退货记录',
								key: '4-3',
								MenuItemChildren: [
									{
										url: 'Materiel/Dispatcher/Log',
										text: '分发|退货记录',
										key: '4-3-1',
									},
								],
							},
						]
					},
					// 财务管理
					{
						iconType: 'pay-circle-o',
						title: '财务管理',
						MenuItem: [
							{
								url: 'Finance/FinanceApply',
								text: '财务申请(审批)',
								key: '7-1',
							},
							{
								url: 'Finance/NewFinanceApply',
								text: '新建资金申请',
								key: '7-2',
							}]
					},
					// 薪资管理
					{
						iconType: 'bank',
						title: '薪资管理',
						MenuItem: [
							{
								url: 'Salary/Search',
								text: '薪资查询',
								key: '8-1',
							},
							{
								url: 'Salary/FillingMoney',
								text: '骑士扣款',
								key: '8-2',
							},
							{
								url: 'Salary/Deductions',
								text: '骑士补款',
								key: '8-3',
							},
							{
								url: 'Salary/Setting',
								text: '薪资设置',
								key: '8-4',
							},
						]
					},
					// 我的账户
					{
						iconType: 'solution',
						title: '我的账户',
						MenuItem: [
							{
								url: 'Account',
								text: '我的账户',
								key: '5-1',
							},
						]
					},
					// 系统管理
					{
						iconType: 'setting',
						title: '系统管理',
						MenuItem: [
							{
								url: 'System/User',
								text: '用户管理',
								key: '6-1',
							},
							{
								url: 'System/Field',
								text: '字段管理',
								key: '6-2',
							},
							{
								url: 'System/Target',
								text: '指标管理',
								key: '6-3',
							},
							{
								url: 'System/Supplier',
								text: '供应商管理',
								key: '6-4',
							},
						]
					}
				];
			// coo 权限
			case 1001:
				return array = [
					// 查询管理
					{
						iconType: 'search',
						title: '查询管理',
						MenuItem: [
							{
								url: 'Search/Business',
								text: '业务量查询',
								key: '1-1',
							},
							{
								url: 'Search/Balance',
								text: '收支查询',
								key: '1-2',
							},
						]
					},
					// 操作管理
					{
						iconType: 'desktop',
						title: '操作管理',
						MenuItem: [
							{
								url: 'Handle/Upload',
								text: '上传KPI文件',
								key: '2-1',
							},
						]
					},
					// 员工管理
					{
						iconType: 'user',
						title: '员工管理',
						MenuItem: [
							{
								url: 'Employee/Search',
								text: '查看员工',
								key: '3-1',
							},
							{
								url: 'Employee/Add',
								text: '添加员工',
								key: '3-2',
							},
							{
								url: 'Employee/LeaveFlow',
								text: '离职审批',
								key: '3-3',
							},
						]
					},
					// 物资管理
					{
						iconType: 'database',
						title: '物资管理',
						MenuItem: [
							{
								children: 'true',
								title: '库存信息',
								key: '4-1',
								MenuItemChildren: [
									{
										url: 'Materiel/Stores/Search',
										text: '查看库存',
										key: '4-1-1',
									},
									{
										url: 'Materiel/Stores/Item',
										text: '品目明细',
										key: '4-1-2',
									},
									{
										url: 'Materiel/Stores/Knight',
										text: '查看骑士物资',
										key: '4-1-3',
									}
								],
							},
							{
								children: 'true',
								title: '采购|报废',
								key: '4-2',
								MenuItemChildren: [
									{
										url: 'Materiel/Purchase/Log',
										text: '采购|报废记录',
										key: '4-2-1',
									},
								],
							},
							{
								children: 'true',
								title: '分发|退货记录',
								key: '4-3',
								MenuItemChildren: [
									{
										url: 'Materiel/Dispatcher/Log',
										text: '分发|退货记录',
										key: '4-3-1',
									},
								],
							},
						]
					},
					// 我的账户
					{
						iconType: 'solution',
						title: '我的账户',
						MenuItem: [
							{
								url: 'Account',
								text: '我的账户',
								key: '5-1',
							}
						]
					},
					// 系统管理
					{
						iconType: 'setting',
						title: '系统管理',
						MenuItem: [
							{
								url: 'System/User',
								text: '用户管理',
								key: '6-1',
							},
							{
								url: 'System/Field',
								text: '字段管理',
								key: '6-2',
							},
							{
								url: 'System/Target',
								text: '指标管理',
								key: '6-3',
							},
						]
					}
				];
			// 运营管理权限
			case 1002:
				return array = [
					// 查询管理
					{
						iconType: 'search',
						title: '查询管理',
						MenuItem: [
							{
								url: 'Search/Business',
								text: '业务量查询',
								key: '1-1',
							},
							{
								url: 'Search/Balance',
								text: '收支查询',
								key: '1-2',
							},
						]
					},
					// 操作管理
					{
						iconType: 'desktop',
						title: '操作管理',
						MenuItem: [
							{
								url: 'Handle/Upload',
								text: '上传KPI文件',
								key: '2-1',
							},
						]
					},
					// 员工管理
					{
						iconType: 'user',
						title: '员工管理',
						MenuItem: [
							{
								url: 'Employee/Search',
								text: '查看员工',
								key: '3-1',
							},
							{
								url: 'Employee/Add',
								text: '添加员工',
								key: '3-2',
							},
							{
								url: 'Employee/LeaveFlow',
								text: '离职审批',
								key: '3-3',
							},
						]
					},
					// 物资管理
					{
						iconType: 'database',
						title: '物资管理',
						MenuItem: [
							{
								children: 'true',
								title: '库存信息',
								key: '4-1',
								MenuItemChildren: [
									{
										url: 'Materiel/Stores/Search',
										text: '查看库存',
										key: '4-1-1',
									},
									{
										url: 'Materiel/Stores/Item',
										text: '品目明细',
										key: '4-1-2',
									},
									{
										url: 'Materiel/Stores/Knight',
										text: '查看骑士物资',
										key: '4-1-3',
									}
								],
							},
							{
								children: 'true',
								title: '采购|报废',
								key: '4-2',
								MenuItemChildren: [
									{
										url: 'Materiel/Purchase/Log',
										text: '采购|报废记录',
										key: '4-2-1',
									},
								],
							},
							{
								children: 'true',
								title: '分发|退货记录',
								key: '4-3',
								MenuItemChildren: [
									{
										url: 'Materiel/Dispatcher/Log',
										text: '分发|退货记录',
										key: '4-3-1',
									},
								],
							},
						]
					},
					// 我的账户
					{
						iconType: 'solution',
						title: '我的账户',
						MenuItem: [
							{
								url: 'Account',
								text: '我的账户',
								key: '5-1',
							},
						]
					},
					// 系统管理
					{
						iconType: 'setting',
						title: '系统管理',
						MenuItem: [
							{
								url: 'System/User',
								text: '用户管理',
								key: '6-1',
							},
							{
								url: 'System/Field',
								text: '字段管理',
								key: '6-2',
							},
							{
								url: 'System/Target',
								text: '指标管理',
								key: '6-3',
							},
						]
					}
				];
			// 总监权限
			case 1003:
				return array = [
					// 查询管理
					{
						iconType: 'search',
						title: '查询管理',
						MenuItem: [
							{
								url: 'Search/Business',
								text: '业务量查询',
								key: '1-1',
							},
							{
								url: 'Search/Balance',
								text: '收支查询',
								key: '1-2',
							},
						]
					},
					// 操作管理
					{
						iconType: 'desktop',
						title: '操作管理',
						MenuItem: [
							{
								url: 'Handle/Upload',
								text: '上传KPI文件',
								key: '2-1',
							},
						]
					},
					// 员工管理
					{
						iconType: 'user',
						title: '员工管理',
						MenuItem: [
							{
								url: 'Employee/Search',
								text: '查看员工',
								key: '3-1',
							},
							{
								url: 'Employee/Add',
								text: '添加员工',
								key: '3-2',
							},
							{
								url: 'Employee/LeaveFlow',
								text: '离职审批',
								key: '3-3',
							},
						]
					},
					// 物资管理
					{
						iconType: 'database',
						title: '物资管理',
						MenuItem: [
							{
								children: 'true',
								title: '库存信息',
								key: '4-1',
								MenuItemChildren: [
									{
										url: 'Materiel/Stores/Search',
										text: '查看库存',
										key: '4-1-1',
									},
									{
										url: 'Materiel/Stores/Item',
										text: '品目明细',
										key: '4-1-2',
									},
									{
										url: 'Materiel/Stores/Knight',
										text: '查看骑士物资',
										key: '4-1-3',
									}
								],
							},
							{
								children: 'true',
								title: '采购|报废',
								key: '4-2',
								MenuItemChildren: [
									{
										url: 'Materiel/Purchase/Log',
										text: '采购|报废记录',
										key: '4-2-1',
									},
								],
							},
							{
								children: 'true',
								title: '分发|退货记录',
								key: '4-3',
								MenuItemChildren: [
									{
										url: 'Materiel/Dispatcher/Log',
										text: '分发|退货记录',
										key: '4-3-1',
									},
								],
							},
						]
					},
					// 我的账户
					{
						iconType: 'solution',
						title: '我的账户',
						MenuItem: [
							{
								url: 'Account',
								text: '我的账户',
								key: '5-1',
							},
							{
								url: 'Account/PersonalLeave',
								text: '个人离职',
								key: '5-2',
							},
						]
					},
					// 系统管理
					{
						iconType: 'setting',
						title: '系统管理',
						MenuItem: [
							{
								url: 'System/User',
								text: '用户管理',
								key: '6-1',
							},
							{
								url: 'System/Field',
								text: '字段管理',
								key: '6-2',
							},
							{
								url: 'System/Target',
								text: '指标管理',
								key: '6-3',
							},
						]
					}
				];
			// 城市经理权限
			case 1004:
				return array = [
					// 查询管理
					{
						iconType: 'search',
						title: '查询管理',
						MenuItem: [
							{
								url: 'Search/Business',
								text: '业务量查询',
								key: '1-1',
							},
							{
								url: 'Search/Balance',
								text: '收支查询',
								key: '1-2',
							},
						]
					},
					// 操作管理
					{
						iconType: 'desktop',
						title: '操作管理',
						MenuItem: [
							{
								url: 'Handle/Upload',
								text: '上传KPI文件',
								key: '2-1',
							},
						]
					},
					// 员工管理
					{
						iconType: 'user',
						title: '员工管理',
						MenuItem: [
							{
								url: 'Employee/Search',
								text: '查看员工',
								key: '3-1',
							},
							{
								url: 'Employee/Add',
								text: '添加员工',
								key: '3-2',
							},
							{
								url: 'Employee/LeaveFlow',
								text: '离职审批',
								key: '3-3',
							},
						]
					},
					// 物资管理
					{
						iconType: 'database',
						title: '物资管理',
						MenuItem: [
							{
								children: 'true',
								title: '库存信息',
								key: '4-1',
								MenuItemChildren: [
									{
										url: 'Materiel/Stores/Search',
										text: '查看库存',
										key: '4-1-1',
									},
									{
										url: 'Materiel/Stores/Item',
										text: '品目明细',
										key: '4-1-2',
									},
									{
										url: 'Materiel/Stores/Knight',
										text: '查看骑士物资',
										key: '4-1-3',
									}
								],
							},
							{
								children: 'true',
								title: '采购|报废',
								key: '4-2',
								MenuItemChildren: [
									{
										url: 'Materiel/Purchase/Log',
										text: '采购|报废记录',
										key: '4-2-1',
									},
									{
										url: 'Materiel/Purchase/Create',
										text: '新建物资采购|报废',
										key: '4-2-2',
									},
								],
							},
							{
								children: 'true',
								title: '分发|退货记录',
								key: '4-3',
								MenuItemChildren: [
									{
										url: 'Materiel/Dispatcher/Log',
										text: '分发|退货记录',
										key: '4-3-1',
									},
								],
							},
						]
					},
					// 我的账户
					{
						iconType: 'solution',
						title: '我的账户',
						MenuItem: [
							{
								url: 'Account',
								text: '我的账户',
								key: '5-1',
							},
							{
								url: 'Account/PersonalLeave',
								text: '个人离职',
								key: '5-2',
							},
						]
					},
					// 系统管理
					{
						iconType: 'setting',
						title: '系统管理',
						MenuItem: [
							{
								url: 'System/User',
								text: '用户管理',
								key: '6-1',
							},
							{
								url: 'System/Field',
								text: '字段管理',
								key: '6-2',
							},
							{
								url: 'System/Target',
								text: '指标管理',
								key: '6-3',
							},
						]
					}
				];
			// 城市助理权限
			case 1005:
				return array = [
					// 查询管理
					{
						iconType: 'search',
						title: '查询管理',
						MenuItem: [
							{
								url: 'Search/Business',
								text: '业务量查询',
								key: '1-1',
							},
							{
								url: 'Search/Balance',
								text: '收支查询',
								key: '1-2',
							},
						]
					},
					// 操作管理
					{
						iconType: 'desktop',
						title: '操作管理',
						MenuItem: [
							{
								url: 'Handle/Upload',
								text: '上传KPI文件',
								key: '2-1',
							},
						]
					},
					// 员工管理
					{
						iconType: 'user',
						title: '员工管理',
						MenuItem: [
							{
								url: 'Employee/Search',
								text: '查看员工',
								key: '3-1',
							},
							{
								url: 'Employee/Add',
								text: '添加员工',
								key: '3-2',
							},
							{
								url: 'Employee/LeaveFlow',
								text: '离职审批',
								key: '3-3',
							},
						]
					},
					// 物资管理
					{
						iconType: 'database',
						title: '物资管理',
						MenuItem: [
							{
								children: 'true',
								title: '库存信息',
								key: '4-1',
								MenuItemChildren: [
									{
										url: 'Materiel/Stores/Search',
										text: '查看库存',
										key: '4-1-1',
									},
									{
										url: 'Materiel/Stores/Item',
										text: '品目明细',
										key: '4-1-2',
									},
									{
										url: 'Materiel/Stores/Knight',
										text: '查看骑士物资',
										key: '4-1-3',
									}
								],
							},
							{
								children: 'true',
								title: '采购|报废',
								key: '4-2',
								MenuItemChildren: [
									{
										url: 'Materiel/Purchase/Log',
										text: '采购|报废记录',
										key: '4-2-1',
									},
									{
										url: 'Materiel/Purchase/Create',
										text: '新建物资采购|报废',
										key: '4-2-2',
									},
								],
							},
							{
								children: 'true',
								title: '分发|退货记录',
								key: '4-3',
								MenuItemChildren: [
									{
										url: 'Materiel/Dispatcher/Log',
										text: '分发|退货记录',
										key: '4-3-1',
									},
								],
							},
						]
					},
					// 我的账户
					{
						iconType: 'solution',
						title: '我的账户',
						MenuItem: [
							{
								url: 'Account',
								text: '我的账户',
								key: '5-1',
							},
							{
								url: 'Account/PersonalLeave',
								text: '个人离职',
								key: '5-2',
							},
						]
					},
					// 系统管理
					{
						iconType: 'setting',
						title: '系统管理',
						MenuItem: [
							{
								url: 'System/User',
								text: '用户管理',
								key: '6-1',
							},
							{
								url: 'System/Field',
								text: '字段管理',
								key: '6-2',
							},
							{
								url: 'System/Target',
								text: '指标管理',
								key: '6-3',
							},
						]
					}
				];
			// 调度权限
			case 1006:
				return array = [
					// 查询管理
					{
						iconType: 'search',
						title: '查询管理',
						MenuItem: [
							{
								url: 'Search/Business',
								text: '业务量查询',
								key: '1-1',
							},
							{
								url: 'Search/Balance',
								text: '收支查询',
								key: '1-2',
							},
						]
					},
					// 操作管理
					{
						iconType: 'desktop',
						title: '操作管理',
						MenuItem: [
							{
								url: 'Handle/Upload',
								text: '上传KPI文件',
								key: '2-1',
							},
						]
					},
					// 员工管理
					{
						iconType: 'user',
						title: '员工管理',
						MenuItem: [
							{
								url: 'Employee/Search',
								text: '查看员工',
								key: '3-1',
							},
							{
								url: 'Employee/Add',
								text: '添加员工',
								key: '3-2',
							},
						]
					},
					// 物资管理
					{
						iconType: 'database',
						title: '物资管理',
						MenuItem: [
							{
								children: 'true',
								title: '库存信息',
								key: '4-1',
								MenuItemChildren: [
									{
										url: 'Materiel/Stores/Search',
										text: '查看库存',
										key: '4-1-1',
									},
									{
										url: 'Materiel/Stores/Item',
										text: '品目明细',
										key: '4-1-2',
									},
									{
										url: 'Materiel/Stores/Knight',
										text: '查看骑士物资',
										key: '4-1-3',
									}
								],
							},
							{
								children: 'true',
								title: '分发|退货记录',
								key: '4-3',
								MenuItemChildren: [
									{
										url: 'Materiel/Dispatcher/Log',
										text: '分发|退货记录',
										key: '4-3-1',
									},
									{
										url: 'Materiel/Dispatcher/Create',
										text: '新建物资分发',
										key: '4-3-2',
									},
								],
							},
						]
					},
					// 我的账户
					{
						iconType: 'solution',
						title: '我的账户',
						MenuItem: [
							{
								url: 'Account',
								text: '我的账户',
								key: '5-1',
							},
							{
								url: 'Account/PersonalLeave',
								text: '个人离职',
								key: '5-2',
							},
						]
					},
				];
			// 站长权限
			case 1007:
				return array = [
					// 查询管理
					{
						iconType: 'search',
						title: '查询管理',
						MenuItem: [
							{
								url: 'Search/Business',
								text: '业务量查询',
								key: '1-1',
							},
							{
								url: 'Search/Balance',
								text: '收支查询',
								key: '1-2',
							},
						]
					},
					// 操作管理
					{
						iconType: 'desktop',
						title: '操作管理',
						MenuItem: [
							{
								url: 'Handle/Upload',
								text: '上传KPI文件',
								key: '2-1',
							},
						]
					},
					// 员工管理
					{
						iconType: 'user',
						title: '员工管理',
						MenuItem: [
							{
								url: 'Employee/Search',
								text: '查看员工',
								key: '3-1',
							},
							{
								url: 'Employee/Add',
								text: '添加员工',
								key: '3-2',
							},
						]
					},
					// 物资管理
					{
						iconType: 'database',
						title: '物资管理',
						MenuItem: [
							{
								children: 'true',
								title: '库存信息',
								key: '4-1',
								MenuItemChildren: [
									{
										url: 'Materiel/Stores/Search',
										text: '查看库存',
										key: '4-1-1',
									},
									{
										url: 'Materiel/Stores/Item',
										text: '品目明细',
										key: '4-1-2',
									},
									{
										url: 'Materiel/Stores/Knight',
										text: '查看骑士物资',
										key: '4-1-3',
									}
								],
							},
							{
								children: 'true',
								title: '分发|退货记录',
								key: '4-3',
								MenuItemChildren: [
									{
										url: 'Materiel/Dispatcher/Log',
										text: '分发|退货记录',
										key: '4-3-1',
									},
									{
										url: 'Materiel/Dispatcher/Create',
										text: '新建物资分发',
										key: '4-3-2',
									},
								],
							},
						]
					},
					// 我的账户
					{
						iconType: 'solution',
						title: '我的账户',
						MenuItem: [
							{
								url: 'Account',
								text: '我的账户',
								key: '5-1',
							},
							{
								url: 'Account/PersonalLeave',
								text: '个人离职',
								key: '5-2',
							},
						]
					},
				];
			// 采购权限
			case 1008:
				return array = [
					// 物资管理
					{
						iconType: 'database',
						title: '物资管理',
						MenuItem: [
							{
								children: 'true',
								title: '库存信息',
								key: '4-1',
								MenuItemChildren: [
									{
										url: 'Materiel/Stores/Search',
										text: '查看库存',
										key: '4-1-1',
									},
									{
										url: 'Materiel/Stores/Item',
										text: '品目明细',
										key: '4-1-2',
									},
									{
										url: 'Materiel/Stores/Knight',
										text: '查看骑士物资',
										key: '4-1-3',
									}
								],
							},
							{
								children: 'true',
								title: '采购|报废',
								key: '4-2',
								MenuItemChildren: [
									{
										url: 'Materiel/Purchase/Log',
										text: '采购|报废记录',
										key: '4-2-1',
									}
								],
							},
							{
								children: 'true',
								title: '分发|退货记录',
								key: '4-3',
								MenuItemChildren: [
									{
										url: 'Materiel/Dispatcher/Log',
										text: '分发|退货记录',
										key: '4-3-1',
									},
								],
							},
						]
					},
					// 我的账户
					{
						iconType: 'solution',
						title: '我的账户',
						MenuItem: [
							{
								url: 'Account',
								text: '我的账户',
								key: '5-1',
							},
						]
					},
				];
		}
	}
}
export default Permission;
