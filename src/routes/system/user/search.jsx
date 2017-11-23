/**
 * Created by dave 2017/06/29
 * 用户搜索组件
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button } from 'antd';
const [FormItem,Option] = [Form.Item, Select.Option];

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	// 接受父级 props
	componentWillReceiveProps(nextProps) {
		this.setState({});
	}

	// 收集查询条件 查询数据
	handleSubmit = (e) => {
		const { dispatch } = this.props;
		this.props.form.validateFields((err, values) => {
			if (err) {
				return;
			} else {
				const values = this.props.form.getFieldsValue();
				const [limit,page] = [500, 1];
				values.limit = limit;
				values.page = page;
				Number(values.state);
				dispatch({
					type: 'system/getAccountListE',
					payload: values,
				})
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<div className="mgt8">
					<Form>
						<Row>
							<Col sm={6}>
								<FormItem>
									<div>
										<Col sm={7} className='textCenter'>
											<span className="mgr8 ftw4">账户状态</span>
										</Col>
										<Col sm={17}>
											{getFieldDecorator('state', {
												rules: [{ required: false, message: '请选择平台', trigger: 'onBlur', type: 'string' }],
												initialValue: '100',
											})(
												<Select onChange={this.stateChange}
																placeholder="请选择账户状态">
													<Option value={'100'}
																	key={100}>启用</Option>
													<Option value={'-100'}
																	key={-100}>禁用</Option>
												</Select>
											)}
										</Col>
									</div>
								</FormItem>
							</Col>
							<Col sm={8} className={`ant-col-sm-8`}>
								<Col sm={2}/>
								<Button type="primary" onClick={this.handleSubmit}>查询</Button>
							</Col>
						</Row>
					</Form>
				</div>
			</div>
		)
	}
}
Search = Form.create()(Search);

function mapStateToProps({ system }) {
	return { system };
}

export default connect(mapStateToProps)(Search);
