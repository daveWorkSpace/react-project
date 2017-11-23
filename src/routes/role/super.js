/**
 * Created by dave
 * @typedef {Object} namespaceA~SuperAdmin
 * @property {Array} router 路由
 * @property {Array} navItem 菜单配置
 * 
 */
// TODO 未使用,已迁移至role.js
const superAdmin = {
	navItem: [
		// 查询管理
		{
			iconType: 'search',
			title: '查询管理',
			MenuItem: [
				{
					url: 'Search/Business',
					text: '业务量查询',
					key: '1',
				},
				{
					url: 'Search/Balance',
					text: '收支查询',
					key: '2',
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
					key: '3',
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
					key: '4',
				},
				{
					url: 'Employee/Add',
					text: '添加员工',
					key: '5',
				},
				{
					url: 'Employee/LeaveFlow',
					text: '离职审批',
					key: '6',
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
					key: '7',
				},
				{
					url: 'Account/PersonalLeave',
					text: '个人离职',
					key: '8',
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
					key: '9',
				},
				{
					url: 'System/Field',
					text: '字段管理',
					key: '10',
				},
				{
					url: 'System/Target',
					text: '指标管理',
					key: '11',
				},
			]
		}
	]
};
export default superAdmin;
