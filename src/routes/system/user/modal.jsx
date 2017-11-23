import React, { Component } from 'react';
import { Form, Input, Radio, Modal, Row, Col, Select, Button } from 'antd';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
const FormItem = Form.Item;
const [RadioGroup, Option] = [Radio.Group, Select.Option];

class ModalPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: props.visible, // 弹框状态
			title: props.title,			// 弹窗标题
			cityList: [],
			areaList: [],
			platformList: [],
			platformInitValue: [],  // 平台下拉默认值
			cityInitValue: [],			// 城市下拉默认值
			areaInitValue: [],      // 商圈下拉默认值
			supplierList: props.supplier || [],       // 供应商列表
			employeeDetail: props.employeeDetail,     // 员工信息
			staffId: '',     // 员工id
			employeeSearchFlag: false,
			areaFlag: false,
			cityFlag: false,
			platformFlag: false,
			supplierFlag: false,
		}
	}

	// 接受父级的 ModalInfo 信息对弹窗架子填充
	componentWillReceiveProps = (nextProps) => {
		this.setState({
			visible: nextProps.visible,
			title: nextProps.title,
			employeeDetail: nextProps.employeeDetail,
			supplierList: nextProps.supplierList,
		})
	};

	// 弹窗确认事件
	handleOk = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				values.staff_id = this.state.staffId;
				this.props.handleOk(values);
				this.props.form.resetFields();
			}
		});

	};

	// 弹窗取消事件
	handleCancel = (e) => {
		this.props.handleCancel();
		this.props.form.resetFields();
	};

	// 获取城市列表
	platformChange = (data) => {
		const { form } = this.props;
		const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), data, 'city_name_joint');
		const value = aoaoBossTools.getArrayFormObject(cityList, 'city_spelling');  // 城市id列表
		this.handleCityChange(value);
		debugger;
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

	// 名字更改后查询员工列表
	employeeSearch = (value) => {
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const params = {};
				params.name = values.name;
				params.phone = values.phone;
				params.limit = 500;
				params.page = 1;
				this.props.getEmployeeList(params);
			}
		});
	};

	// 存储staffId
	staffIdChange = (value) => {
		this.setState({
			staffId: value,
		})
	};

	// 可选项控制
	roleChange = (value) => {
		this.setState({
			employeeSearchFlag: false,
			areaFlag: false,
			cityFlag: false,
			platformFlag: false,
			supplierFlag: false,
		});
		const employeeSearchPool = ['1003', '1004', '1005', '1006', '1007'];
		const areaPool = ['1006', '1007'];
		const cityPool = ['1003', '1004', '1005'];
		const supplier = ['1001'];
		// const paltformPool = ['1003', '1004', '1005', '1006', '1007'];
		// 控制员工查询
		if (employeeSearchPool.indexOf(value) != -1) {
			this.setState({
				employeeSearchFlag: true,
			})
		}
		if (employeeSearchPool.indexOf(value) != -1 && areaPool.indexOf(value) != -1) {
			// 控制商圈
			this.setState({
				employeeSearchFlag: true,
				areaFlag: true,
				cityFlag: true,
				platformFlag: true,
			})
		}
		if (cityPool.indexOf(value) != -1) {
			// 控制城市
			this.setState({
				cityFlag: true,
				employeeSearchFlag: true,
				platformFlag: true,
				areaFlag: false,
			})
		}
		if(supplier.indexOf(value) != -1) {
			this.setState({
				supplierFlag: true,
			})
		}
	};

	render() {
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 14 },
			},
		};
		const { getFieldDecorator } = this.props.form;
		const positionList = new Permission().editFilter('jurisdictional_role_list'); // 职位列表
		return (
			<div>
				<Modal title={this.state.title} visible={this.state.visible}
							 onOk={this.handleOk} onCancel={this.handleCancel}
							 okText="确认" cancelText="取消"
				>
					<Form>
						<Row>
							<Col>
								<FormItem label='姓名' {...formItemLayout}>
									{getFieldDecorator('name', {
										rules: [{
											type: 'string', message: '请输入姓名',
										}, {
											required: true, message: '请输入姓名',
										}],
										trigger: 'onChange',
									})(
										<Input placeholder="请输入姓名"/>
									)}
								</FormItem>
							</Col>
							<Col>
								<FormItem label='手机号' {...formItemLayout}>
									{getFieldDecorator('phone', {
										rules: [{
											validator: (rule, value, callback) => {
												if (value == '') {
													callback();
													return;
												}
												;
												if (!(/^1[34578]\d{9}$/.test(value))) {
													callback('请输入手机号');
													return;
												}
												callback();
											}
										}, {
											required: true, message: '请输入手机号',
										}],
									})(
										<Input placeholder="请输入手机号"/>
									)}
								</FormItem>
							</Col>
							<FormItem label='角色' {...formItemLayout}>
								{getFieldDecorator('role_id', {
									rules: [{
										type: 'string', message: '请选择角色',
									}, {
										required: true, message: '请选择角色',
									}],
								})(
									<Select placeholder="请选择角色" onChange={this.roleChange}>
										{
											positionList.map((item, index) => {
												return (
													<Option value={item.role_id.toString()} key={index}>{item.role_name}</Option>)
											})
										}
									</Select>
								)}
							</FormItem>
							{/*供应商权限 roleId:1001 只可以对coo设置供应商*/}
							{
								this.state.supplierFlag == true ?
									<FormItem label='供应商' {...formItemLayout}>
										{getFieldDecorator('supplier_id', {
											rules: [{
												type: 'string', message: '请选择供应商',
											}, {
												required: true, message: '请选择供应商',
											}],
										})(
											<Select placeholder="请选择供应商">
												{
													this.state.supplierList.map((item, index) => {
														return (<Option value={item._id}
																						key={index}>{item.supplier_name}</Option>)
													})
												}
											</Select>
										)}
									</FormItem> : ''
							}
							{/*平台权限 roleId:1003 总监级别以上不需要添加默认所有*/}
							{
								this.state.platformFlag == true ? <FormItem label='平台' {...formItemLayout}>
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
								</FormItem> : ''
							}
							{/*城市权限 roleId:1003 总监级别以上不需要添加默认所有*/}
							{
								this.state.cityFlag == true ?
									<FormItem label='城市' {...formItemLayout} onChange={this.handleCityChange}>
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
									</FormItem> : ''
							}
							{/*商圈权限 roleId:1006 调度级别以上不需要添加默认所有*/}
							{
								this.state.areaFlag == true ? <FormItem label='商圈' {...formItemLayout}>
									{getFieldDecorator('biz_district_id_list', {
										rules: [{
											type: 'array', message: '请输入身份证号',
										}, {
											required: false, message: '请输入身份证号',
										}],
										initialValue: this.state.areaInitValue,
									})(
										<Select placeholder="请选择商圈" mode="multiple">
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
								</FormItem> : ''
							}
							{/*管理员工权限 roleId:1002 运营以下需要管理自己的员工*/}
							{
								this.state.employeeSearchFlag == true ? <FormItem label='员工信息确认' {...formItemLayout}>
									{getFieldDecorator('staff_id', {
										rules: [{
											type: 'string', message: '请输确认员工信息',
										}, {
											required: false, message: '请输确认员工信息',
											initialValue: this.state.employeeDetail.data
											&& this.state.employeeDetail.data[0]
											&& this.state.employeeDetail.data[0]._id,
										}],
									})(
										<Row>
											<Col sm={18}>
												<Select placeholder="请完成上面各项确认员工" onChange={this.staffIdChange}>
													{
														this.state.employeeDetail.data.map((item, index) => {
															return (
																<Option value={item._id}
																				key={item._id}>{item.name}</Option>
															)
														})
													}
												</Select>
											</Col>
											<Col sm={1}/>
											<Col sm={4}>
												<Button type='primary' onClick={this.employeeSearch}>查询</Button>
											</Col>
										</Row>
									)}
								</FormItem> : ''
							}

							<FormItem label='状态' {...formItemLayout}>
								{getFieldDecorator('state', {
									initialValue: 100,
								})(
									<RadioGroup>
										<Radio value={100}>启用</Radio>
										<Radio value={-100}>禁用</Radio>
									</RadioGroup>
								)}
							</FormItem>
						</Row>
					</Form>
				</Modal>
			</div>
		);
	}
}

ModalPage = Form.create()(ModalPage);
export default ModalPage;
