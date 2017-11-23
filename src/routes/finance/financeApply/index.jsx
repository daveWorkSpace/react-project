import React from 'react';
import { Link } from 'react-router';
import { connect } from 'dva';
import { Form, Row, Col, Select, Button, Input, DatePicker, Badge, Pagination } from 'antd';
import Table from './../../../components/table';
import aoaoBossTools from './../../../utils/util';
import Permission from './../../role/role';
import moment from 'moment';
const { MonthPicker, RangePicker } = DatePicker;
const [FormItem,Option] = [Form.Item, Select.Option];

class IndexPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      // total: props.finance.distributeLogList._meta.result_count || 0,
      total : 1,
      cityList: [],
      page: 1,                          // 默认页码
      current: 1,                       // 默认的高亮页码
      pageSize: 30,
      searchValue: {},
      columns: [{
        title: '单号',
        dataIndex: '_id',
        key: '_id',
      }, {
        title: '申请类型',
        dataIndex: 'apply_type',
        key: 'apply_type',
      }, {
        title: '申请日期',
        dataIndex: 'apply_date',
        key: 'apply_date',
        // render: (text) => {
        //   return (<span>
        //     {aoaoBossTools.enumerationConversion(text)}
        //   </span>)
        // }
      }, {
        title: '申请城市',
        dataIndex: 'apply_city',
        key: 'apply_city',
      }, {
        title: '申请金额 (元)',
        dataIndex: 'apply_money',
        key: 'apply_money',
        // render: (text) => {
        //   return (<span>
        //     {aoaoBossTools.prctoMinute(text, 3)}
        //   </span>)
        // }
      }, {
        title: '状态',
        dataIndex: 'apply_state',
        key: 'apply_state',
        // render: (text, record) => {
        //   let status = 'success';
        //   const success = [9002, 9005, 9008, 9014, 9011];
        //   const error = [9003, 9006, 9009, 9015];
        //   const warning = [9002, 9005, 9008, 9014];
        //   if (success.indexOf(text) != -1) {
        //     status = 'success';
        //   } else if (error.indexOf(text) != -1) {
        //     status = 'error';
        //   } else {
        //     status = 'warning';
        //   }
        //   return (<span>
        //       <Badge status={status} text={aoaoBossTools.enumerationConversion(text)}/>
        //   </span>)
        // }
      }, {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => {
          return (
            <span>
              <span><Link to={`Finance/FinanceApply/Detail?id=${record._id}`}
                          className="mgl8 systemTextColor pointer">详情</Link>
              </span>
              <span>
                <span><Link to={`Finance/FinanceApply/Relet?id=${record._id}`}
                            className="mgl8 systemTextColor pointer">续租</Link>
                </span>
                <span><Link to={`Finance/FinanceApply/Break?id=${record._id}`}
                            className="mgl8 systemTextColor pointer">续租</Link>
                </span>            
              </span>
            </span>
          )
        }
      }],
      dataSource: props.finance.data || [],
    }
  }

  /*
  注意点 ： 
  1、申请日期必须比当前日要要大
  */

  // 页面初始化，加载数据
  componentDidMount(){
    console.log(this.props.finance.data);
  }

  // componentWillReceiveProps(props){
  //   console.log(this.props.finance);
  //   this.setState({
  //     dataSource : props.data
  //   })
  // }

  // 点击分页条
  pageChange(){

  }

  render(){
    
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    return (<div className="mgt8">
      <Form>
        <Row>
          <Col sm={6}>
            <FormItem {...formItemLayout} label={`单号`}>
              {getFieldDecorator(`order_id`, {
                rules: [{ required: false, message: '请输入单号', trigger: 'onBlur', type: 'string' }],
              })(
                <Input placeholder="请输入单号"/>
              )}
            </FormItem>
          </Col>
          <Col sm={6}>
            <FormItem label='申请类型' {...formItemLayout}>
              {getFieldDecorator('apply_type', {
                rules: [{
                  type: 'string', message: '请选择申请类型',
                }, {
                  required: false, message: '请选择申请类型',
                }],
              })(
                <Select placeholder="请选择需要查询的状态">
                  <Option value={`9010`}>全部</Option>
                  <Option value={`9011`}>新租申请</Option>
                  <Option value={`9013`}>续租申请</Option>
                  <Option value={`9014`}>断租申请</Option>
                  <Option value={`9015`}>差旅报销</Option>
                  <Option value={`9016`}>团建|招待</Option>
                  <Option value={`9017`}>收购款</Option>
                  <Option value={`9018`}>盖章罚款</Option>
                  <Option value={`9019`}>其他</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={10}>
            <FormItem label='申请日期' {...formItemLayout}>
              {getFieldDecorator('apply_date', {
                rules: [{
                  type: 'object', message: '请输入申请日期',
                }, {
                  required: false, message: '请输入申请日期',
                }],
              })(
                <DatePicker format={'YYYY-MM-DD'}/>
              )}
            </FormItem>
          </Col>
          <Col sm={6}>
            <FormItem label='申请城市' {...formItemLayout}>
              {getFieldDecorator('apply_city', {
                rules: [{
                  type: 'string', message: '请选择申请城市',
                }, {
                  required: false, message: '请选择申请城市',
                }],
              })(
                <Select placeholder="请选择城市">
                  <Option value={`9010`}>北京_饿了么</Option>
                  <Option value={`9011`}>北京_百度</Option>
                  <Option value={`9013`}>上海_饿了么</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={6}>
            <FormItem label='申请状态' {...formItemLayout}>
              {getFieldDecorator('apply_state', {
                rules: [{
                  type: 'string', message: '请选择申请状态',
                }, {
                  required: false, message: '请选择申请状态',
                }],
              })(
                <Select placeholder="请选择申请状态">
                  <Option value={`9010`}>待审核</Option>
                  <Option value={`9011`}>通过</Option>
                  <Option value={`9013`}>不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col sm={6}>
            <Col sm={5}/>
            <Button type="primary" className={`mgr8`} onClick={this.handleSearch}>搜索</Button>
          </Col>
        </Row>
      </Form>

      <Table columns={this.state.columns} dataSource={this.state.dataSource}/>

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

    </div>)
  }
}

function mapStateToProps({finance}) {
  return {finance};
}
export default connect(mapStateToProps)(Form.create()(IndexPage));



