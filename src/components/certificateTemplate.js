/**
 * Created by dave 2017/07/21
 * 证件详情信息模板
 * @params props.certificateData {object}
 * @params props.certificateData.topTitle {string}
 * @params props.certificateData.content {array}
 * @params props.certificateData.content[i].sm {string}
 * @params props.certificateData.content[i].title {string}
 * @params props.certificateData.content[i].data {string||object}
 *
 */
import React, { Component } from 'react';
import { Col, Row } from 'antd';
import style from './components.less';
import Image from './imageTemplate';

class Certificate extends Component {
	constructor(props) {
		super();
		this.state = {
			certificate: props,
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			certificate: nextProps,
		})
	}

	render() {
		return (
			<div className={style.information}>
				<div className={style.content}>
					<div className="mgb8">
						<span className={style.greenLable}></span>
						<span className="mgl8">
						<b>{this.state.certificate.topTitle || ''}</b>
					</span>
					</div>
					<Row>
						{
							this.state.certificate.content.map((item, index) => {
								return (
									<Col sm={item.sm} className='mgb8' key={`${item.title}${index}`}>
										<Col sm={6} className='textRight'>
											<span className="mgr8 ftw3">{`${item.title}${item.title != '' ? `: ` : ''}`}</span>
										</Col>
										<Col sm={18} className='textLeft'>
											<b>
												{
													item.data.hasOwnProperty('url') == true ? <Image {...item.data}/> :
														<span>{`${item.data} `}</span>
												}
											</b>
										</Col>
									</Col>
								)
							})
						}
					</Row>
				</div>
			</div>
		)
	}
}
export default Certificate;
