/**
 * Created by dave 2017/4/25
 * 操作管理
 * */
import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './upload.less';
import { Table, Button, Spin, Modal, message, Pagination } from 'antd';
import ModalPage from './upload';
import CheckDetail from './checkDetail';
import aoaoBossTools from './../../utils/util';

class Upload extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [{
				title: '所属时间',
				dataIndex: 'date',
				render: (text, record) => {
					return (
						<div>{`${record.start_date} ~ ${record.end_date}`}</div>
					)
				}
			}, {
				title: '文件名称',
				dataIndex: 'filename',
				key: 'filename',
			}, /*{
			 title: '状态',
			 dataIndex: 'city_name',
			 key: 'city_name',
			 },*/ {
				title: '上传时间',
				dataIndex: 'created_at',
				key: 'created_at',
				render: (text) => {
					return (
						<span>{aoaoBossTools.prctoMinute(text, 3)}</span>
					)
				}
			}, {
				title: '操作',
				dataIndex: 'delivery_income',
				key: 'delivery_income',
				render: (text, record) => {
					return (
						<div>
							<a href={`${record.url}`} download><span className="systemTextColor"
								>下载</span></a>
							&nbsp;&nbsp;
						</div>
					)
				}
			}],
			dataSource: props.upload.uploadRecord.data,
			visible: false,
			title: '添加文件',
			loading: false,
			page: 1,
			current: 1,
			pageSize: 30,
			total: props.upload.uploadRecord._meta.result_count,
			token: props.upload.token,
			path: props.upload.path,
			values: '',
			date: [{ _d: '--' }, { _d: '--' }],
			file: { file: { name: '' } },
			fileDetail: props.upload.fileDetail,
			checkDetail: false,
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: nextProps.upload.uploadRecord.data,
			token: nextProps.upload.token,
			path: nextProps.upload.path,
			fileDetail: nextProps.upload.fileDetail,
			total: nextProps.upload.uploadRecord._meta.result_count,
		});
		if (nextProps.upload.fileDetail.ok) {
			this.setState({
				checkDetail: true,
				visible: false,
				loading: false,
			})
		} else if (nextProps.upload.fileDetail.ok === false) {
			message.error('您所填写的信息与文件内容不匹配，请重新填写上传', 3);
			document.getElementsByClassName('ant-modal-footer')[0].style.opacity = 1;
			this.setState({
				loading: false,
			})
		}
	}

	// 弹窗显示
	showModal = () => {
		this.setState({
			visible: true,
		});
	};
	// 弹窗确认事件
	handleOk = (values) => {
		this.setState({
			values: values,
			loading: true,
			date: values.date,
			file: values.file,
		});
		const { dispatch } = this.props;
		values.target_id = this.state.path;
		delete values.file;
		delete values.date;
		dispatch({
			type: 'upload/postUploadFileE',
			payload: values,
		})
	};
	// 弹窗取消事件
	handleCancel = () => {
		this.setState({
			visible: false,
		});
	};
	// 获取七牛的token
	getQINIUToken = () => {
		const { dispatch } = this.props;
		dispatch({
			type: 'upload/getUploadTokenE',
			payload: '',
		})
	};

	// 分页
	pageChange = (page, pageSize) => {
		this.setState({
			current: page,
			pageSize: pageSize,
		});
		const { dispatch } = this.props;
		dispatch({
			type: 'upload/getUploadRecordE',
			payload: {
				page: page,
				limit: pageSize,
			},
		})
	};

	render() {
		const { dispatch } =this.props;
		const props = {
			visible: this.state.visible,
			title: this.state.title,
			content: this.state.content,
			loading: this.state.loading,
			token: this.state.token,
			path: this.state.path,
			dispatch: dispatch,
		};
		const tableProps = {
			fileDetail: this.state.fileDetail,
			uploadData: this.state.values,
			date: this.state.date,
			dispatch: dispatch,
			path: this.state.path,
			file: this.state.file,
		};
		return (
			<div className={styles.upload}>
				<Table pagination={false} columns={this.state.columns} dataSource={this.state.dataSource}
							 rowKey={(record, index) => {
								 return index;
							 }}/>
				<div className="fltr">
					{
						this.state.total > 0 ?
							<Pagination onChange={this.pageChange}
													className="mgt8"
													total={this.state.total}
													showTotal={total => `总共 ${total} 条，${this.state.pageSize}条/页 `}
													pageSize={this.state.pageSize}
													current={ this.state.current }/>
							: ''
					}
				</div>
				<div className="textCenter">
					<Button type="primary" className='mgt8' onClick={this.showModal}>添加文件</Button>
					<ModalPage {...props}
										 handleCancel={this.handleCancel}
										 handleOk={this.handleOk}
										 getQINIUtoken={this.getQINIUToken}/>
				</div>
				{
					this.state.checkDetail === true ? <CheckDetail {...tableProps}/> : ''
				}
			</div>
		)
	}
}
function mapStateToProps({ upload }) {
	return { upload }
}
export default connect(mapStateToProps)(Upload);
