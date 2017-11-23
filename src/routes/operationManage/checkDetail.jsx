import React, { Component } from 'react';
import { connect } from 'dva';
import {
	Form,
	Table,
	Modal,
	DatePicker,
	Select,
} from 'antd';
import styles from './upload.less';
import aoaoBossTools from './../../utils/util';
const [FormItem,Option] = [Form.Item, Select.Option];
const { RangePicker } = DatePicker;


class CheckDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: true, // 弹框状态
			title: '',			// 弹窗标题
			columns: [{
				title: '团队ID',
				dataIndex: 'team_id',
				key: 'team_id',
			}, {
				title: 'KPI得分(分)',
				dataIndex: 'kpi_score',
				key: 'kpi_score',
			}, {
				title: '同城排名',
				dataIndex: 'order_price',
				key: 'order_price',
				render: (text, record) => {
					return <span>{record.rank_total == 0 ? '--' : `${record.rank}/${record.rank_total}`}</span>
				}
			}],
			dataSource: props.fileDetail.data,
			uploadData: props.uploadData,
			targetId: props.path,
			date: props.date,
			file: props.file,
		}
	};

	// 接受父级的 ModalInfo 信息对弹窗架子填充
	componentWillReceiveProps = (nextProps) => {
		this.setState({
			dataSource: nextProps.fileDetail.data,
			uploadData: nextProps.uploadData,
			targetId: nextProps.path,
			date: nextProps.date,
			file: nextProps.file,
		})
	};

	// 弹窗确认事件
	handleOk = (e) => {
		e.preventDefault();
		this.setState({
			visible: false,
		});
		const { dispatch } =this.props;
		const values = this.state.uploadData;

		// 1.0.1版前  确认上传文件需要之前所有的数据，目前只需要关联对象与时间
		delete values.team_id_line; // 删除团队列数数据
		delete values.kpi_score_line; // 删除得分数据
		delete values.city_line;	// 删除城市列数数据

		values.filename = this.state.file.file.name;
		values.start_date = aoaoBossTools.prctoMinute(this.state.date[0]._d, 0);
		values.end_date = aoaoBossTools.prctoMinute(this.state.date[1]._d, 0);
		values.target_id = this.state.targetId;
		dispatch({
			type: 'upload/postCheckFileDetailE',
			payload: values,
		});
	};

	// 弹窗取消事件
	handleCancel = (e) => {
		document.querySelector('#showUploadFile').innerHTML = ``;
		document.getElementsByClassName('ant-modal-footer')[0].style.opacity = 1;
		this.setState({
			visible: false,
		});
		const { dispatch } = this.props;
		dispatch({
			type: 'upload/postCheckFileDetailR',
			payload: {
				ok: '',
				data: [],
			}
		})
	};


	render() {

		return (
			<div className={styles.upload}>
				<Modal title={<div>
					<p>蜂鸟配送站点KPI及奖罚结果</p>
					<div>{`(${this.state.date[0]._d && aoaoBossTools.prctoMinute(this.state.date[0]._d, 0)}~${this.state.date[1]._d && aoaoBossTools.prctoMinute(this.state.date[1]._d, 0)})`}</div>
				</div>} visible={this.state.visible}
							 onOk={this.handleOk} onCancel={this.handleCancel}
							 okText="确定上传" cancelText="取消"
							 style={{ top: "35%", overflow: 'auto', textAlign: 'center' }}
							 className={`checkDetail`}
				>
					<Table columns={this.state.columns} dataSource={this.state.dataSource} rowKey={(record, index) => {
						return index;
					}}/>
					{this.state.dataSource.length > 0 ? <span>（以上数据如与实际有出入，请与产品联系）</span> : ''}
				</Modal>
			</div>
		);
	}
}

CheckDetail = Form.create()(CheckDetail);
export default connect()(CheckDetail);
