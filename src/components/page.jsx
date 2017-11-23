/**
 * Created by dave 2017/4/27
 *
 * */
import React, { Component } from 'react';
import { Pagination } from 'antd';

class Paging extends Component {
	constructor(props) {
		super(props);
		this.state = {
			total: '',
			page: '',
			current: '',
			pageSize: '',
		}
	};

	componentWillReceiveProps = (nextProps) => {
		//TODO 将类型判断转至 React 16版本的写法
		if(nextProps.total&&nextProps.page&&nextProps.current&&nextProps.pageSize){
				this.setState({
					total: nextProps.total,
					page: nextProps.page,
					current: nextProps.current,
					pageSize: nextProps.pageSize,
				})
		}
	};

	pageChange = (page, current, pageSize) => {
		this.setState({

		});
		this.props.pageChange(page, current, pageSize);
	};

	render() {
		return(
			<div>
				<Pagination onChange={this.pageChange}  total={this.state.total}
										showTotal={total => `总共 ${total} 条，${this.state.pageSize}条/页`}
										pageSize={20}
										defaultCurrent={1} />
			</div>
		)
	}
}

export default Paging;
