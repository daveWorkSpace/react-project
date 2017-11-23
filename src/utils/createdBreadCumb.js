/**
 * Created by dave 2017/07/20
 * 面包屑生成器
 * @class  BreadCrumbTool
 * @extends NavLight
 */
class BreadCrumbTool {
	constructor() {

	}

	handleCreate(pathname) {
		let exportData = ['我的账户', '我的账户'];
		const data = {
			// 查询管理
			'/Search/Business': ['查询管理', '业务量查询'],
			'/Search/Balance': ['查询管理', '收支查询'],
			// 操作管理
			'/Handle/Upload': ['操作管理', '填写KPI文件'],
			// 员工管理
			'/Employee/Search': ['员工管理', '查看员工'],
			'/Employee/Detail': ['员工管理', '查看员工', '员工详情'],
			'/Employee/Edit': ['员工管理', '查看员工', '员工编辑'],
			'/Employee/Add': ['员工管理', '添加员工'],
			'/Employee/LeaveFlow': ['员工管理', '离职审批'],
			// 物资管理
			'/Materiel/Stores/Search': ['物资管理', '库存信息', '查看库存'],
			'/Materiel/Stores/Log/Detail': ['物资管理', '库存信息', '查看库存', '变动明细'],
			'/Materiel/Stores/Item': ['物资管理', '库存信息', '品目明细'],
			'/Materiel/Stores/Knight': ['物资管理', '库存信息', '查看骑士物资'],
			'/Materiel/Stores/Knight/Detail': ['物资管理', '库存信息', '物资详情'],
			'/Materiel/Purchase/Log': ['物资管理', '采购|报废', '采购|报废记录'],
			'/Materiel/Purchase/Create': ['物资管理', '采购|报废', '新建物资采购|报废'],
			'/Materiel/Purchase/Detail': ['物资管理', '采购|报废', '详情'],
			'/Materiel/Purchase/ErrorOrder': ['物资管理', '采购|报废', '报错单'],
			'/Materiel/Dispatcher/Log': ['物资管理', '分发|退货记录', '分发|退货记录'],
			'/Materiel/Dispatcher/Detail': ['物资管理', '分发|退货记录', '详情'],
			'/Materiel/Dispatcher/Create': ['物资管理', '分发|退货记录', '新建物资分发'],
			// 财务管理
			'/Finance/FinanceApply': ['财务管理', '财务申请'],
			'/Finance/FinanceApply/Detail': ['财务管理', '租房申请','详情'],
			'/Finance/FinanceApply/Relet': ['财务管理', '租房申请','续租'],
			'/Finance/newFinanceApply': ['财务管理', '新建资金申请'],
			'/Finance/Apply/NewRentDetail': ['财务管理', '财务审批', '新租详情'],
			// 薪资管理
			'/Salary/Search': ['薪资管理', '薪资查询'],
			'/Salary/Search/Detail': ['薪资管理', '薪资查询', '薪资明细'],
			'/Salary/FillingMoney': ['薪资管理', '骑士扣款'],
			'/Salary/FillingMoney/Create': ['薪资管理', '骑士扣款', '新建骑士扣款'],
			'/Salary/FillingMoney/Detail': ['薪资管理', '骑士扣款', '扣款详情'],
			'/Salary/Deductions': ['薪资管理', '骑士补款'],
			'/Salary/Deductions/Create': ['薪资管理', '骑士补款', '新建骑士补款'],
			'/Salary/Deductions/Detail': ['薪资管理', '骑士补款', '补款详情'],
			'/Salary/Setting': ['薪资管理', '薪资设置'],
			'/Salary/Setting/Create': ['薪资管理', '薪资设置', '新建薪资模板'],
			'/Salary/Setting/Detail': ['薪资管理', '薪资设置', '薪资模板详情'],
			// 账户管理
			'/Account': ['我的账户', '我的账户'],
			'/Account/PersonalLeave': ['我的账户', '个人离职'],
			// 系统管理
			'/System/User': ['系统管理', '用户管理'],
			'/System/Field': ['系统管理', '字段管理'],
			'/System/Target': ['系统管理', '指标管理'],
			'/System/Supplier': ['系统管理', '供应商管理'],
			'/System/AddSupplier': ['系统管理', '添加供应商'],
			'/System/EditSupplier': ['系统管理', '编辑供应商'],
		};
		try {
			if (data[pathname]) {
				exportData = data[pathname];
			}
		}
		catch (e) {
			return new Error('未找到');
		}
		return exportData;
	}
}

class NavLight extends BreadCrumbTool {
	constructor() {
		super();
	}

	setKey(pathname) {
		let key = '5-1';
		const navList = {
			// 业务管理
			'/Search/Business': '1-1',
			'/Search/Balance': '1-2',
			// 操作管理
			'/Handle/Upload': '2-1',
			// 员工管理
			'/Employee/Search': '3-1',
			'/Employee/Detail': '3-1',
			'/Employee/Edit': '3-1',
			'/Employee/Add': '3-2',
			'/Employee/LeaveFlow': '3-3',
			// 物资管理
			'/Materiel/Stores/Search': '4-1-1',
			'/Materiel/Stores/Log/Detail': '4-1-1', // 变动明细
			'/Materiel/Stores/Item': '4-1-2',
			'/Materiel/Stores/Knight': '4-1-3',
			'/Materiel/Stores/Knight/Detail': '4-1-3',
			'/Materiel/Purchase/Log': '4-2-1',
			'/Materiel/Purchase/Create': '4-2-2',
			'/Materiel/Purchase/Detail': '4-2-1',
			'/Materiel/Purchase/ErrorOrder': '4-2-1',
			'/Materiel/Dispatcher/Log': '4-3-1',
			'/Materiel/Dispatcher/Detail': '4-3-1',
			'/Materiel/Dispatcher/Create': '4-3-2',
			// 财务管理
			'/Finance/FinanceApply': '7-1',
			'/Finance/FinanceApply/Detail': '7-1',
			'/Finance/FinanceApply/Relet': '7-1',
			'/Finance/NewFinanceApply': '7-2',
			// 账户管理
			'/Account': '5-1',
			'/Account/PersonalLeave': '5-2',
			// 系统管理
			'/System/User': '6-1',
			'/System/Field': '6-2',
			'/System/Target': '6-3',
			'/System/Supplier': '6-4',
			'/System/AddSupplier': '6-4',
			'/System/EditSupplier': '6-4',
			// 财务管理
			'/Finance/Apply/NewRentDetail': '7-1-1',
			// 薪资管理
			'/Salary/Search': '8-1',
			'/Salary/Search/Detail': '8-1',
			'/Salary/FillingMoney': '8-2',
			'/Salary/FillingMoney/Create': '8-2',
			'/Salary/FillingMoney/Detail': '8-2',
			'/Salary/Deductions': '8-3',
			'/Salary/Deductions/Create': '8-3',
			'/Salary/Deductions/Detail': '8-3',
			'/Salary/Setting': '8-4',
			'/Salary/Setting/Create': '8-4',
			'/Salary/Setting/Detail': '8-4',
		};
		try {
			if (navList[pathname]) {
				key = navList[pathname];
			}
		}
		catch (e) {
			return new Error('未找到');
		}
		return key;
	}
}
module.exports = {
	BreadCrumbTool,
	NavLight,
};
