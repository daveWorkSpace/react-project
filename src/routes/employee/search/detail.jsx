/**
 * Created by dave 2017/07/20
 * 员工详情页面
 * @class React.Component
 * @extends EmployeeDetail
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import Information from './../../../components/informationTemplate';
import Certificate from './../../../components/certificateTemplate';
import Cancel from './../../../components/cancel';
import aoaoBossTools from './../../../utils/util';

class EmployeeDetail extends Component {
	constructor(props) {
		super();
		this.state = {
			dataList: {
				color: true,
				topTitle: '个人信息',
				content: [{
					sm: 8,
					title: '姓名',
					data: props.employee
					&& props.employee.employeeDetail
					&& props.employee.employeeDetail.name || '--',
				}, {
					sm: 8,
					title: '学历',
					data: props.employee
					&& props.employee.employeeDetail
					&& props.employee.employeeDetail.education || '--',
				}, {
					sm: 8,
					title: '联系电话',
					data: props.employee
					&& props.employee.employeeDetail
					&& props.employee.employeeDetail.phone || '--',
				}, {
					sm: 8,
					title: '性别',
					data: props.employee
					&& props.employee.employeeDetail
					&& props.employee.employeeDetail.gender_id == 10 ? '男' : '女' || '--',
				}, {
					sm: 8,
					title: '民族',
					data: props.employee
					&& props.employee.employeeDetail
					&& props.employee.employeeDetail.national || '--',
				}, {
					sm: 8,
					title: '紧急联系人电话',
					data: props.employee
					&& props.employee.employeeDetail
					&& props.employee.employeeDetail.emergency_contact_phone || '--',
				}]
			},
			certificateData: {
				topTitle: '证件信息',
				content: [{
					sm: 12,
					title: '身份证号',
					data: props.employee
					&& props.employee.employeeDetail
					&& props.employee.employeeDetail.identity_card_id || '--',
				}, {
					sm: 12,
					title: '所属平台录入身份证号',
					data: props.employee
					&& props.employee.employeeDetail
					&& props.employee.employeeDetail.associated_identity_card_id || '--',
				}, {
					sm: 12,
					title: '身份证正面照',
					data: {
						url: props.employee
						&& props.employee.employeeDetail
						&& props.employee.employeeDetail.identity_card_front || '',
						style: {
							width: 400,
							height: 300,
							background: '#e8e8e8',
						}
					},
				}, {
					sm: 12,
					title: '身份证反面照',
					data: {
						url: props.employee
						&& props.employee.employeeDetail
						&& props.employee.employeeDetail.identity_card_back || '',
						style: {
							width: 400,
							height: 300,
							background: '#e8e8e8',
						}
					},
				}, {
					sm: 12,
					title: '银行卡号',
					data: props.employee
					&& props.employee.employeeDetail
					&& props.employee.employeeDetail.bank_card_id || '--',
				}, {
					sm: 12,
					title: '开户行支行',
					data: props.employee
					&& props.employee.employeeDetail
					&& props.employee.employeeDetail.bank_branch || '--',
				}, {
					sm: 12,
					title: '银行卡正面',
					data: {
						url: props.employee
						&& props.employee.employeeDetail
						&& props.employee.employeeDetail.bank_card_front || '',
						style: {
							width: 400,
							height: 300,
							background: '#e8e8e8',
						}
					},
				}, {
					sm: 12,
					title: '半身照',
					data: {
						url: props.employee
						&& props.employee.employeeDetail
						&& props.employee.employeeDetail.bust || '',
						style: {
							width: 400,
							height: 300,
							background: '#e8e8e8',
						}
					},
				}, {
					sm: 12,
					title: '健康证',
					data: {
						url: props.employee
						&& props.employee.employeeDetail
						&& props.employee.employeeDetail.health_certificate || '',
						style: {
							width: 400,
							height: 300,
							background: '#e8e8e8',
						}
					},
				}, {
					sm: 12,
					title: '合同照片',
					data: {
						url: props.employee
						&& props.employee.employeeDetail
						&& props.employee.employeeDetail.contract_photo || '',
						style: {
							width: 400,
							height: 300,
							background: '#e8e8e8',
						}
					},
				}]
			},
			workData: {
				topTitle: '工作信息',
				content: [{
					sm: 8,
					title: '供应商名称',
					data: props.employee
					&& props.employee.employeeDetail
					&& props.employee.employeeDetail.supplier_name || '--',
				}, {
					sm: 8,
					title: '平台',
					data: (function () {
						let string = '';
						const params = props.employee
							&& props.employee.employeeDetail
							&& props.employee.employeeDetail.platform_list || [];
						let len = props.employee
							&& props.employee.employeeDetail
							&& props.employee.employeeDetail.platform_list
							&& props.employee.employeeDetail.platform_list.length || 0;
						params.map((item, index) => {
							string += `${item.platform_name}${index < len - 1 ? '、' : ''}`;
						});
						return string;
					})(),
				}, {
					sm: 8,
					title: '城市',
					data: (function () {
						let string = '';
						const params = props.employee
							&& props.employee.employeeDetail
							&& props.employee.employeeDetail.city_list || [];
						let len = props.employee
							&& props.employee.employeeDetail
							&& props.employee.employeeDetail.city_list
							&& props.employee.employeeDetail.city_list.length || 0;
						params.map((item, index) => {
							string += `${item.city_name_joint}${index < len - 1 ? '、' : ''}`;
						});
						return string;
					})()
				}, {
					sm: 8,
					title: '商圈',
					data: (function () {
						let string = '';
						const params = props.employee
							&& props.employee.employeeDetail
							&& props.employee.employeeDetail.biz_district_list || [];
						let len = props.employee
							&& props.employee.employeeDetail
							&& props.employee.employeeDetail.biz_district_list
							&& props.employee.employeeDetail.biz_district_list.length || 0;
						params.map((item, index) => {
							string += `${item.biz_district_name}${index < len - 1 ? '、' : ''}`;
						});
						return props.employee.employeeDetail.position_id < 2007 ? '全部' : string;
					})(),
				}, {
					sm: 8,
					title: '职位',
					data: aoaoBossTools.enumerationConversion(props.employee
						&& props.employee.employeeDetail
						&& props.employee.employeeDetail.position_id) || '--',
				}, {
					sm: 8,
					title: '骑士类型',
					data: aoaoBossTools.enumerationConversion(props.employee
						&& props.employee.employeeDetail
						&& props.employee.employeeDetail.job_category_id) || '--',
				}, {
					sm: 8,
					title: '合同归属',
					data: aoaoBossTools.enumerationConversion(props.employee
						&& props.employee.employeeDetail
						&& props.employee.employeeDetail.contract_belong_id) || '--',
				}, {
					sm: 8,
					title: '招聘渠道',
					data: aoaoBossTools.enumerationConversion(props.employee
						&& props.employee.employeeDetail
						&& props.employee.employeeDetail.recruitment_channel_id) || '--',
				}, {
					sm: 8,
					title: '入职日期',
					data: props.employee
					&& props.employee.employeeDetail
					&& props.employee.employeeDetail.entry_date || '--',
				}]
			},
			cancelData: {
				edit: false,
				cancelUrl: '/#/Employee/Search',
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			dataList: {
				color: true,
				topTitle: '个人信息',
				content: [{
					sm: 8,
					title: '姓名',
					data: nextProps.employee.employeeDetail.name || '--',
				}, {
					sm: 8,
					title: '学历',
					data: nextProps.employee.employeeDetail.education || '--',
				}, {
					sm: 8,
					title: '联系电话',
					data: nextProps.employee.employeeDetail.phone || '--',
				}, {
					sm: 8,
					title: '性别',
					data: nextProps.employee.employeeDetail.gender_id == 10 ? '男' : '女' || '--',
				}, {
					sm: 8,
					title: '民族',
					data: nextProps.employee.employeeDetail.national || '--',
				}, {
					sm: 8,
					title: '紧急联系人电话',
					data: nextProps.employee.employeeDetail.emergency_contact_phone || '--',
				}]
			},
			certificateData: {
				topTitle: '证件信息',
				content: [{
					sm: 12,
					title: '身份证号',
					data: nextProps.employee.employeeDetail.identity_card_id || '--',
				}, {
					sm: 12,
					title: '所属平台录入身份证号',
					data: nextProps.employee.employeeDetail.associated_identity_card_id || '--',
				}, {
					sm: 12,
					title: '身份证正面照',
					data: {
						url: nextProps.employee.employeeDetail.identity_card_front || '',
						style: {
							width: 400,
							height: 300,
							background: '#e8e8e8',
						}
					},
				}, {
					sm: 12,
					title: '身份证反面照',
					data: {
						url: nextProps.employee.employeeDetail.identity_card_back || '',
						style: {
							width: 400,
							height: 300,
							background: '#e8e8e8',
						}
					},
				}, {
					sm: 12,
					title: '银行卡号',
					data: nextProps.employee.employeeDetail.bank_card_id || '--',
				}, {
					sm: 12,
					title: '开户行支行',
					data: nextProps.employee.employeeDetail.bank_branch || '--',
				}, {
					sm: 12,
					title: '银行卡正面',
					data: {
						url: nextProps.employee.employeeDetail.bank_card_front || '',
						style: {
							width: 400,
							height: 300,
							background: '#e8e8e8',
						}
					},
				}, {
					sm: 12,
					title: '半身照',
					data: {
						url: nextProps.employee.employeeDetail.bust || '',
						style: {
							width: 400,
							height: 300,
							background: '#e8e8e8',
						}
					},
				}, {
					sm: 12,
					title: '健康证',
					data: {
						url: nextProps.employee.employeeDetail.health_certificate || '',
						style: {
							width: 400,
							height: 300,
							background: '#e8e8e8',
						}
					},
				}, {
					sm: 12,
					title: '合同照片',
					data: {
						url: nextProps.employee.employeeDetail.contract_photo || '',
						style: {
							width: 400,
							height: 300,
							background: '#e8e8e8',
						}
					},
				}]
			},
			workData: {
				topTitle: '工作信息',
				content: [{
					sm: 8,
					title: '供应商名称',
					data: nextProps.employee
					&& nextProps.employee.employeeDetail
					&& nextProps.employee.employeeDetail.supplier_name || '--',
				}, {
					sm: 8,
					title: '平台',
					data: (function () {
						let string = '';
						const params = nextProps.employee.employeeDetail.platform_list || [];
						let len = nextProps.employee.employeeDetail.platform_list.length || 0;
						params.map((item, index) => {
							string += `${item.platform_name}${index < len - 1 ? '、' : ''}`;
						});
						return string;
					})(),
				}, {
					sm: 8,
					title: '城市',
					data: (function () {
						let string = '';
						const params = nextProps.employee.employeeDetail.city_list || [];
						let len = nextProps.employee.employeeDetail.city_list.length || 0;
						params.map((item, index) => {
							string += `${item.city_name_joint}${index < len - 1 ? '、' : ''}`;
						});
						return string;
					})()
				}, {
					sm: 8,
					title: '商圈',
					data: (function () {
						let string = '';
						const params = nextProps.employee.employeeDetail.biz_district_list || [];
						let len = nextProps.employee.employeeDetail.biz_district_list.length || 0;
						params.map((item, index) => {
							string += `${item.biz_district_name}${index < len - 1 ? '、' : ''}`;
						});
						return nextProps.employee.employeeDetail.position_id < 2008 ? '全部' : string;
					})(),
				}, {
					sm: 8,
					title: '职位',
					data: aoaoBossTools.enumerationConversion(nextProps.employee.employeeDetail.position_id) || '--',
				}, {
					sm: 8,
					title: '骑士类型',
					data: aoaoBossTools.enumerationConversion(nextProps.employee.employeeDetail.job_category_id) || '--',
				}, {
					sm: 8,
					title: '合同归属',
					data: aoaoBossTools.enumerationConversion(nextProps.employee.employeeDetail.contract_belong_id) || '--',
				}, {
					sm: 8,
					title: '招聘渠道',
					data: aoaoBossTools.enumerationConversion(nextProps.employee.employeeDetail.recruitment_channel_id) || '--',
				}, {
					sm: 8,
					title: '入职日期',
					data: nextProps.employee.employeeDetail.entry_date || '--',
				}]
			},
			cancelData: {
				edit: false,
				cancelUrl: '/#/Employee/Search',
			}
		})
	}

	gatherForm = () => {

	};

	render() {
		return (
			<div>
				<Information {...this.state.dataList}/>
				<Certificate {...this.state.certificateData}/>
				<Information {...this.state.workData}/>
				<Cancel {...this.state.cancelData} gather={this.gatherForm}/>
			</div>
		)
	}

}
function mapStateToProps({ employee }) {
	return { employee };
}
export default connect(mapStateToProps)(EmployeeDetail);
