/**
 * Created by dave 2017/4/25
 * 面包屑模板
 *
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Breadcrumb, Icon } from 'antd';
import config from './../../config';
import { BreadCrumbTool } from './../utils/createdBreadCumb';

class BreadCrumb extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// BreadcrumbData: config.breadCrumbData[props.publicModel.key-1],
			BreadcrumbData: new BreadCrumbTool().handleCreate(props.publicModel.pathname),
		}
	}

	componentWillReceiveProps = (nextProps) => {
		const { publicModel } = nextProps;
		let key = Number(publicModel.key)-1;
		// const breadCrumbData = config.breadCrumbData[key];
		const breadCrumbData = new BreadCrumbTool().handleCreate(publicModel.pathname);
		this.setState({
			BreadcrumbData: breadCrumbData,
		})
	};

	render() {
		return (
			<div>
				<Breadcrumb style={{marginBottom: 8 }}>
					{
						this.state.BreadcrumbData.map((item, index) => {
							return (
								<Breadcrumb.Item key={item}>
									{item}
								</Breadcrumb.Item>
							)
						})
					}
				</Breadcrumb>
			</div>
		)
	}
}

function mapStateToProps({ publicModel }) {
	return { publicModel }
}
export default connect(mapStateToProps)(BreadCrumb);
