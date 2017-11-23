/**
 * Created by dave 2017/4/26
 * */
import React from 'react';
import aoaoBossTools from './../../utils/util';
import { Row, Col, Tooltip, Icon } from 'antd';
const columns = {

	// 业务量查询按照数据查询
	businessDataColumns: [{
		title: '时间',
		dataIndex: 'date',
		key: 'date',
	}, {
		title: '平台',
		dataIndex: 'platform_name',
		key: 'platform_name',
	}, {
		title: '城市',
		dataIndex: 'city_name',
		key: 'city_name',
	}, {
		title: '商圈',
		dataIndex: 'biz_district_name',
		key: 'biz_district_name',
	}, {
		title: '商圈类型',
		dataIndex: 'biz_district_type_id',
		key: 'biz_district_type_id',
		render: (text, record) => {
			return (
				<span>{text == 1 ? '自营' : '外包'}</span>
			)
		}
	}, {
		title: 'kpi得分',
		dataIndex: 'kpi_score',
		key: 'kpi_score',
		render: (text, record) => {
			return (
				<span>{text.toFixed(2)}</span>
			)
		}
	}, {
		title: '同城排名',
		dataIndex: 'rank',
		key: 'rank',
		render: (text, record) => {
			return (
				<span>{record.rank_total == 0 ? '--' : `${record.rank}/${record.rank_total}`}</span>
			)
		}
	}, {
		title: '单量（单）',
		dataIndex: 'valid_order_count',
		key: 'valid_order_count',
	}, {
		title: '出勤人数（人）',
		dataIndex: 'attendance_number',
		key: 'attendance_number',
	}, {
		title: '人效（单／人）',
		dataIndex: 'efficiency',
		key: 'efficiency',
		render: (text, record) => {
			return (
				<span>{text.toFixed(2)}</span>
			)
		}
	}],

	// 业务量 按照城市查询
	businessCityColumns: [{
		title: '时间',
		dataIndex: 'date',
		key: 'date',
	}, {
		title: '平台',
		dataIndex: 'platform_name',
		key: 'platform_name',
	}, {
		title: '城市',
		dataIndex: 'city_name',
		key: 'city_name',
	}, {
		title: '代理商名称',
		dataIndex: 'org_name',
		key: 'org_name',
	}, {
		title: 'kpi得分',
		dataIndex: 'kpi_score',
		key: 'kpi_score',
		render: (text, record) => {
			return (
				<span>{text.toFixed(2)}</span>
			)
		}
	}, {
		title: '单量（单）',
		dataIndex: 'valid_order_count',
		key: 'valid_order_count',
	}, {
		title: '出勤人数（人）',
		dataIndex: 'attendance_number',
		key: 'attendance_number',
	}, {
		title: '人效（单／人）',
		dataIndex: 'efficiency',
		key: 'efficiency',
		render: (text, record) => {
			return (
				<span>{text.toFixed(2)}</span>
			)
		}
	}],

	// 收支按照数据查询的表头
	balanceDataColumns: [{
		title: '时间',
		dataIndex: 'date',
		key: 'date',
	}, {
		title: '平台',
		dataIndex: 'platform_name',
		key: 'platform_name',
	}, {
		title: '城市',
		dataIndex: 'city_name',
		key: 'city_name',
	}, {
		title: '商圈',
		dataIndex: 'biz_district_name',
		key: 'biz_district_name',
	}, {
		title: '基础配送费（元）',
		dataIndex: 'delivery_income',
		key: 'delivery_income',
		render: (text) => {
			return (
				<span>{aoaoBossTools.ToFixed(text, 2)}</span>
			)
		}
	}, /*{
	 title: 'KPI得分 （分）',
	 dataIndex: 'kpi_score',
	 key: 'kpi_score',
	 render: (text) => {
	 return (
	 <span>{aoaoBossTools.ToFixed(text, 2)}</span>
	 )
	 }
	 }, {
	 title: 'KPI收入（元）',
	 dataIndex: 'kpi_income',
	 key: 'kpi_income',
	 render: (text) => {
	 return (
	 <span>{aoaoBossTools.ToFixed(text, 2)}</span>
	 )
	 }
	 },*/ {
		title: <div>总收入
			<Tooltip title={
				<div>
					<p><b>总收入：</b></p>
					<p style={{ fontWeight: 100, width: 170 }}>
						总收入为基础配送费和扣罚的合计，不包含手工账单
					</p>
				</div>}>
				<span>&nbsp;&nbsp;<Icon type="question-circle-o"/></span>
			</Tooltip>
		</div>,
		dataIndex: 'total_income',
		key: 'total_income',
		render: (text) => {
			return (
				<span>{aoaoBossTools.ToFixed(text, 2)}</span>
			)
		}
	}, {
		title: '扣罚（元）',
		dataIndex: 'punish',
		key: 'punish',
		render: (text) => {
			return (
				<span>{aoaoBossTools.ToFixed(text, 2)}</span>
			)
		}
	}],

	// 收支按照城市查询的表头
	balanceCityColumns: [{
		title: '时间',
		dataIndex: 'date',
		key: 'date',
	}, {
		title: '平台',
		dataIndex: 'platform_name',
		key: 'platform_name',
	}, {
		title: '城市',
		dataIndex: 'city_name',
		key: 'city_name',
	}, {
		title: '代理商名称',
		dataIndex: 'org_name',
		key: 'org_name',
	}, {
		title: '基础配送费（元）',
		dataIndex: 'delivery_income',
		key: 'delivery_income',
		render: (text) => {
			return (
				<span>{aoaoBossTools.ToFixed(text, 2)}</span>
			)
		}
	}, {
		title: '总收入（元）',
		dataIndex: 'total_income',
		key: 'total_income',
		render: (text) => {
			return (
				<span>{aoaoBossTools.ToFixed(text, 2)}</span>
			)
		}
	}, {
		title: '扣罚（元）',
		dataIndex: 'punish',
		key: 'punish',
		render: (text) => {
			return (
				<span>{aoaoBossTools.ToFixed(text, 2)}</span>
			)
		}
	}],
};

export default columns;
