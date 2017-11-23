/**
 * Created by dave 2017/08/22
 * 供应商管理模块
 *
 */
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'dva';
import { Table, Select, Form, Button, Row, Col, Input, Popconfirm } from 'antd';
import TableModel from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
const [FormItem,Option] = [Form.Item, Select.Option];

class Supplier extends Component {
	constructor(props) {
		super(props);
		this.state = {
			total: 0,
			page: 1,													// 默认页码
			current: 1,												// 默认的高亮页码
			pageSize: 30,
			searchValue: '',
			supplierList: props.system.allSupplierList.data || [],
			areaList: props.system.areaList.biz_district_list || [],
			columns: [{
				title: '供应商名称',
				dataIndex: 'supplier_name',
				key: 'supplier_name',
			}, {
				title: '操作',
				dataIndex: '_id',
				key: '_id',
				render: (text, record) => {
					return (
						<span>
						{
							record.state != -61 ? <span className="systemTextColor">
									<Link to={`System/EditSupplier?id=${record._id}`}>
										<span className="mgl8 systemTextColor pointer">
										编辑
										</span>
									</Link>
									<span className="mgl8 systemTextColor">|</span>
									<span className="mgl8 systemTextColor pointer"
												onClick={this.deleteSupplier.bind(this, record)}>{record.state == 60 ? '禁用' : '启用'}</span>
									 <span>
											 <span className="mgl8 systemTextColor">|</span>
											 <Popconfirm title={<div>
												 <p>你确定要停用供应商吗？</p>
												 <p>
													 <span style={{ color: 'red' }}>停用后该供应商下所有的员工离职，账户禁用，商圈释放</span>
													 ,您还要继续吗？
												 </p>
											 </div>} onConfirm={this.confirm} onCancel={this.cancel} okText="确认"
																	 cancelText="取消">
													<span className="mgl8 systemTextColor pointer"
																onClick={this.deleteSupplier.bind(this, record, -61)}>停用</span>
											</Popconfirm>
										</span>
							</span> : ''
						}
					</span>
					)
				}
			}],
			dataSource: props.system.supplierList.data || [],
			relieve: '',
		}
	}

	// 接受父级的值
	componentWillReceiveProps(nextProps) {
		this.setState({
			supplierList: nextProps.system.allSupplierList.data || [],
			dataSource: nextProps.system.supplierList.data || [],
			areaList: nextProps.system.areaList.biz_district_list || [],
		})
	}

	//
	confirm = () => {
		const { dispatch } = this.props;
		const data = this.state.relieve;   // 停用供应商信息
		dispatch({
			type: 'system/disableSupplierE',
			payload: data,
		})
	};

	// 取消
	cancel = () => {
		// console.log('取消');
	};

	// 禁用供应商
	deleteSupplier(record, state) {
		const { dispatch } = this.props;
		const values = record;
		const dataList = aoaoBossTools.readDataFromLocal(1, 'region');  // 获取当前所有平台
		const platform_id_list = aoaoBossTools.getIdFromArrayInfo(values.platform_list, 'platform_code');
		const city_id_list = aoaoBossTools.getIdFromArrayInfo(values.city_list, 'city_spelling');
		const biz_district_id_list = aoaoBossTools.getIdFromArrayInfo(values.biz_district_list, 'biz_district_id');
		const platformIndexList = aoaoBossTools.getArrayItemIndex(dataList, platform_id_list, 'platform_code'); // 获取平台信息所处数组的索引
		const platformInfo = [];   // 筛选后表格数据容器
		// 从'platform_code_list', 'city_spelling_list', 'biz_district_id_list'这三组数据中筛选出数据重新组合成展示所需的数据格式
		for (let i = 0; i < platformIndexList.length; i++) {
			for (let k = 0; k < dataList[i].city_list.length; k++) {
				for (let j = 0; j < city_id_list.length; j++) {
					if (dataList[i].city_list[k].city_spelling == city_id_list[j]) {
						for (let h = 0; h < dataList[i].city_list[k].biz_district_list.length; h++) {
							for (let l = 0; l < biz_district_id_list.length; l++) {
								if (dataList[i].city_list[k].biz_district_list[h].biz_district_id == biz_district_id_list[l]) {
									platformInfo.push({
										platform_name: dataList[i].platform_name,
										platform_code: dataList[i].platform_code,
										city_spelling: dataList[i].city_list[k].city_spelling,
										city_name_joint: dataList[i].city_list[k].city_name_joint,
										biz_district_id: dataList[i].city_list[k].biz_district_list[h].biz_district_id,
										biz_district_name: dataList[i].city_list[k].biz_district_list[h].biz_district_name,
									});
								}
							}
						}
					}
				}
			}
		}
		let data = {};
		if (state == -61) {
			data = {
				biz_district_info_list: platformInfo,
				state: state,
				_id: record._id,
				supplier_name: record.supplier_name,
			};
			this.setState({
				relieve: data,
			});
		} else {
			data = {
				biz_district_info_list: platformInfo,
				state: -(record.state),
				_id: record._id,
				supplier_name: record.supplier_name,
			};
			dispatch({
				type: 'system/disableSupplierE',
				payload: data,
			})
		}

	};

	// 收集查询条件 查询数据
	handleSubmit = (e) => {
		const { dispatch } = this.props;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				this.setState({
					searchValue: values,
					current: 1,
				});
				values.page = this.state.page;
				values.limit = 30;
				dispatch({
					type: 'system/getSupplierListE',
					payload: values,
				})
			}
		});
	};

	// 分页
	pageChange = (page, pageSize) => {
		const { dispatch } = this.props;
		this.setState({
			current: page,
			pageSize: pageSize,
		});
		const value = this.state.searchValue;
		value.limit = pageSize;
		value.page = page;
		dispatch({
			type: 'system/getSupplierListE',
			payload: value,
		})
	};

	// 渲染
	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		return (
			<div className="mgt8">
				<Form>
					<Row>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`供应商名称`}>
								{getFieldDecorator(`supplier_id`, {
									rules: [{ required: false, message: '请选择供应商名称', trigger: 'onBlur', type: 'string' }],
								})(
									<Select showSearch placeholder="请选择供应商">
										{
											this.state.supplierList.map((item, index) => {
												return <Option value={item._id} key={index}>{item.supplier_name}</Option>
											})
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`商圈名称`}>
								{getFieldDecorator(`biz_district_id_list`, {
									rules: [{ required: false, message: '请选择商圈名称', trigger: 'onBlur', type: 'array' }],
								})(
									<Select showSearch placeholder="请选择商圈"
													mode="multiple">
										{
											this.state.areaList.map((item, index) => {
												return <Option value={item.biz_district_id} key={index}>{item.biz_district_name}</Option>
											})
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<Button type="primary" className="mgl16" onClick={this.handleSubmit}>查询</Button>
							<Button type="primary" className="mgl16"><Link to={`System/AddSupplier`}> 添加供应商</Link></Button>
						</Col>
					</Row>
				</Form>
				<TableModel columns={this.state.columns} dataSource={this.state.dataSource}/>
				<div className="fltr">
					{
						this.state.total > 0 ?
							<Pagination onChange={this.pageChange}
													className="mgt8"
													total={this.state.total}
													showTotal={total => `总共 ${total} 条，${this.state.pageSize}条/页 `}
													pageSize={this.state.pageSize}
													current={ this.state.current }/>
							: ''
					}
				</div>
			</div>
		)
	}
}
Supplier = Form.create()(Supplier);

function mapStateToProps({ system }) {
	return { system };
}
export default connect(mapStateToProps)(Supplier);
