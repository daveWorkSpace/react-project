/**
 * Created by dave 2017/07/25
 * 员工编辑组件
 */
import React, { Component } from 'react';
import moment from 'moment';
import { Row, Col, Form, Input, Select, Radio, Upload, message, Button, Icon, Spin, DatePicker } from 'antd';
import { connect } from 'dva';
import style from './search.less';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
const { MonthPicker, RangePicker } = DatePicker;
moment.locale('zh-cn');

const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option];
const list = [
	{
		"value": "汉族 ",
		"key": "汉族 "
	},
	{
		"value": "壮族 ",
		"key": "壮族 "
	},
	{
		"value": "满族 ",
		"key": "满族 "
	},
	{
		"value": "回族 ",
		"key": "回族 "
	},
	{
		"value": "苗族 ",
		"key": "苗族 "
	},
	{
		"value": "维吾尔族 ",
		"key": "维吾尔族 "
	},
	{
		"value": "土家族 ",
		"key": "土家族 "
	},
	{
		"value": "彝族 ",
		"key": "彝族 "
	},
	{
		"value": "蒙古族 ",
		"key": "蒙古族 "
	},
	{
		"value": "藏族 ",
		"key": "藏族 "
	},
	{
		"value": "布依族 ",
		"key": "布依族 "
	},
	{
		"value": "侗族 ",
		"key": "侗族 "
	},
	{
		"value": "瑶族 ",
		"key": "瑶族 "
	},
	{
		"value": "朝鲜族 ",
		"key": "朝鲜族 "
	},
	{
		"value": "白族 ",
		"key": "白族 "
	},
	{
		"value": "哈尼族 ",
		"key": "哈尼族 "
	},
	{
		"value": "哈萨克族 ",
		"key": "哈萨克族 "
	},
	{
		"value": "黎族 ",
		"key": "黎族 "
	},
	{
		"value": "傣族 ",
		"key": "傣族 "
	},
	{
		"value": "畲族 ",
		"key": "畲族 "
	},
	{
		"value": "傈僳族 ",
		"key": "傈僳族 "
	},
	{
		"value": "仡佬族 ",
		"key": "仡佬族 "
	},
	{
		"value": "东乡族 ",
		"key": "东乡族 "
	},
	{
		"value": "高山族 ",
		"key": "高山族 "
	},
	{
		"value": "拉祜族 ",
		"key": "拉祜族 "
	},
	{
		"value": "水族 ",
		"key": "水族 "
	},
	{
		"value": "佤族 ",
		"key": "佤族 "
	},
	{
		"value": "纳西族 ",
		"key": "纳西族 "
	},
	{
		"value": "羌族 ",
		"key": "羌族 "
	},
	{
		"value": "土族 ",
		"key": "土族 "
	},
	{
		"value": "仫佬族 ",
		"key": "仫佬族 "
	},
	{
		"value": "锡伯族 ",
		"key": "锡伯族 "
	},
	{
		"value": "柯尔克孜族 ",
		"key": "柯尔克孜族 "
	},
	{
		"value": "达斡尔族 ",
		"key": "达斡尔族 "
	},
	{
		"value": "景颇族 ",
		"key": "景颇族 "
	},
	{
		"value": "毛南族 ",
		"key": "毛南族 "
	},
	{
		"value": "撒拉族 ",
		"key": "撒拉族 "
	},
	{
		"value": "布朗族 ",
		"key": "布朗族 "
	},
	{
		"value": "塔吉克族 ",
		"key": "塔吉克族 "
	},
	{
		"value": "阿昌族 ",
		"key": "阿昌族 "
	},
	{
		"value": "普米族 ",
		"key": "普米族 "
	},
	{
		"value": "鄂温克族 ",
		"key": "鄂温克族 "
	},
	{
		"value": "怒族 ",
		"key": "怒族 "
	},
	{
		"value": "京族 ",
		"key": "京族 "
	},
	{
		"value": "基诺族 ",
		"key": "基诺族 "
	},
	{
		"value": "德昂族 ",
		"key": "德昂族 "
	},
	{
		"value": "保安族 ",
		"key": "保安族 "
	},
	{
		"value": "俄罗斯族 ",
		"key": "俄罗斯族 "
	},
	{
		"value": "裕固族 ",
		"key": "裕固族 "
	},
	{
		"value": "乌孜别克族 ",
		"key": "乌孜别克族 "
	},
	{
		"value": "门巴族 ",
		"key": "门巴族 "
	},
	{
		"value": "鄂伦春族 ",
		"key": "鄂伦春族 "
	},
	{
		"value": "独龙族 ",
		"key": "独龙族 "
	},
	{
		"value": "塔塔尔族 ",
		"key": "塔塔尔族 "
	},
	{
		"value": "赫哲族 ",
		"key": "赫哲族 "
	},
	{
		"value": "珞巴族",
		"key": "珞巴族"
	}
];
class EditPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataList: props.employee.employeeDetail,
			token: props.employee.token,
			path: props.employee.path,
			loading: false,
			field: props.employee.field,
			cityList: props.employee.platformList.cityList,
			areaList: props.employee.platformList.areaList,
			imgKeyList: props.employee.imgKeyList,
			platformList: [],
		};
	}

	// 接受父级的 ModalInfo 信息对弹窗架子填充
	componentWillReceiveProps = (nextProps) => {
		this.setState({
			dataList: nextProps.employee.employeeDetail,
			path: nextProps.employee.path,
			token: nextProps.employee.token,
			loading: nextProps.employee.loading,
			field: nextProps.employee.field,
			imgKeyList: nextProps.employee.imgKeyList,
		})
	};

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

	// 获取七牛的Token
	getToken(type) {
		const { dispatch } = this.props;
		dispatch({
			type: 'employee/getUploadTokenE',
			payload: type,
		})
	};

	handleSave = () => {
		const { dispatch } = this.props;
		const staff_id = this.props.employee.employeeDetail._id;
		const departure_approver_account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
		const account_id = aoaoBossTools.readDataFromLocal(1, 'account_id');
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				values.staff_id = staff_id;
				values.account_id = account_id;
				values.departure_approver_account_id = departure_approver_account_id;
				const value = Object.assign({}, values, this.state.imgKeyList);
				dispatch({
					type: 'employee/employeeEditE',
					payload: value,
				});
				this.props.form.resetFields();
			}
		});
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
		const { dispatch } = this.props;
		let staffId = this.state.dataList._id;
		let { token, path, field } = this.state;
		const props = {
			name: "file",
			action: "",
			showUploadList: false,
			listType: 'picture',
			data: function (file) {
				return {
					token: 'token',
					key: 'path',
					file: file,
				}
			},
			beforeUpload(file) {
				if (['image/jpeg', 'image/png', 'image/jpg'].indexOf(file.type) == -1) {
					message.error('只能上传图片');
					return false;
				}
				dispatch({
					type: "employee/getUploadLoadingR",
					payload: true,
				});
				//如果文件正确则创建任务
				const Timer = setTimeout(function () {
					dispatch({
						type: "employee/postFileToQINIUE",
						payload: { file: file, token: token, key: path, field: field, id: staffId }
					});
					clearTimeout(Timer);
				}, 1000);

			},
		};
		const { getFieldDecorator } = this.props.form;
		const positionList = new Permission().editFilter('jurisdictional_position_list'); // 职位列表
		const jobType = aoaoBossTools.readDataFromLocal(2, 'job_category') || [];  // 工作类型列表
		const contractBelong = aoaoBossTools.readDataFromLocal(2, 'contract_belong') || [];  // 合同归属列表
		const recruitmentChannel = aoaoBossTools.readDataFromLocal(2, 'recruitment_channel') || [];  // 招聘渠道列表
		return (
			<div>
				<Form>
					<Spin tip="Loading..." style={{ height: '120%' }} spinning={this.state.loading}>
						<div className={style.information}>
							<div className={`${style.topColor} ${style.top}`}>
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
													required: false, message: '请输姓名',
												}],
												initialValue: this.state.dataList.name,
											})(
												<Input placeholder="请输入姓名"/>
											)}
										</FormItem>
									</Col>
									<Col sm={8}>
										<FormItem label='学历' {...formItemLayout}>
											{getFieldDecorator('education', {
												rules: [{
													type: 'string', message: '请输入姓名',
												}, {
													required: false, message: '请输姓名',
												}],
												initialValue: this.state.dataList.education,
											})(
												<Select placeholder="请选择学历">
													<Option value={'本科以上'}>本科以上</Option>
													<Option value={'本科'}>本科</Option>
													<Option value={'大专'}>大专</Option>
													<Option value={'高中'}>高中</Option>
													<Option value={'中专'}>中专</Option>
													<Option value={'初中及以下'}>初中及以下</Option>
												</Select>
											)}
										</FormItem>
									</Col>
									<Col sm={8}>
										<FormItem label='联系电话' {...formItemLayout}>
											{getFieldDecorator('phone', {
												rules: [{
													type: 'string', message: '请输入手机号',
												}, {
													required: false, message: '请输入手机号',
												}],
												initialValue: this.state.dataList.phone,
											})(
												<Input placeholder="请输入手机号"/>
											)}
										</FormItem>
									</Col>
									<Col sm={8}>
										<FormItem label='性别' {...formItemLayout}>
											{getFieldDecorator('gender_id', {
												initialValue: this.state.dataList.gender_id,
											})(
												<RadioGroup>
													<Radio value={10}>男</Radio>
													<Radio value={20}>女</Radio>
												</RadioGroup>
											)}
										</FormItem>
									</Col>
									<Col sm={8}>
										<FormItem label='民族' {...formItemLayout}>
											{getFieldDecorator('national', {
												rules: [{
													type: 'string', message: '请选择民族',
												}, {
													required: false, message: '请输姓名',
												}],
												initialValue: this.state.dataList.national,
											})(
												<Select>
													{
														list.map((item, index) => {
															return <Option value={item.key} key={item.key}>{item.value}</Option>
														})
													}
												</Select>
											)}
										</FormItem>
									</Col>
									<Col sm={8}>
										<FormItem label='紧急联系人电话' {...formItemLayout}>
											{getFieldDecorator('emergency_contact_phone', {
												rules: [{
													type: 'string', message: '请输入紧急联系人电话',
												}, {
													required: false, message: '请输入紧急联系人电话',
												}],
												initialValue: this.state.dataList.emergency_contact_phone,
											})(
												<Input placeholder="请输入紧急联系人电话"/>
											)}
										</FormItem>
									</Col>
								</Row>
							</div>
							<div className={`${style.top}`}>
								<div className="mgb8">
									<span className={style.greenLable}></span>
									<span className="mgl8">
								<b>证件信息</b>
							</span>
								</div>
								<Row>
									<Col sm={12}>
										<FormItem label='身份证号' {...formItemLayout}>
											{getFieldDecorator('identity_card_id', {
												rules: [{
													type: 'string', message: '请输入身份证号',
												}, {
													required: false, message: '请输入身份证号',
												}],
												initialValue: this.state.dataList.identity_card_id,
											})(
												<Input placeholder="请输入身份证号"/>
											)}
										</FormItem>
									</Col>
									{
										this.state.dataList.position_id > 2007 ? <Col sm={12}>
											<FormItem label='所属平台录入身份证号' {...formItemLayout}>
												{getFieldDecorator('associated_identity_card_id', {
													rules: [{
														type: 'string', message: '请输入身份证号',
													}, {
														required: false, message: '请输入身份证号',
													}],
													initialValue: this.state.dataList.associated_identity_card_id,
												})(
													<Input placeholder="请输入身份证号"/>
												)}
											</FormItem>
										</Col> :
											<Col sm={12}>
												<FormItem label='所属平台录入身份证号' {...formItemLayout} style={{ opacity: '0' }}>
													<span>''</span>
												</FormItem>
											</Col>

									}
									<Col sm={12}>
										<FormItem label='身份证正面照' {...formItemLayout}>
											{getFieldDecorator('identity_card_front', {
												rules: [{
													type: 'string', message: '请输入手机号',
												}, {
													required: false, message: '请输入手机号',
												}],
												initialValue: this.state.dataList.identity_card_front,
											})(
												<div>
													<div className={`${style.imgBox} mgb8`}
															 onMouseUp={this.getToken.bind(this, 'identity_card_front')}>
														<Upload {...props}
																		className={`${style.editUploadIcon} ${style.complateBox}`}>
															<img src={this.state.dataList.identity_card_front} alt="暂无照片"
																	 className={style.imgStyle}/>
															<span className={style.editIconBox}>
															<Icon type="edit"/>
														</span>
														</Upload>
													</div>
												</div>
											)}
										</FormItem>
									</Col>
									<Col sm={12}>
										<FormItem label='身份证反面照' {...formItemLayout}>
											{getFieldDecorator('identity_card_back', {
												rules: [{
													type: 'string', message: '请上传图片',
												}, {
													required: false, message: '请上传图片',
												}],
												initialValue: this.state.dataList.identity_card_back,
											})(
												<div>
													<div className={`${style.imgBox} mgb8`}
															 onMouseUp={this.getToken.bind(this, 'identity_card_back')}>
														<Upload {...props}
																		className={`${style.editUploadIcon} ${style.complateBox}`}>
															<img src={this.state.dataList.identity_card_back} alt="暂无照片"
																	 className={style.imgStyle}/>
															<span className={style.editIconBox}>
															<Icon type="edit"/>
														</span>
														</Upload>
													</div>
												</div>
											)}
										</FormItem>
									</Col>
									<Col sm={12}>
										<FormItem label='银行卡号' {...formItemLayout}>
											{getFieldDecorator('bank_card_id', {
												rules: [{
													type: 'string', message: '请输入银行卡号',
												}, {
													required: false, message: '请输入银行卡号',
												}],
												initialValue: this.state.dataList.bank_card_id,
											})(
												<Input placeholder="请输入银行卡号"/>
											)}
										</FormItem>
									</Col>
									<Col sm={12}>
										<FormItem label='开户行支行' {...formItemLayout}>
											{getFieldDecorator('bank_branch', {
												rules: [{
													type: 'string', message: '请输入开户行支行',
												}, {
													required: false, message: '请输入开户行支行',
												}],
												initialValue: this.state.dataList.bank_branch,
											})(
												<Input placeholder="请输入开户行支行"/>
											)}
										</FormItem>
									</Col>
									<Col sm={12}>
										<FormItem label='银行卡正面' {...formItemLayout}>
											{getFieldDecorator('bank_card_front', {
												rules: [{
													type: 'string', message: '请上传图片',
												}, {
													required: false, message: '请上传图片',
												}],
												initialValue: this.state.dataList.bank_card_front,
											})(
												<div>
													<div className={`${style.imgBox} mgb8`}
															 onMouseUp={this.getToken.bind(this, 'bank_card_front')}>
														<Upload {...props}
																		className={`${style.editUploadIcon} ${style.complateBox}`}>
															<img src={this.state.dataList.bank_card_front} alt="暂无照片"
																	 className={style.imgStyle}/>
															<span className={style.editIconBox}>
															<Icon type="edit"/>
														</span>
														</Upload>
													</div>
												</div>
											)}
										</FormItem>
									</Col>
									<Col sm={12}>
										<FormItem label='半身照' {...formItemLayout}>
											{getFieldDecorator('bust', {
												rules: [{
													type: 'string', message: '请上传图片',
												}, {
													required: false, message: '请上传图片',
												}],
												initialValue: this.state.dataList.bust,
											})(
												<div>
													<div className={`${style.imgBox} mgb8`}
															 onMouseUp={this.getToken.bind(this, 'bust')}>
														<Upload {...props}
																		className={`${style.editUploadIcon} ${style.complateBox}`}>
															<img src={this.state.dataList.bust} alt="暂无照片"
																	 className={style.imgStyle}/>
															<span className={style.editIconBox}>
															<Icon type="edit"/>
														</span>
														</Upload>
													</div>
												</div>
											)}
										</FormItem>
									</Col>
									<Col sm={12}>
										<FormItem label='健康证' {...formItemLayout}>
											{getFieldDecorator('health_certificate', {
												rules: [{
													type: 'string', message: '请上传图片',
												}, {
													required: false, message: '请上传图片',
												}],
												initialValue: this.state.dataList.health_certificate,
											})(
												<div>
													<div className={`${style.imgBox} mgb8`}
															 onMouseUp={this.getToken.bind(this, 'health_certificate')}>
														<Upload {...props}
																		className={`${style.editUploadIcon} ${style.complateBox}`}>
															<img src={this.state.dataList.health_certificate} alt="暂无照片"
																	 className={style.imgStyle}/>
															<span className={style.editIconBox}>
															<Icon type="edit"/>
														</span>
														</Upload>
													</div>
												</div>
											)}
										</FormItem>
									</Col>
									<Col sm={12}>
										<FormItem label='上传合同' {...formItemLayout}>
											{getFieldDecorator('contract_photo', {
												rules: [{
													type: 'string', message: '请上传图片',
												}, {
													required: false, message: '请上传图片',
												}],
												initialValue: this.state.dataList.contract_photo,
											})(
												<div>
													<div className={`${style.imgBox} mgb8`}
															 onMouseUp={this.getToken.bind(this, 'contract_photo')}>
														<Upload {...props}
																		className={`${style.editUploadIcon} ${style.complateBox}`}>
															<img src={this.state.dataList.contract_photo} alt="暂无照片"
																	 className={style.imgStyle}/>
															<span className={style.editIconBox}>
															<Icon type="edit"/>
														</span>
														</Upload>
													</div>
												</div>
											)}
										</FormItem>
									</Col>
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
										<FormItem label='供应商名称' {...formItemLayout}>
											{getFieldDecorator('supplier_name', {
												rules: [{
													type: 'string', message: '请选择城市',
												}, {
													required: false, message: '请选择城市',
												}],
												initialValue: this.state.dataList.supplier_name,
											})(
												<span>{this.state.dataList.supplier_name}</span>
											)}
										</FormItem>
									</Col>
									<Col sm={8}>
										<FormItem label='平台' {...formItemLayout}>
											{getFieldDecorator('platform_code_list', {
												rules: [{
													type: 'array', message: '请选择平台',
												}, {
													required: false, message: '请选择平台',
												}],
												initialValue: aoaoBossTools.getArrayFormObject(this.state.dataList.platform_list, 'platform_code'),
											})(
												<Select mode="multiple" placeholder="请选择平台" onChange={this.platformChange}>
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
													required: false, message: '请选择城市',
												}],
												initialValue: aoaoBossTools.getArrayFormObject(this.state.dataList.city_list, 'city_spelling'),
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
									<Col sm={8}>
										<FormItem label='商圈' {...formItemLayout}>
											{getFieldDecorator('biz_district_id_list', {
												rules: [{
													type: 'array', message: '请选择商圈',
												}, {
													required: false, message: '请选择商圈',
												}],
												initialValue: aoaoBossTools.getArrayFormObject(this.state.dataList.biz_district_list, 'biz_district_id'),
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
									<Col sm={8}>
										<FormItem label='职位' {...formItemLayout}>
											{getFieldDecorator('position_id', {
												initialValue: `${this.state.dataList.position_id}`,
											})(
												<Select>
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
									{
										this.state.dataList.position_id > 2007 ? <Col sm={8}>
											<FormItem label='骑士类型' {...formItemLayout}>
												{getFieldDecorator('job_category_id', {
													rules: [{
														type: 'string', message: '请选择骑士类型',
													}, {
														required: true, message: '请选择骑士类型',
													}],
													initialValue: `${this.state.dataList.job_category_id}`,
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
									<Col sm={8}>
										<FormItem label='合同归属' {...formItemLayout}>
											{getFieldDecorator('contract_belong_id', {
												rules: [{
													type: 'string', message: '请选择合同归属',
												}, {
													required: false, message: '请选择合同归属',
												}],
												initialValue: `${this.state.dataList.contract_belong_id}`,
											})(
												<Select placeholder="请选择合同归属">
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
										<FormItem label='招聘渠道' {...formItemLayout}>
											{getFieldDecorator('recruitment_channel_id', {
												rules: [{
													type: 'string', message: '请选择招聘渠道',
												}, {
													required: false, message: '请选择招聘渠道',
												}],
												initialValue: `${this.state.dataList.recruitment_channel_id}`,
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
									<Col sm={8}>
										<FormItem label='入职日期' {...formItemLayout}>
											{getFieldDecorator('entry_date', {
												rules: [{
													type: 'object', message: '请选择招聘渠道',
												}, {
													required: false, message: '请选择招聘渠道',
												}],
												initialValue: moment(this.state.dataList.entry_date, 'YYYY-MM-DD'),
											})(
												<DatePicker format={'YYYY-MM-DD'}/>
											)}
										</FormItem>
									</Col>
									<Col sm={8}>
										<FormItem label='员工状态' {...formItemLayout}>
											{getFieldDecorator('state', {
												rules: [{
													type: 'string', message: '请选择招聘渠道',
												}, {
													required: false, message: '请选择招聘渠道',
												}],
												initialValue: `${this.state.dataList.state}`,
											})(
												<Select placeholder="请选择骑士状态">
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
								</Row>
							</div>
							<Row>
								<Col className='textRight' sm={11}>
									<a href={`/#/Employee/Search`}>
										<Button>取消</Button>
									</a>
								</Col>
								<Col sm={2}></Col>
								<Col className='textLeft' sm={11}>
									<Button type="primary" onClick={this.handleSave}>保存</Button>
								</Col>
							</Row>
						</div>
					</Spin>
				</Form>
			</div>
		)
	}
}
EditPage = Form.create()(EditPage);
function mapStateToProps({ employee }) {
	return { employee }
}
export default connect(mapStateToProps)(EditPage);
