/**
 * Created by dave 2017/08/23
 * 添加供应商模块
 */
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'dva';
import { Select, Form, Input, Row, Col, Button, Table, message } from 'antd';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
const [FormItem, Option] = [Form.Item, Select.Option];

class AddSupplier extends Component {
	constructor() {
		super();
		this.state = {
			cityList: [],   // 城市下拉框数据源
			areaList: [],   // 商圈下拉框数据源
			platformInitValue: [],  // 平台下拉默认值
			cityInitValue: [],			// 城市下拉默认值
			areaInitValue: [],      // 商圈下拉默认值
			selectedRowKeys: [],    // 选中的表格索引
			selectedRows: [],       // 选中的商圈数据
			columns: [{
				title: '城市',
				dataIndex: 'city_name_joint',
				key: '',
			}, {
				title: '商圈',
				dataIndex: 'biz_district_name',
				key: '',
			}, {
				title: '操作',
				dataIndex: 'biz_district_id',
				key: 'biz_district_id',
				render: (text, record) => {
					return (
						<span className="systemTextColor pointer" onClick={this.deleteSingleArea.bind(this, record)}>删除</span>
					)
				}
			}],
			dataSource: [],
		}
	}

	// 获取城市列表
	platformChange = (data) => {
		const { form } = this.props;
		const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), data, 'city_name_joint');
		const value = aoaoBossTools.getArrayFormObject(cityList, 'city_spelling');  // 城市id列表
		this.handleCityChange(value);
		if (this.props.form.getFieldValue('platform_code_list').length > data.length) {
			const platformValue = this.props.form.getFieldValue('platform_code_list');    // 平台改变之前的数据
			const cityValue = this.props.form.getFieldValue('city_spelling_list');  // 城市当前的数据
			const diffItem = aoaoBossTools.filterDiffOfArray(platformValue, data);  // 平台更改后的差异数据
			const cityListFromPlatform = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), diffItem, 'city_name_joint');  // 平台下城市信息列表
			const value = aoaoBossTools.getArrayFormObject(cityListFromPlatform, 'city_spelling');  // 城市id列表
			const setCityValue = aoaoBossTools.removeItemOfFilter(cityValue, value);  // 过滤更改前后的差异id数据
			this.props.form.setFields({ city_spelling_list: { value: setCityValue } });
			this.setState({
				cityList: cityList,
			});
		} else {
			this.setState({
				platformList: data,
				cityList: cityList,
			});
		}
	};

	// 生成商圈下拉选项
	handleCityChange = (key) => {
		const keyList = aoaoBossTools.getArrayItemIndex(this.state.cityList, key, 'city_spelling');
		const cityData = this.state.cityList;
		const areaData = aoaoBossTools.getAreaListFromCityList(keyList, cityData);
		if (this.props.form.getFieldValue('city_spelling_list').length > key.length) {
			const cityValue = this.props.form.getFieldValue('city_spelling_list');    // 城市change之前的数据
			const areaValue = this.props.form.getFieldValue('biz_district_id_list');  // 商圈当前的数据
			if (areaValue !== undefined) {
				const diffItem = aoaoBossTools.filterDiffOfArray(cityValue, key);  // 城市更改后的差异数据
				const areaListFromCity = aoaoBossTools.getArrayItemIndex(cityData, diffItem, 'city_spelling');  // 城市下商圈信息列表
				const areaKeyValueList = aoaoBossTools.getAreaListFromCityList(areaListFromCity, cityData); // 整理后的数商圈数据
				const value = aoaoBossTools.getArrayFormObject(areaKeyValueList, 'biz_district_id');  // 商圈id列表
				const setAreaValue = aoaoBossTools.removeItemOfFilter(areaValue, value);
				this.props.form.setFields({ biz_district_id_list: { value: setAreaValue } });
			}
			this.setState({
				areaList: areaData,
				// areaInitValue: value,
			});
		} else {
			this.setState({
				areaList: areaData,
			});
		}
	};

	// 生成平台下拉选项
	createPlatformList() {
		const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
		return (dataList.map((item, index) => {
			return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>
		}));
	}

	// 添加商圈
	handleSubmits = () => {
		const { form } =this.props;
		form.validateFields((err, values) => {
			if (err) {
				try {
					if (values.biz_district_id_list.length == 0) {
						message.error('商圈不可为空');
						throw new Error('商圈不可为空');
					}
				} catch (e) {
					console.error(e.message);
				}
				return;
			} else {
				const values = this.props.form.getFieldsValue(['platform_code_list', 'city_spelling_list', 'biz_district_id_list']);
				const dataList = aoaoBossTools.readDataFromLocal(1, 'region');  // 获取当前所有平台
				const platformIndexList = aoaoBossTools.getArrayItemIndex(dataList, values.platform_code_list, 'platform_code'); // 获取平台信息所处数组的索引
				const platformInfo = [];   // 筛选后表格数据容器
				// 从'platform_code_list', 'city_spelling_list', 'biz_district_id_list'这三组数据中筛选出数据重新组合成展示所需的数据格式
				for (let i = 0; i < platformIndexList.length; i++) {
					for (let k = 0; k < dataList[i].city_list.length; k++) {
						for (let j = 0; j < values.city_spelling_list.length; j++) {
							if (dataList[i].city_list[k].city_spelling == values.city_spelling_list[j]) {
								for (let h = 0; h < dataList[i].city_list[k].biz_district_list.length; h++) {
									for (let l = 0; l < values.biz_district_id_list.length; l++) {
										if (dataList[i].city_list[k].biz_district_list[h].biz_district_id == values.biz_district_id_list[l]) {
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
				}  // 筛选完成
				// 对已经添加在缓存区的商圈去重
				const addedArea = this.state.dataSource; // 已经存在的商圈信息
				const addedAreaIdList = []; // 存在的商圈id列表
				for (let i = 0; i < addedArea.length; i++) {
					addedAreaIdList.push(addedArea[i].biz_district_id);
				}
				// 去重处理
				for (let j = 0; j < platformInfo.length; j++) {
					if (addedAreaIdList.indexOf(platformInfo[j].biz_district_id) == -1) {
						addedArea.push(platformInfo[j]);
					}
				}
				// 重新给表格设置状态
				this.setState({
					dataSource: addedArea,
				})
			}
		});
		form.resetFields(['platform_code_list', 'city_spelling_list', 'biz_district_id_list']);
	};

	// 批量选中
	onSelectChange = (selectedRowKeys, selectedRows) => {
		this.setState({ selectedRowKeys, selectedRows });
	};

	// 单个删除
	deleteSingleArea(record) {
		const data = [];
		const array = this.state.dataSource;
		for (let i = 0; i < array.length; i++) {
			if (record.biz_district_id != array[i].biz_district_id) {
				data.push(array[i]);
			}
		}
		this.setState({
			dataSource: data,
		});
	}

	// 批量删除
	batchDelete = () => {
		const array = this.state.dataSource;
		const filter = this.state.selectedRows;
		const data = [];
		const idArray = [];
		for (let i = 0; i < filter.length; i++) {
			idArray.push(filter[i].biz_district_id);
		}
		for (let i = 0; i < array.length; i++) {
			if (idArray.indexOf(array[i].biz_district_id) == -1) {
				data.push(array[i]);
			}
		}
		this.setState({
			dataSource: data,
			selectedRowKeys: [],
			selectedRows: [],
		})
	};

	// 保存添加的商圈
	saveAddArea = () => {
		const { dispatch, form } = this.props;
		form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const supplierName = form.getFieldsValue(['supplier_name']).supplier_name;
				if (supplierName == '') {
					message.error('请填写服务商名字');
					return;
				} else {
					const bizDistrictInfoList = this.state.dataSource;
					dispatch({
						type: 'system/addSupplierAreaE',
						payload: {
							biz_district_info_list: bizDistrictInfoList,
							supplier_name: supplierName,
						}
					});
				}
			}
		})

	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		return (
			<div>
				<Form>
					<Row>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`供应商名称`}>
								{getFieldDecorator(`supplier_name`, {
									rules: [{ required: false, message: '请选择供应商名称', trigger: 'onBlur', type: 'string' }],
									initialValue: '',
								})(
									<Input placeholder="请输入供应商名称"/>
								)}
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col sm={6}>
							<FormItem label='平台' {...formItemLayout}>
								{getFieldDecorator('platform_code_list', {
									rules: [{
										type: 'array', message: '请选择平台',
									}, {
										required: false, message: '请选择平台',
									}],
									initialValue: this.state.platformInitValue,
								})(
									<Select mode="multiple" placeholder="请选择平台"
													onChange={this.platformChange}>
										{
											this.createPlatformList()
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem label='城市' {...formItemLayout}>
								{getFieldDecorator('city_spelling_list', {
									rules: [{
										type: 'array', message: '请选择城市',
									}, {
										required: false, message: '请选择城市',
									}],
									initialValue: this.state.cityInitValue,
								})(
									<Select placeholder="请选择城市" onChange={this.handleCityChange}
													mode="multiple">
										{
											this.state.cityList.map((item, index) => {
												return (<Option value={item.city_spelling}
																				key={index}>{item.city_name_joint}</Option>)
											})
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem label='商圈' {...formItemLayout}>
								{getFieldDecorator('biz_district_id_list', {
									rules: [{
										type: 'array', message: '请选择商圈',
									}, {
										required: false, message: '请选择商圈',
									}],
									initialValue: this.state.areaInitValue,
								})(
									<Select placeholder="请选择商圈" mode="multiple"
													optionFilterProp="children">
										{
											this.state.areaList.map((item, index) => {
												return (
													<Option value={item.biz_district_id}
																	key={item.biz_district_id}>{item.biz_district_name}</Option>
												)
											})
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<Button type="primary" className="mgl16" onClick={this.handleSubmits}>添加商圈</Button>
						</Col>
					</Row>
					<Row className='mgb16'>
						<Col sm={6}>
							<Col sm={4}/>
							<Button type="primary" className="mgl16" onClick={this.batchDelete}>批量删除</Button>
						</Col>
					</Row>
				</Form>
				<Table size='small' columns={this.state.columns} dataSource={this.state.dataSource} rowSelection={rowSelection}
							 rowKey={(record, index) => {
								 return index;
							 }} pagination={false} scroll={{ y: 310 }}/>
				<Row justify={'center'} type="flex" className="mgt16">
					<Button><Link to="System/Supplier">返回</Link></Button>
					{
						this.state.dataSource.length > 0 ?
							<Button type="primary" className='mgl16' onClick={this.saveAddArea}>保存</Button> : ''
					}

				</Row>
			</div>
		)
	}
}

function mapStateToProps({ system }) {
	return { system };
}
AddSupplier = Form.create()(AddSupplier);
export default connect(mapStateToProps)(AddSupplier);
