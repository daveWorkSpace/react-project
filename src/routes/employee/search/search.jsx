/**
 * Created by dave  2017/7/17
 * 员工查询模块查询组件
 *
 */
import React, { Component } from 'react';
import { Form, Row, Col, Select, Button, Input } from 'antd';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
const [FormItem,Option] = [Form.Item, Select.Option];

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cityList: [],
			areaList: [],
		}
	}

	handleSubmit = () => {
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				this.props.search(values);
			}
		});
	};

	// 导出员工
	exportExcel = () => {
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				this.props.export(values);
			}
		});
	};

	// 生成平台下拉选项
	createPlatformList() {
		const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
		return dataList;
	}

	// 获取城市列表
	platformChange = (data) => {
		this.props.form.resetFields(['biz_district_id_list', 'city_spelling_list']);
		const cityList = aoaoBossTools.getArrayFromIndex(aoaoBossTools.readDataFromLocal(1, 'region'), data, 'city_name_joint');
		this.setState({
			cityList: cityList,
		})
	};

	// 生成商圈下拉选项
	handleCityChange = (key) => {
		this.props.form.resetFields(['biz_district_id_list']);
		const keyList = aoaoBossTools.getArrayItemIndex(this.state.cityList, key, 'city_spelling');
		const cityData = this.state.cityList;
		let areaArray = [];
		let areaData = [];
		keyList.forEach(function (item, index) {
			areaArray.push(cityData[item].biz_district_list);
		});
		for (var i = 0; i < areaArray.length; i++) {
			areaArray[i].forEach(function (item, index) {
				areaData.push(item);
			})
		}
		this.setState({
			areaList: areaData,
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const positionList = new Permission().searchPositionFilter('jurisdictional_position_list'); // 职位列表
		const jobType = aoaoBossTools.readDataFromLocal(2, 'job_category') || [];  // 工作类型列表
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		return (
			<div className="mgt8">
				<Form>
					<Row>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`姓名`}>
								{getFieldDecorator(`name`, {
									rules: [{ required: false, message: '请输入姓名', trigger: 'onBlur', type: 'string' }],
								})(
									<Input placeholder="请输入姓名"/>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`手机号`}>
								{getFieldDecorator(`phone`, {
									rules: [{ required: false, message: '请输入手机号', trigger: 'onBlur', type: 'string' }],
								})(
									<Input placeholder="请输入手机号"/>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`职位`}>
								{getFieldDecorator(`position_id_list`, {
									rules: [{ required: false, message: '请选择职位', trigger: 'onBlur', type: 'array' }],
								})(
									<Select placeholder="请选择职位"
													mode="multiple">
										{
											positionList.map((item, index) => {
												return (
													<Option value={item.position_id.toString()} key={index}>{item.position_name}</Option>)
											})
										}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`状态`}>
								{getFieldDecorator(`state`, {
									rules: [{ required: false, message: '请选择骑士状态', trigger: 'onBlur', type: 'string' }],
									initialValue: '50',
								})(
									<Select onChange={this.stateChange}
													placeholder="请选择骑士状态">
										<Option value={'50'}
														key={50}>在职</Option>
										<Option value={'1'}
														key={1}>离职待审核</Option>
										<Option value={'-50'}
														key={-50}>离职</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`类型`}>
								{getFieldDecorator(`job_category_id_list`)(
									<Select placeholder="请选择骑士类型"
													mode="multiple">
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
						</Col>
						<Col sm={6}>
							<FormItem {...formItemLayout} label={`平台`}>
								{getFieldDecorator(`platform_code_list`, {
									rules: [{
										type: 'array', message: '请选择平台',
									}, {
										required: false, message: '请选择平台',
									}],
								})(
									<Select mode="multiple" placeholder="请选择平台"
													onChange={this.platformChange}>
										{
											this.createPlatformList().map((item, index) => {
												return <Option value={item.platform_code} key={index}>{item.platform_name}</Option>
											})
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
										type: 'array', message: '请输入身份证号',
									}, {
										required: false, message: '请输入身份证号',
									}],
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
							</FormItem>
						</Col>
						<Col sm={12}>
							<Col sm={3}/>
							<Button type="primary" className={`mgr8`} onClick={this.handleSubmit}>查询</Button>
							<Button type="primary" className={`mgl8`} onClick={this.exportExcel}>导出Excel</Button>
						</Col>
					</Row>
				</Form>
			</div>
		)
	}

}

Search = Form.create()(Search);
export default Search;

