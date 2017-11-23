/**
 * Created by dave 2017/09/08
 * 库存信息-变动明细
 */
import React, { Component } from 'react';
import { Link } from 'react-router'
import Table from './../../../components/table';
import { Row, Col, Form, Button } from 'antd';
import { connect } from 'dva';
import aoaoBossTools from './../../../utils/util';
const [FormItem] = [Form.Item];

class ChangeLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			platform_name: props.materials.changeDetail.platform_name,
			city_name: props.materials.changeDetail.city_name,
			start_date: props.materials.changeDetail.start_date,
			end_date: props.materials.changeDetail.end_date,
			material: props.materials.changeDetail.material,
			begin_stock_amount: props.materials.changeDetail.begin_stock_amount,
			end_stock_amount: props.materials.changeDetail.end_stock_amount,
			material_stock_detail_list: props.materials.changeDetail.material_stock_detail_list || [],
			columns: [{
				title: '日期',
				dataIndex: 'date',
				key: 'date',
			}, {
				title: '单号',
				dataIndex: 'order_id',
				key: 'order_id',
			}, {
				title: '变动数量',
				dataIndex: 'change_amount',
				key: 'change_amount',
			}, {
				title: '操作类型',
				dataIndex: 'handle_type',
				key: 'handle_type',
				render: (text, record) => {
					return (<span>{aoaoBossTools.enumerationConversion(text)}</span>)
				}
			}, {
				title: '商圈',
				dataIndex: 'biz_district_name',
				key: 'biz_district_name',
			}, {
				title: '骑士姓名',
				dataIndex: 'knight_name',
				key: 'knight_name',
			}, {
				title: '骑士手机号',
				dataIndex: 'knight_phone',
				key: 'knight_phone',
			},]
		}
	}

	// 接受父级数据
	componentWillReceiveProps(nextProps) {
		this.setState({
			platform_name: nextProps.materials.changeDetail.platform_name,
			city_name: nextProps.materials.changeDetail.city_name,
			start_date: nextProps.materials.changeDetail.start_date,
			end_date: nextProps.materials.changeDetail.end_date,
			material: nextProps.materials.changeDetail.material,
			begin_stock_amount: nextProps.materials.changeDetail.begin_stock_amount,
			end_stock_amount: nextProps.materials.changeDetail.end_stock_amount,
			material_stock_detail_list: nextProps.materials.changeDetail.material_stock_detail_list || [],
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
					<FormItem {...formItemLayout} label={`平台`} className="ftw6">
						<span>{this.state.platform_name}</span>
					</FormItem>
				</Col>
				<Col sm={6}>
					<FormItem {...formItemLayout} label={`城市`} className="ftw6">
						<span>{this.state.city_name}</span>
					</FormItem>
				</Col>
				<Col sm={6}>
					<FormItem {...formItemLayout} label={`日期`} className="ftw6">
						<span>{this.state.start_date}~{this.state.end_date}</span>
					</FormItem>
				</Col>
				<Col sm={6}>
					<FormItem {...formItemLayout} label={`物资`} className="ftw6">
						<span>{this.state.material}</span>
					</FormItem>
				</Col>
				<Col sm={6}>
					<FormItem {...formItemLayout} label={`期初库存`} className="ftw6">
						<span>{this.state.begin_stock_amount}</span>
					</FormItem>
				</Col>
				<Col sm={6}>
					<FormItem {...formItemLayout} label={`期末库存`} className="ftw6">
						<span>{this.state.end_stock_amount}</span>
					</FormItem>
				</Col>
			</Row>
			<Table columns={this.state.columns} dataSource={this.state.material_stock_detail_list}/>
			<Row justify={'center'} type="flex" className={'mgt16'}>
				<Col sm={12} className={'textCenter'}><Button type="primary"><Link
					to="Materiel/Stores/Search">返回</Link></Button></Col>
			</Row>
		</div>)
	}
}

function mapStateToProps({ materials }) {
	return { materials }
}

export default connect(mapStateToProps)(ChangeLog);
