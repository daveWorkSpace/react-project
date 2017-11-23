/**
 * Created by dave 2017/4/25
 * 业务量查询 search 组件
 * 枚举值  month：按照账期查询   day：按照时间查询    query_type => { 1: 按时间查询, 2: 按账期查询}
 *
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Checkbox, Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment';
import aoaoBossTools from './../../utils/util';
import styles from './business.less';
const [FormItem,Option] = [Form.Item, Select.Option];
const { MonthPicker, RangePicker } = DatePicker;


class Search extends Component {
	constructor(props) {
		super(props);
		const cityData = aoaoBossTools.getArrayFromIndex(props.PlatformAndCityList.platform_list, ['elem']) || [];
		this.state = {
			focusLeft: true,
			focusRight: false,
			resetFields: 'COLLECT',   // 清除Form状态
			PlatformAndCityList: props.PlatformAndCityList,
			cityList: aoaoBossTools.getArrayFromIndex(props.PlatformAndCityList.platform_list, ['elem']) || cityData,
			areaList: props.areaList,
			dateType: 'day',
			dateTypeDisplay: true,
		}
	}

	// 接受父级 props
	componentWillReceiveProps(nextProps) {
		this.setState({
			focusLeft: nextProps.focusLeft,
			focusRight: nextProps.focusRight,
			resetFields: nextProps.resetFields,
			PlatformAndCityList: nextProps.PlatformAndCityList,
			areaList: nextProps.areaList,
		});
		if (nextProps.resetFields === 'CLEAR') {
			this.resetFields();
		}
	}

	// 平台改变
	handlePlatFormChange = (value) => {
		const values = aoaoBossTools.getArrayFromIndex(this.state.PlatformAndCityList.platform_list, value);
		this.props.form.resetFields(['city_list', 'biz_district_id_list']); // 清除城市及商圈默认数据
		this.setState({
			cityList: values,
		})
	};

	//城市改变获取商圈
	handleCityChange = (value) => {
		const flag = this.state.focusLeft;
		this.props.form.resetFields(['biz_district_id_list']); // 清除商圈默认数据
		this.props.form.resetFields(['biz_district_type_id_list']); // 清除商圈类型默认数据
		if (flag) {
			this.props.form.validateFields((err, values) => {
				if (err) {
					return;
				} else {
					const values = this.props.form.getFieldsValue();
					values.city_list = value;
					delete values.date;
					delete values.biz_district_id_list;
					delete values.biz_district_type_id_list;
					this.props.searchArea(values);
				}
			});
		}
		;
	};

	// 收集查询条件 查询数据
	handleSubmit = () => {
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				const startDate = aoaoBossTools.prctoMinute(values.date[0]._d, 0);
				const endDate = aoaoBossTools.prctoMinute(values.date[1]._d, 0);
				const arrayTypeList = this.itemTypeChange(values.biz_district_type_id_list); // 转换商圈类型的数据格式
				const dataType = this.state.dateType;
				if(dataType=='month') {
					values.query_type = 2;
				}else{
					values.query_type = 1;
				}
				values.start_date = startDate;
				values.biz_district_type_id_list = arrayTypeList;
				values.end_date = endDate;
				delete values.date;
				this.props.search(values);
			}
		});
	};

	// 清除Form 查询条件
	resetFields = () => {
		this.props.form.resetFields();
		this.props.clearReset();
	};

	// 商圈类型组件生成器
	hasAreaType = () => {
		const { getFieldDecorator } = this.props.form;
		if (this.state.focusLeft) {
			return (<Col sm={6}>
				<FormItem>
					<div>
						<Col sm={7} className='textCenter'>
							<span className="mgr8 ftw4">商圈类型</span>
						</Col>
						<Col sm={17}>
							{getFieldDecorator('biz_district_type_id_list', {
								rules: [{ required: false, message: '请选择', trigger: 'onBlur', type: 'array' }],
								initialValue: [],
							})(
								<Select mode="multiple"
												placeholder="请选择"
												onChange={this.areaTypeChange}>
									<Option value={'1'} key="areaType1">自营</Option>
									<Option value={'2'} key="areaType2">外包</Option>
								</Select>
							)}
						</Col>
					</div>
				</FormItem>
			</Col>)
		} else {
			return '';
		}
	};

	// 商圈类型更改
	areaTypeChange = (value) => {
		const arrayTypeList = this.itemTypeChange(value); // 转换商圈类型的数据格式
		const flag = this.state.focusLeft;
		this.props.form.resetFields(['biz_district_id_list']); // 重置商圈默认数据
		if (flag) {
			this.props.form.validateFields((err, values) => {
				if (err) {
					return;
				} else {
					const values = this.props.form.getFieldsValue();
					delete values.date;
					delete values.biz_district_id_list;
					values.biz_district_type_id_list = arrayTypeList;
					this.props.searchArea(values);
				}
			});
		}
		;
	};

	// 数组中的元素转换 string => number
	itemTypeChange = (array) => {
		if (array != undefined) {
			let arrayList = [];
			array.forEach((item, index) => {
				arrayList.push(Number(item));
			});
			return arrayList;
		}
	};

	// 处理每月可选择时间为上半月或者下半月
	disableDateOfMonth = (current) => {
		return current && current.get('date') > 1 && current.get('date') < Math.floor(current.daysInMonth() / 2) ||
			current.get('date') < current.daysInMonth() && current.get('date') > Math.floor(current.daysInMonth() / 2);
	};

	// 根据查询时间方式展示不同的时间选择组件
	dateTypeChange = (value) => {
		switch (value) {
			case 'month':
				this.setState({
					dateType: 'month',
					dateTypeDisplay: true,
				});
				break;
			case 'day':
				this.setState({
					dateType: 'day',
					dateTypeDisplay: true,
				});
				break;
		}
	};

	// 时间类型组件生成器
	rangePickerTypeSelect = () => {
		const type = this.state.dateType;
		switch (type) {
			case 'day':
				return
		}
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const itemLayout = { "labelCol": { "span": 4 }, "wrapperCol": { "span": 16 } };
		return (
			<div className={styles.business}>
				<div className="mgt8">
					<Form>
						<Row>
							<Col sm={6}>
								<FormItem>
									<div>
										<Col sm={4} className='textCenter'>
											<span className="mgr8 ftw4">平台</span>
										</Col>
										<Col sm={18}>
											{getFieldDecorator('platform_code_list', {
												rules: [{ required: false, message: '请选择平台', trigger: 'onBlur', type: 'array' }],
												initialValue: ['elem'],
											})(
												<Select mode="multiple"
																onChange={this.handlePlatFormChange}
																placeholder="请选择平台">
													{
														this.state.PlatformAndCityList.platform_list.map((item, index) => {
															return (<Option value={item.platform_code}
																							key={item.platform_code}>{item.platform_name}</Option>)
														})
													}
												</Select>
											)}
										</Col>
									</div>
								</FormItem>
							</Col>
							<Col sm={6}>
								<FormItem>

									<Row>
										<Col sm={4} className='textCenter'>
											<span className="mgr8 ftw4">城市</span>
										</Col>
										<Col sm={18}>
											{getFieldDecorator('city_list', {
												rules: [{ required: false, message: '请选择城市', trigger: 'onBlur', type: 'array' }],
												initialValue: [],
											})(
												<Select mode="multiple"
																placeholder="请先选择平台"
																onChange={this.handleCityChange}>
													{
														this.state.cityList.map((item, index) => {
															return (
																<Option value={item.city} key={item.city}>{item.city_name}</Option>
															)
														})
													}
												</Select>
											)}
										</Col>
									</Row>
								</FormItem>
							</Col>
							{
								this.hasAreaType()
							}
							<Col sm={6}>
								{
									this.state.focusLeft == true ? <FormItem>
										<div>
											<Col sm={4} className='textCenter'>
												<span className="mgr8 ftw4">商圈</span>
											</Col>
											<Col sm={18}>
												{getFieldDecorator('biz_district_id_list', {
													rules: [{ required: false, message: '请选择商圈', trigger: 'onBlur', type: 'array' }],
													initialValue: [],
												})(
													<Select mode="multiple"
																	placeholder="请先选择平台及城市">
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
											</Col>
										</div>
									</FormItem> : ''
								}
							</Col>
						</Row>
						<Row>
							<Col sm={24}>
								<FormItem>
									<Col sm={6}>
										<Col sm={4} className='textCenter'>
											<span className="mgr8 ftw4">时间</span>
										</Col>
										<Col sm={18}>
											<Select placeholder="请选择查询方式"
															onChange={this.dateTypeChange}
															value={this.state.dateType}>
												<Option value={'month'}>按账期查询</Option>
												<Option value={'day'}>按时间查询</Option>
											</Select>
										</Col>
									</Col>
									<Col sm={6}>
										<Col sm={4}>

										</Col>
										<Col sm={18}>
											{
												this.state.dateType == 'month' ?
													<div>
														{getFieldDecorator('date', {
															rules: [{ required: false, message: '请选择时间', trigger: 'onBlur', type: 'array' }],
															initialValue: [],
														})(
															<RangePicker
																format={'YYYY-MM-DD'}
																disabledDate={this.disableDateOfMonth}
															/>
														)}
													</div> :
													<div>
														{getFieldDecorator('date', {
															rules: [{ required: false, message: '请选择时间', trigger: 'onBlur', type: 'array' }],
															initialValue: [moment(aoaoBossTools.GetDateStr(-2), 'YYYY-MM-DD'), moment(aoaoBossTools.GetDateStr(-2), 'YYYY-MM-DD')],
														})(
															<RangePicker
																format={'YYYY-MM-DD'}
															/>
														)}
													</div>
											}

										</Col>
									</Col>
								</FormItem>
							</Col>
							<Col sm={8} className={`ant-col-sm-8`}>
								<Col sm={2}/>
								<Button type="primary" className={styles.sbtn} onClick={this.handleSubmit}>查询</Button>
							</Col>
						</Row>
					</Form>
				</div>
			</div>
		)
	}
}
Search = Form.create()(Search);

export default connect()(Search);
