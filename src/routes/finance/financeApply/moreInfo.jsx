import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
import React from 'react';

class MoreInfo extends React.Component {
    constructor({handleCancel}){
      super();
      this.state = {
        handleCancel,
        visible : false
      }
    }

  handleSubmit(e){
    var self = this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        // 这里使用ajax发送登录请求，如果登录成功，在回调函数中修改全局数据
        self.props.handleCancel();
      }
    });
  }

  textInput(){
    this.setState({"visible":false});
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const{ visible } = this.state;
    var result = visible ? "block" : "none";
    return (
      <div style={{position:'relative'}}>
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <FormItem label={`费用金额`} {...formItemLayout}>
          {getFieldDecorator('amount', {
            rules: [{ required: false, message: '请输入金额!' }],
          })(
            <Input placeholder="请输入金额" onChange={this.textInput.bind(this)}/>
          )}
        </FormItem>
        <FormItem label={`收款人`} {...formItemLayout}>
          {getFieldDecorator('receiver', {
            rules: [{ required: false, message: '请输入收款人!' }],
          })(
            <Input placeholder="请输入姓名" onChange={this.textInput.bind(this)}/>
          )}
        </FormItem>
        <FormItem label="收款账户" {...formItemLayout}>
          {getFieldDecorator('receiverAccount', {
            rules: [{ required: false, message: '请输入收款人账户!' }],
          })(
            <Input placeholder="请输入收款人账户" onChange={this.textInput.bind(this)}/>
          )}
        </FormItem>
        <FormItem label="开户支行" {...formItemLayout}>
          {getFieldDecorator('receiverAccount', {
            rules: [{ required: false, message: '请输入全称!' }],
          })(
            <Input placeholder="请输入全称" onChange={this.textInput.bind(this)}/>
          )}
        </FormItem>
      </Form>
      </div>
    );
  }
}

const OtherInfo = Form.create()(MoreInfo);

export default OtherInfo;
