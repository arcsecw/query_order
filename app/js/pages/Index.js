import React from 'react';
import {
  Container,
  Input,
  ButtonToolbar,
  Tabs,
  Item,
  Table,
} from 'amazeui-react';
import { myConfig } from '../components/config.js';
import {m_post} from '../components/Call'

var EventRow = React.createClass({
  render: function() {
    var event = this.props.event;
    var className = event.highlight ? 'am-active' :
      event.disabled ? 'am-disabled' : '';

    return (
      <tr className={className}>
        <td>{event.name}</td>
        <td>{event.phone_num}</td>
        <td>{event.no}</td>
      </tr>
    );
  }
});

var EventsTable = React.createClass({
  render: function() {
    var restProps = Object.assign({}, this.props);
    delete restProps.events;

    return (
      <Table {...restProps}>
        <thead>
          <tr>
            <th>姓名</th>
            <th>手机号</th>
            <th>订单号</th>
          </tr>
        </thead>
        <tbody>
          {this.props.events.map(function(event) {
            return (<EventRow key={event.no} event={event} />);
          })}
        </tbody>
      </Table>
    );
  }
});

var Task1  =  React.createClass( {
    getInitialState(){
        return {
                parms:{
                phone_num:'',
                },
                form_data:{},
                showModal: false,
                tre:[]
            }
  },
   close() {
    this.setState({showModal: false,form_data:{}});
  },
  open() {
    this.setState({showModal: true});
  },
  is_good(str){
      if(str==undefined){
          return 'error'
      }      
      if(str.length>0){
          return 'success'
      }
      return 'error'
  },

    handle_submit(e){
        e.preventDefault();
        var form1 = new FormData()
        for(let k in this.state.parms){
            form1.append(k,this.state.parms[k])
        }
        m_post('/',form1,(re)=>{
          console.log(re)
          re = re['r']
          var tre = []
          if(re=='your input format error'||re==''){
            alert('输入有误或者没有查询到该用户信息')
          }else{
          for (var i in re){
            tre.push({'name':re[i][0],'phone_num':re[i][1],'no':re[i][2]})
          }
          this.setState({'tre':tre})
        }})
    },
    render() {
        return (
                <Container>
                <form className="am-form" id = 'myform'>
                <Input type="text" label="手机号码"  placeholder={this.state.parms['phone_num']} onChange = {(e)=>{this.state.parms['phone_num']=e.target.value}}  />
                <ButtonToolbar>
                    <Input  type = "submit" value="提交" standalone onClick={this.handle_submit} />
                    <Input type="reset" value="重置" amStyle="danger" standalone />
                </ButtonToolbar>
                </form>
                <br/>
                <EventsTable events={this.state.tre} responsive bordered /> 
                </Container>
        )
    }
})

class Index extends React.Component {
  render() {
        return (
       <Container className="am-padding-vertical-lg">
       
        <h2>{myConfig.pages[2].des}</h2>      
        <Tabs animation = 'slide'>
            <Tabs.Item eventKey="1" title="订单查询">
                    <Task1  title="查询工具"/>        
            </Tabs.Item>
            
        </Tabs>
      </Container>
    );
  }
}
export default Index