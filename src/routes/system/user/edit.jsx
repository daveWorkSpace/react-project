/**
 * Created by dave 2017/6/28
 * 用户编辑
 * describe：
 * 可以编辑以下信息
 *   1.用户的姓名  name
 *   2.用户的手机号  phone
 *   3.用户的角色  role_id
 *   4.用户账号的状态  state
 *
 * */

import React, { Component } from 'react';
import { Form, Input, Radio, Modal, Select } from 'antd';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option];

class EditModalPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: true, // 弹框状态
			userDetail: props.userDetail,
			cityList: props.cityList,
			areaList: props.areaList,
			employeeDetail: [],     // 员工信息
			platformList: [],       // 平台信息
			employeeSearchFlag: false,
			areaFlag: false,
			cityFlag: false,
			platformFlag: false,
		}
	}

	// 接受父级的 ModalInfo 信息对弹窗架子填充
	componentWillReceiveProps = (nextProps) => {
		this.setState({
			userDetail: nextProps.userDetail,
		})
	};

	// 弹窗确认事件
	handleOk = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				this.props.handleOk(values);
				this.setState({
					visible: false,
				});
				this.props.form.resetFields();
			}
		});

	};

	// 弹窗取消事件
	handleCancel = (e) => {
		e.preventDefault();
		this.props.handleCancel();
		this.setState({
			visible: false,
		});
		this.props.form.resetFields();
	};

	// 生成平台下拉选项
	createPlatformList() {
		const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
		return (dataList.map((item, index) => {
			return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>
		}));
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
			const diffItem = aoaoBossTools.filterDiffOfArray(cityValue, key);  // 城市更改后的差异数据
			const areaListFromCity = aoaoBossTools.getArrayItemIndex(cityData, diffItem, 'city_spelling');  // 城市下商圈信息列表
			const areaKeyValueList = aoaoBossTools.getAreaListFromCityList(areaListFromCity, cityData); // 整理后的数商圈数据
			const value = aoaoBossTools.getArrayFormObject(areaKeyValueList, 'biz_district_id');  // 商圈id列表
			const setAreaValue = aoaoBossTools.removeItemOfFilter(areaValue, value);
			this.props.form.setFields({ biz_district_id_list: { value: setAreaValue } });
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

	// 可选项控制
	roleChange = (value) => {
		this.setState({
			employeeSearchFlag: false,
			areaFlag: false,
			cityFlag: false,
			platformFlag: false,
		});
		const employeeSearchPool = ['1003', '1004', '1005', '1006', '1007'];
		const areaPool = ['1006', '1007'];
		const cityPool = ['1003', '1004', '1005'];
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
		const positionList = new Permission().editFilter('jurisdictional_role_list'); // 职位列表
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<Modal title={'编辑用户'} visible={this.state.visible}
							 onOk={this.handleOk} onCancel={this.handleCancel}
							 okText="确认" cancelText="取消"
				>
					<Form>
						<FormItem label='姓名' {...formItemLayout}>
							{getFieldDecorator('name', {
								rules: [{
									type: 'string', message: '请输入姓名',
								}, {
									required: true, message: '请输姓名',
								}],
								initialValue: this.state.userDetail.name && this.state.userDetail.name,
							})(
								<Input placeholder="请输入姓名"/>
							)}
						</FormItem>
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
								initialValue: this.state.userDetail.phone && this.state.userDetail.phone,
							})(
								<Input placeholder="请输入手机号"/>
							)}
						</FormItem>

						<FormItem label='角色' {...formItemLayout}>
							{getFieldDecorator('role_id', {
								rules: [{
									type: 'string', message: '请选择角色',
								}, {
									required: true, message: '请选择角色',
								}],
								initialValue: `${this.state.userDetail && this.state.userDetail.role_id}`,
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
						{/*平台权限 roleId:1003 总监级别以上不需要添加默认所有*/}
						{
							this.state.platformFlag == true ? <FormItem label='平台' {...formItemLayout}>
								{getFieldDecorator('platform_code_list', {
									rules: [{
										type: 'array', message: '请选择平台',
									}, {
										required: true, message: '请选择平台',
									}],
									initialValue: aoaoBossTools.getArrayFormObject(this.state.userDetail && this.state.userDetail.platform_list, 'platform_code'),
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
								<FormItem label='城市' {...formItemLayout}>
									{getFieldDecorator('city_spelling_list', {
										rules: [{
											type: 'array', message: '请选择城市',
										}, {
											required: false, message: '请选择城市',
										}],
										initialValue: aoaoBossTools.getArrayFormObject(this.state.userDetail && this.state.userDetail.city_list, 'city_spelling'),
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
									initialValue: aoaoBossTools.getArrayFormObject(this.state.userDetail && this.state.userDetail.biz_district_list, 'biz_district_id'),
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
						<FormItem label='状态' {...formItemLayout}>
							{getFieldDecorator('state', {
								initialValue: this.state.userDetail.state && this.state.userDetail.state,
							})(
								<RadioGroup>
									<Radio value={100}>启用</Radio>
									<Radio value={-100}>禁用</Radio>
								</RadioGroup>
							)}
						</FormItem>
						<span>
							{getFieldDecorator('_id', {
								initialValue: this.state.userDetail._id && this.state.userDetail._id,
							})}
						</span>
					</Form>
				</Modal>
			</div>
		);
	}
}

EditModalPage = Form.create()(EditModalPage);
export default EditModalPage;
