/**
 * Created by dave 2017/4/26
 * 公用table
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';

class TableModel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: props.columns,
			dataSource: props.dataSource,
		}
	}

	componentWillReceiveProps(nextProps) {
		//TODO 将类型判断转至 React 16版本的写法
		if (Array.isArray(nextProps.columns) && Array.isArray(nextProps.dataSource)) {
			this.setState({
				columns: nextProps.columns,
				dataSource: nextProps.dataSource,
			})
		}
	}

	render() {
		return (
			<div style={{ paddingTop: 16 }}>
				<Table columns={this.state.columns} dataSource={this.state.dataSource} pagination={false}
							 rowKey={(record, index) => {
								 return index;
							 }}/>
			</div>
		)
	}
}
export default connect()(TableModel);
