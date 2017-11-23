/**
 * Created by dave 2017/4/24
 *  按需加载路由配置
 * */
import permission from './../utils/permission';
import Permission from './role/role';

export default {
	path: '/',
	getComponent: (nextState, cb) => {
		//加载layout
		const flag = permission.isLogin();
		if (flag) {
			require.ensure([], (require) => {
				cb(null, require('./layout/index'));
			});
		} else {
			require.ensure([], (require) => {
				cb(null, require('./login/index'));
			});
		}
	},

	getIndexRoute(nextState, cb) {
		require.ensure([], function (require) {
			cb(null, {
				component: require("./account/index"),
			})
		})
	},

	childRoutes: [
		// 业务查询
		{
			path: 'Search/Business',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./queryManage/business'));
				});
			}
		},
		// 收支查询
		{
			path: 'Search/Balance',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./queryManage/balance'));
				});
			}
		},
		// 上传文件
		{
			path: 'Handle/Upload',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./operationManage/index'));
				});
			}
		},
		// -----------------------员工管理-----------------------
		// 员工查询
		{
			path: 'Employee/Search',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./employee/search/index'));
				});
			}
		},
		// 员工详情
		{
			path: 'Employee/Detail',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./employee/search/detail'));
				});
			}
		},
		// 员工编辑
		{
			path: 'Employee/Edit',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./employee/search/edit'));
				});
			}
		},
		// 员工添加
		{
			path: 'Employee/Add',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./employee/add/index'));
				});
			}
		},
		// 员工离职
		{
			path: 'Employee/LeaveFlow',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./employee/leaveApproval/index'));
				});
			}
		},
		// -----------------------物资管理----------------------
		// 查看库存
		{
			path: 'Materiel/Stores/Search',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./materials/inventory/stores'));
				});
			}
		},
		// 变动明细
		{
			path: 'Materiel/Stores/Log/Detail',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./materials/inventory/changeMessage'));
				});
			}
		},
		// 品目明细
		{
			path: 'Materiel/Stores/Item',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./materials/inventory/itemList'));
				});
			}
		},
		// 查看骑士物资
		{
			path: 'Materiel/Stores/Knight',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./materials/inventory/knightMaterials'));
				});
			}
		},
		// 查看骑士物资详情
		{
			path: 'Materiel/Stores/Knight/Detail',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./materials/inventory/materialsDetail'));
				});
			}
		},
		// 采购|报废记录
		{
			path: 'Materiel/Purchase/Log',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./materials/Purchase/pickRecord'));
				});
			}
		},
		// 采购|报废单详情
		{
			path: 'Materiel/Purchase/Detail',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./materials/Purchase/detail'));
				});
			}
		},
		// 采购单报错
		{
			path: 'Materiel/Purchase/ErrorOrder',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./materials/Purchase/errorOrder'));
				});
			}
		},
		// 新建采购|报废单
		{
			path: 'Materiel/Purchase/Create',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./materials/Purchase/purchaseOrder'));
				});
			}
		},
		// 分发|退货记录
		{
			path: 'Materiel/Dispatcher/Log',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./materials/distribute/distributeLog'));
				});
			}
		},
		// 分发|退货详情
		{
			path: 'Materiel/Dispatcher/Detail',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./materials/distribute/detail'));
				});
			}
		},
		// 分发|退货详情
		{
			path: 'Materiel/Dispatcher/Create',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./materials/distribute/distributeOrder'));
				});
			}
		},
		// 账户信息
		{
			path: 'Account',
			// onEnter: (nextState, replace, next) => {
			// },
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./account/index'));
				});
			}
		},
		// 个人离职
		{
			path: 'Account/PersonalLeave',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./account/personalLeave/index'));
				});
			}
		},
		// 用户管理
		{
			path: 'System/User',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./system/user/index'));
				});
			}
		},
		// 供应商管理
		{
			path: 'System/Supplier',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./system/supplier/index'));
				});
			}
		},
		// 添加供应商
		{
			path: 'System/AddSupplier',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./system/supplier/add'));
				});
			}
		},
		// 编辑供应商
		{
			path: 'System/EditSupplier',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./system/supplier/edit'));
				});
			}
		},
		// 字段管理
		{
			path: 'System/Field',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./system/field/index'));
				});
			}
		},
		// 指标管理
		{
			path: 'System/Target',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./system/target/index'));
				});
			}
		},
		// -----------------------财务管理----------------------
		// 财务申请主页面
		{
			path: 'Finance/FinanceApply',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./finance/financeApply/index'));
				});
			}
		},
		// 财务申请详情页
		{
			path: 'Finance/FinanceApply/Detail',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./finance/financeApply/detail'));
				});
			}
		},
		// 续租详情页面
		{
			path: 'Finance/FinanceApply/Relet',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./finance/financeApply/relet'));
				});
			}
		},

		// 新建财务申请主页面
		{
			path: 'Finance/NewFinanceApply',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./finance/newFinanceApply/index'));
				})
			}
		},
		// -----------------------薪资管理----------------------
		// 薪资查询
		{
			path: 'Salary/Search',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./salary/search/index'));
				});
			}
		},
		// 薪资详情
		{
			path: 'Salary/Search/Detail',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./salary/search/detail'));
				});
			}
		},
		// 骑士扣款
		{
			path: 'Salary/FillingMoney',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./salary/fillingMoney/index'));
				});
			}
		},
		// 新建骑士扣款
		{
			path: 'Salary/FillingMoney/Create',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./salary/fillingMoney/create'));
				});
			}
		},
		// 骑士扣款详情
		{
			path: 'Salary/FillingMoney/Detail',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./salary/fillingMoney/detail'));
				});
			}
		},
		// 骑士补款
		{
			path: 'Salary/Deductions',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./salary/deductions/index'));
				});
			}
		},
		// 新建骑士补款
		{
			path: 'Salary/Deductions/Create',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./salary/deductions/create'));
				});
			}
		},
		// 骑士补款详情
		{
			path: 'Salary/Deductions/Detail',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./salary/deductions/detail'));
				});
			}
		},
		// 薪资设置
		{
			path: 'Salary/Setting',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./salary/setting/index'));
				});
			}
		},
		// 新建薪资设置
		{
			path: 'Salary/Setting/Create',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./salary/setting/create'));
				});
			}
		},
		// 薪资设置详情
		{
			path: 'Salary/Setting/Detail',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./salary/setting/detail'));
				});
			}
		},
		// error
		{
			path: '*',
			getComponent: (nextState, cb) => {
				require.ensure([], (require) => {
					cb(null, require('./error/index'));
				});
			}
		},
	],
};
