/**
 * Created by dave 2017/07/25
 * 返回组件
 *
 */
import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';

class Cancel extends Component {
	constructor(props) {
		super();
		this.state = {
			data: props,
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: nextProps,
		})
	}

	handleClick() {
		this.props.gather();
	}

	render() {
		return (
			<div>
				{
					this.state.data && this.state.data.edit == true ?
						<Row>
							<Col className='textRight' sm={11}>
								<a href={this.state.data.cancelUrl}>
									<Button>取消</Button>
								</a>
							</Col>
							<Col sm={2}></Col>
							<Col className='textLeft' sm={11}>
								<Button type="primary" onClick={this.handleClick.bind(this)}>保存</Button>
							</Col>
						</Row> :
						<Row className='textCenter'>
							<Col>
								<a href={this.state.data.cancelUrl}>
									<Button>返回</Button>
								</a>
							</Col>
						</Row>
				}
			</div>
		)
	}
}
export default Cancel;
