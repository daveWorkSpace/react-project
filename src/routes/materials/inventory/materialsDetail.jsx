/**
 * Created by dave 2017/09/08
 * 物资详情
 */
import React, { Component } from 'react';
import { Link } from 'react-router'
import Table from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
import { Row, Col, Form, Button } from 'antd';
import { connect } from 'dva';
const [FormItem] = [Form.Item];

class MaterialsDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detail: props.materials.KnightMaterialsDetail,
			columns: [{
				title: '物资名称',
				dataIndex: 'material_name',
				key: 'material_name',
			}, {
				title: '物资规格',
				dataIndex: 'material_type',
				key: 'material_type',
			}, {
				title: '付款方式',
				dataIndex: 'payment_type',
				key: 'payment_type',
			}, {
				title: '付款金额（元）',
				dataIndex: 'payment_amount',
				key: 'payment_amount',
			}, {
				title: '单号',
				dataIndex: 'order_id',
				key: 'order_id',
			}, {
				title: '操作人',
				dataIndex: 'applicant_name',
				key: 'applicant_name',
			}, {
				title: '操作人手机号',
				dataIndex: 'applicant_phone',
				key: 'applicant_phone',
			}, {
				title: '操作时间',
				dataIndex: 'created_at',
				key: 'created_at',
			}]
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			detail: nextProps.materials.KnightMaterialsDetail,
		})
	}

	render() {
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		return (<div>
			<Row>
				<Col sm={6}>
					<FormItem {...formItemLayout} label={`姓名`} className="ftw6">
						<span>{this.state.detail.name}</span>
					</FormItem>
				</Col>
				<Col sm={6}>
					<FormItem {...formItemLayout} label={`手机号`} className="ftw6">
						<span>{this.state.detail.phone}</span>
					</FormItem>
				</Col>
				<Col sm={6}>
					<FormItem {...formItemLayout} label={`职位`} className="ftw6">
						<span>{aoaoBossTools.enumerationConversion(this.state.detail.position_id)}</span>
					</FormItem>
				</Col>
				<Col sm={6}>
					<FormItem {...formItemLayout} label={`供应商`} className="ftw6">
						<span>{this.state.detail.supplier_name}</span>
					</FormItem>
				</Col>
				<Col sm={6}>
					<FormItem {...formItemLayout} label={`平台`} className="ftw6">
						<span>{this.state.detail.platform_name}</span>
					</FormItem>
				</Col>
				<Col sm={6}>
					<FormItem {...formItemLayout} label={`城市`} className="ftw6">
						<span>{this.state.detail.city_name_joint}</span>
					</FormItem>
				</Col>
				<Col sm={6}>
					<FormItem {...formItemLayout} label={`商圈`} className="ftw6">
						<span>{this.state.detail.biz_district_name}</span>
					</FormItem>
				</Col>
			</Row>
			<Table columns={this.state.columns} dataSource={this.state.detail.knight_material_list}/>
			<Row justify={'center'} type="flex" className={'mgt16'}>
				<Col sm={12} className={'textCenter'}><Button type="primary"><Link
					to="Materiel/Stores/Knight">返回</Link></Button></Col>
			</Row>
		</div>)
	}
}

function mapStateToProps({ materials }) {
	return { materials };
}

export default connect(mapStateToProps)(Form.create()(MaterialsDetail));
