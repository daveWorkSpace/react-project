/**
 * Created by dave 2017/07/31
 * 员工添加模块
 *
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, Radio, Upload, DatePicker, Button, Icon, Tooltip } from 'antd';
import style from './../search/search.less';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
import moment from 'moment';
const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option];
const { MonthPicker, RangePicker } = DatePicker;

class EmployeeAdd extends Component {
	constructor() {
		super();
		this.state = {
			cityList: [],   // 城市下拉框数据源
			areaList: [],   // 商圈下拉框数据源
			knightOption: false,
			centreOption: false,
			cityOption: false,
			platformInitValue: [],  // 平台下拉默认值
			cityInitValue: [],			// 城市下拉默认值
			areaInitValue: [],      // 商圈下拉默认值
			platformList: [],       // 平台数据源
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

	// 重置表单
	resetFormValue = ()=> {
		this.props.form.resetFields();
	};

	// 添加员工
	addEmployee = () => {
		const { dispatch } = this.props;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				dispatch({
					type: 'employee/employeeAddE',
					payload: values,
				});
				this.setState({
					knightOption: false,
				});
				this.props.form.resetFields();
			}
		});
	};

	// 根据不同的职位显示不同的输入项
	filterOption = (value) => {
		const knightPool = ['2008', '2009'];
		const centrePool = ['2006', '2007'];
		const cityPool = ['2003', '2004', '2005'];
		if (knightPool.indexOf(value) != -1) {
			this.setState({
				knightOption: true,
				centreOption: true,
				cityOption: false,
			})
		} else if (centrePool.indexOf(value) != -1) {
			this.setState({
				knightOption: false,
				centreOption: true,
				cityOption: false,
			})
		} else {
			this.setState({
				knightOption: false,
				centreOption: false,
				cityOption: true,
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
		const positionList = new Permission().editFilter('jurisdictional_position_list') || []; // 职位列表
		const jobType = aoaoBossTools.readDataFromLocal(2, 'job_category') || [];  // 工作类型列表
		const contractBelong = aoaoBossTools.readDataFromLocal(2, 'contract_belong') || [];  // 合同归属列表
		const recruitmentChannel = aoaoBossTools.readDataFromLocal(2, 'recruitment_channel') || [];  // 招聘渠道列表
		return (
			<Form>
				<div className={style.information}>
					<div className={`${style.top} ${style.topColor}`}>
						<div className="mgb8">
							<span className={style.greenLable}></span>
							<span className="mgl8">
										<b>岗位信息</b>
									</span>
						</div>
						<Row>
							<Col sm={8}>
								<FormItem label='职位' {...formItemLayout}>
									{getFieldDecorator('position_id', {
										rules: [{
											type: 'string', message: '请选择职位',
										}, {
											required: true, message: '请选择职位',
										}],
									})(
										<Select placeholder="请选择职位" onChange={this.filterOption}>
											{
												positionList.map((item, index) => {
													return (
														<Option value={item.position_id.toString()}
																		key={item.position_id}>{item.position_name}</Option>
													)
												})
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col sm={8}>
								<FormItem label='性别' {...formItemLayout}>
									{getFieldDecorator('gender_id', {
										initialValue: 10,
									})(
										<RadioGroup>
											<Radio value={10}>男</Radio>
											<Radio value={20}>女</Radio>
										</RadioGroup>
									)}
								</FormItem>
							</Col>
						</Row>
					</div>
					<div className={`${style.top}`}>
						<div className="mgb8">
							<span className={style.greenLable}></span>
							<span className="mgl8">
								<b>个人信息</b>
							</span>
						</div>
						<Row>
							<Col sm={8}>
								<FormItem label='姓名' {...formItemLayout}>
									{getFieldDecorator('name', {
										rules: [{
											type: 'string', message: '请输入姓名',
										}, {
											required: true, message: '请输姓名',
										}],
									})(
										<Input placeholder="请输入姓名"/>
									)}
								</FormItem>
							</Col>
							<Col sm={8}>
								<FormItem label='联系电话' {...formItemLayout}>
									{getFieldDecorator('phone', {
										rules: [{
											type: 'string', message: '请输入手机号',
										}, {
											required: true, message: '请输入手机号',
										}],
									})(
										<Input placeholder="请输入手机号"/>
									)}
								</FormItem>
							</Col>
							<Col sm={8}>
								<FormItem label='个人身份证号' {...formItemLayout}>
									{getFieldDecorator('identity_card_id', {
										rules: [{
											type: 'string', message: '请输入身份证号',
										}, {
											required: true, message: '请输入身份证号',
										}],
									})(
										<Input placeholder="请输入身份证号"/>
									)}
								</FormItem>
							</Col>
							{
								this.state.knightOption == true ? <Col sm={12}>
									<FormItem label='所属平台录入身份证号' {...formItemLayout}>
										{getFieldDecorator('associated_identity_card_id', {
											rules: [{
												type: 'string', message: '请输入身份证号',
											}, {
												required: true, message: '请输入身份证号',
											}],
										})(
											<Row>
												<Col sm={23}>
													<Input placeholder="请输入身份证号"/>
												</Col>
												<Col sm={1} className={style.ft18}>
													<Tooltip placement="right" title={`请与骑士确认，若不匹配，则无法生成工资单`}>
														<Icon type="exclamation-circle"/>
													</Tooltip>
												</Col>
											</Row>
										)}
									</FormItem>
								</Col> : ''
							}
						</Row>
					</div>
					<div className={`${style.top}`}>
						<div className="mgb8">
							<span className={style.greenLable}></span>
							<span className="mgl8">
								<b>工作信息</b>
							</span>
						</div>
						<Row>
							<Col sm={8}>
								<FormItem label='平台' {...formItemLayout}>
									{getFieldDecorator('platform_code_list', {
										rules: [{
											type: 'array', message: '请选择平台',
										}, {
											required: true, message: '请选择平台',
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
							<Col sm={8}>
								<FormItem label='城市' {...formItemLayout}>
									{getFieldDecorator('city_spelling_list', {
										rules: [{
											type: 'array', message: '请选择城市',
										}, {
											required: true, message: '请选择城市',
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
							{
								this.state.centreOption == true ? <Col sm={8}>
									<FormItem label='商圈' {...formItemLayout}>
										{getFieldDecorator('biz_district_id_list', {
											rules: [{
												type: 'array', message: '请选择商圈',
											}, {
												required: true, message: '请选择商圈',
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
								</Col> : ''
							}
							<Col sm={8}>
								<FormItem label='合同归属' {...formItemLayout}>
									{getFieldDecorator('contract_belong_id', {
										rules: [{
											type: 'string', message: '请输入合同归属',
										}, {
											required: true, message: '请输入合同归属',
										}],
									})(
										<Select placeholder="请选择合同归属方">
											{
												contractBelong.map((item, index) => {
													return (
														<Option value={item.constant_id.toString()}
																		key={item.constant_id}>{item.constant_name}</Option>
													)
												})
											}
										</Select>
									)}
								</FormItem>
							</Col>
							<Col sm={8}>
								<FormItem label='入职日期' {...formItemLayout}>
									{getFieldDecorator('entry_date', {
										rules: [{
											type: 'object', message: '请输入入职日期',
										}, {
											required: true, message: '请输入入职日期',
										}],
									})(
										<DatePicker format={'YYYY-MM-DD'}/>
									)}
								</FormItem>
							</Col>
							<Col sm={8}>
								<FormItem label='招聘渠道' {...formItemLayout}>
									{getFieldDecorator('recruitment_channel_id', {
										rules: [{
											type: 'string', message: '请选择招聘渠道',
										}, {
											required: true, message: '请选择招聘渠道',
										}],
									})(
										<Select placeholder="请选择招聘渠道">
											{
												recruitmentChannel.map((item, index) => {
													return (
														<Option value={item.constant_id.toString()}
																		key={item.constant_id}>{item.constant_name}</Option>
													)
												})
											}
										</Select>
									)}
								</FormItem>
							</Col>
							{
								this.state.knightOption == true ? <Col sm={8}>
									<FormItem label='骑士类型' {...formItemLayout}>
										{getFieldDecorator('job_category_id', {
											rules: [{
												type: 'string', message: '请选择骑士类型',
											}, {
												required: true, message: '请选择骑士类型',
											}],
										})(
											<Select placeholder="请选择骑士类型">
												{
													jobType.map(function (item, index) {
														return (
															<Option value={item.constant_id.toString()}
																			key={item.constant_id}>{item.constant_name}</Option>
														)
													})
												}
											</Select>
										)}
									</FormItem>
								</Col> : ''
							}
						</Row>
					</div>
					<Row>
						<Col className='textRight' sm={11}>
							<Button onClick={this.resetFormValue}>重置</Button>
						</Col>
						<Col sm={2}></Col>
						<Col className='textLeft' sm={11}>
							<Button type="primary" onClick={this.addEmployee}>保存</Button>
						</Col>
					</Row>
				</div>
			</Form>
		)
	}
}
EmployeeAdd = Form.create()(EmployeeAdd);

function mapStateToProps({ employee }) {
	return { employee }
}
export default connect(mapStateToProps)(EmployeeAdd);
