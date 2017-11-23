/**
 * Created by dave 2017/09/08
 * 库存信息-品目明细
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, Input, DatePicker } from 'antd';
import Table from './../../../components/table';
import Modal from './../../../components/modal';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
const [FormItem,Option] = [Form.Item, Select.Option];

class ItemList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			platformCode: '',
			id: props.materials.itemDetail._id,
			columns: [{
				title: '物资名称',
				dataIndex: 'material_name',
				key: 'material_name',
			}, {
				title: '物资规格',
				dataIndex: 'material_type',
				key: 'material_type',
				render: (text) => {
					return text == '' ? '--' : text;
				}
			}, {
				title: '物资单价（元）',
				dataIndex: 'purchase_price',
				key: 'purchase_price',
			}, {
				title: '押金（元）',
				dataIndex: 'deposit',
				key: 'deposit',
			}, {
				title: '月使用费（元）',
				dataIndex: 'monthly_fee',
				key: 'monthly_fee',
			}, {
				title: '状态',
				dataIndex: 'state',
				key: 'state',
				render: (text, record) => {
					return (<span>{aoaoBossTools.enumerationConversion(text)}</span>)
				}
			}, {
				title: '操作',
				dataIndex: '',
				key: 'id',
				render: (text, record) => {
					return (<span>
						{
							new Permission().pickerAddItem() == true ?
								<span className="systemTextColor pointer" onClick={this.showModal.bind(this, record)}>编辑</span> : '--'
						}
					</span>)
				}
			}],
			dataSource: props.materials.itemList.material_list,
			addFlag: false,
			addModalDataSource: {
				title: '编辑品目',
				visible: false,
				content: [{
					label: '物资名称',
					id: 'material_name',
					message: '请输入物资名称',
					required: true,
					placeholder: '请输入物资名称',
					initialValue: null,
				}, {
					label: '物资规格',
					id: 'material_type',
					message: '请输入物资规格',
					required: true,
					placeholder: '请输入物资规格',
					initialValue: null,
				}, {
					label: '物资采购价（元）',
					id: 'purchase_price',
					message: '请输入物资采购价',
					required: true,
					placeholder: '请输入物资采购价',
					initialValue: null,
				}, {
					label: '押金（元）',
					id: 'deposit',
					message: '请输入押金',
					required: true,
					placeholder: '请输入押金',
					initialValue: null,
				}, {
					label: '月使用费（元）',
					id: 'monthly_fee',
					message: '请输入月使用费',
					required: true,
					placeholder: '请输入月使用费',
					initialValue: null,
				}, {
					label: '状态',
					id: 'state',
					message: '请选择状态',
					required: true,
					placeholder: '请选择状态',
					initialValue: 80,
					Radio: [{
						name: '启用',
						value: 80,
					}, {
						name: '禁用',
						value: -80
					}]
				}]
			},
			editFlag: false,
			editModalDataSource: {
				title: '编辑品目',
				visible: false,
				content: [{
					label: '物资名称',
					id: 'material_name',
					message: '请输入物资名称',
					required: false,
					placeholder: '请输入物资名称',
					initialValue: props.materials.itemDetail.material_name || null,
				}, {
					label: '物资规格',
					id: 'material_type',
					message: '请输入物资规格',
					required: false,
					placeholder: '请输入物资规格',
					initialValue: props.materials.itemDetail.material_type || null,
				}, {
					label: '物资采购价（元）',
					id: 'purchase_price',
					message: '请输入物资采购价',
					required: false,
					placeholder: '请输入物资采购价',
					initialValue: props.materials.itemDetail.purchase_price || null,
				}, {
					label: '押金（元）',
					id: 'deposit',
					message: '请输入押金',
					required: false,
					placeholder: '请输入押金',
					initialValue: props.materials.itemDetail.deposit || null,
				}, {
					label: '月使用费（元）',
					id: 'monthly_fee',
					message: '请输入月使用费',
					required: false,
					placeholder: '请输入月使用费',
					initialValue: props.materials.itemDetail.monthly_fee || null,
				}, {
					label: '状态',
					id: 'state',
					message: '请选择状态',
					required: false,
					placeholder: '请选择状态',
					initialValue: props.materials.itemDetail.state || null,
					Radio: [{
						name: '启用',
						value: 80,
					}, {
						name: '禁用',
						value: -80
					}]
				}]
			},
		}
	}

	componentWillReceiveProps(nextProps) {
		const { editModalDataSource } = this.state;
		editModalDataSource.content = [{
			label: '物资名称',
			id: 'material_name',
			message: '请输入物资名称',
			required: false,
			placeholder: '请输入物资名称',
			initialValue: nextProps.materials.itemDetail.material_name || null,
		}, {
			label: '物资规格',
			id: 'material_type',
			message: '请输入物资规格',
			required: false,
			placeholder: '请输入物资规格',
			initialValue: nextProps.materials.itemDetail.material_type || null,
		}, {
			label: '物资采购价（元）',
			id: 'purchase_price',
			message: '请输入物资采购价',
			required: false,
			placeholder: '请输入物资采购价',
			initialValue: nextProps.materials.itemDetail.purchase_price || null,
		}, {
			label: '押金（元）',
			id: 'deposit',
			message: '请输入押金',
			required: false,
			placeholder: '请输入押金',
			initialValue: nextProps.materials.itemDetail.deposit || null,
		}, {
			label: '月使用费（元）',
			id: 'monthly_fee',
			message: '请输入月使用费',
			required: false,
			placeholder: '请输入月使用费',
			initialValue: nextProps.materials.itemDetail.monthly_fee || null,
		}, {
			label: '状态',
			id: 'state',
			message: '请选择状态',
			required: false,
			placeholder: '请选择状态',
			initialValue: nextProps.materials.itemDetail.state || 80,
			Radio: [{
				name: '启用',
				value: 80,
			}, {
				name: '禁用',
				value: -80
			}]
		}];
		this.setState({
			editModalDataSource,
			dataSource: nextProps.materials.itemList.material_list,
			id: nextProps.materials.itemDetail._id
		})
	}

	// 生成平台下拉选项
	createPlatformList() {
		const dataList = aoaoBossTools.readDataFromLocal(1, 'region');
		return dataList;
	}

	// 根据平台获取相应的采购模板
	platformChange = (value) => {
		const { dispatch } = this.props;
		this.setState({
			platformCode: value,
		});
		dispatch({
			type: 'materials/getItemListE',
			payload: {
				platform_code: value
			},
		})
	};

	// 编辑条目
	showModal(record) {
		const { editModalDataSource } = this.state;
		const { dispatch } = this.props;
		editModalDataSource.visible = true;
		this.setState({
			editModalDataSource,
		});
		dispatch({
			type: 'materials/bundleItemDetailR',
			payload: record,
		});
	}

	// 添加条目
	addModal = () => {
		const { addModalDataSource } = this.state;
		addModalDataSource.visible = true;
		this.setState({
			addModalDataSource,
		})
	};

	// 取消回调
	handleCancel = () => {
		const { addModalDataSource, editModalDataSource } = this.state;
		addModalDataSource.visible = false;
		editModalDataSource.visible = false;
		this.setState({
			addModalDataSource,
		});
		this.props.form.resetFields();
	};

	// 添加确认回调
	handleOk = (values) => {
		const { addModalDataSource, editModalDataSource, platformCode } = this.state;
		const { dispatch } = this.props;
		addModalDataSource.visible = false;
		editModalDataSource.visible = false;
		values.platform_code = platformCode;
		this.setState({
			addModalDataSource,
			editModalDataSource,
		});
		dispatch({
			type: 'materials/addItemOfTemplateE',
			payload: values,
		});
	};

	// 编辑确认回调
	handleOks = (values) => {
		const { dispatch } = this.props;
		const { addModalDataSource, editModalDataSource } = this.state;
		addModalDataSource.visible = false;
		editModalDataSource.visible = false;
		this.setState({
			addModalDataSource,
			editModalDataSource,
		});
		values._id = this.state.id;
		dispatch({
			type: 'materials/editItemDetailE',
			payload: values,
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		return (<div className="mgt8">
			<Form>
				<Row>
					<Col sm={6}>
						<FormItem {...formItemLayout} label={`平台`}>
							{getFieldDecorator(`platform_code_list`, {
								rules: [{
									type: 'string', message: '请选择平台',
								}, {
									required: false, message: '请选择平台',
								}],
							})(
								<Select placeholder="请选择平台"
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
					{
						new Permission().pickerAddItem() == true ?
							<Col sm={6}>
								<Col sm={3}/>
								<Button type="primary" className={`mgr8`} onClick={this.addModal}>添加</Button>
							</Col> : ''
					}
				</Row>
			</Form>
			<Table columns={this.state.columns} dataSource={this.state.dataSource}/>
			<Modal {...this.state.addModalDataSource}
						 handleCancel={this.handleCancel}
						 handleOk={this.handleOk}/>
			<Modal {...this.state.editModalDataSource}
						 handleCancel={this.handleCancel}
						 handleOk={this.handleOks}/>
		</div>)
	}
}

function mapStateToProps({ materials }) {
	return { materials }
}

export default connect(mapStateToProps)(Form.create()(ItemList));
