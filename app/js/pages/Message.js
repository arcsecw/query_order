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
import {post,get,get_userinfo,post_json} from '../components/Call'
var EventRow = React.createClass({
  timestring(a){
    var a = new Date(a)
    return a.toLocaleDateString()+'-'+a.getHours()+':'+a.getMinutes()
  },
  render: function() {
    
    var event = this.props.event;
    var className = event.highlight ? 'am-active' :
      event.disabled ? 'am-disabled' : '';
    return (
      <tr className={className}>
        <td>{event.name}</td>
        <td>{event.phone}</td>
        <td>{event.order_nb}</td>
        <td>{event.kuaidi}</td>
        <td>{event.group_name}</td>
        <td>{event.add_by}</td>        
        <td>{this.timestring(event._created)}</td>
        <td>{this.timestring(event._updated)}</td>
        <td>{event.message}</td>        
        
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
            <th>快递方</th>
            <th>分组</th>
            <th>添加人</th>
            <th>创建时间</th>
            <th>修改时间</th>
            <th>信息</th>
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
var Task3  =  React.createClass( {
    getInitialState(){
      
        return {
              "order_not_sent":[
                
              ]  
            }
    },
    update_source(){
        var a = get_userinfo()
        var a = new Date()
        a.setDate(a.getDate()-7)
        a = a.toGMTString()
          get('orders',{where:`{"send_status":"2","add_by":"${get_userinfo()}","_created":{"$gte":"${a}"}}`},(re)=>{
            this.setState({"order_not_sent":re._items})
          })
    },
    componentDidMount(){
      this.update_source()
    },
    componentWillReceiveProps(nextProps, nextState){
      try{
        var a = this.props.query
        var b = this.props.query
      if( a? b:!b){
        this.update_source()
      }
      }
      catch(E){
      } 
    },
    del_sended(e){
      e.preventDefault();
      get('del_sended','',(re)=>{
        this.update_source()
      })
    },
    render() {
        return (
                <Container>
                <ButtonToolbar>
                    <Input  type = "submit" value="删除下面通知过的订单" standalone onClick={this.del_sended} />
                </ButtonToolbar>
                <br/>
                <EventsTable events={this.state.order_not_sent} responsive bordered /> 
                </Container>
        )
    }
})
var Task2  =  React.createClass( {
    getInitialState(){
      
        return {
              "order_not_sent":[
                
              ]  
            }
    },
    update_source(){
        var a = get_userinfo()
        
          get('orders',{where:`{"send_status":"1","add_by":"${get_userinfo()}"}`},(re)=>{
            this.setState({"order_not_sent":re._items})
          })
    },
    componentDidMount(){
      this.update_source()
    },
    componentWillReceiveProps(nextProps, nextState){
      try{
        var a = this.props.query
        var b = this.props.query
      if( a? b:!b){
        this.update_source()
      }
      }
      catch(E){
      } 
    },
    render() {
        return (
                <Container>
                <br/>
                <EventsTable events={this.state.order_not_sent} responsive bordered /> 
                </Container>
        )
    }
})


var Task1  =  React.createClass( {
    getInitialState(){
        return {
              "order_not_sent":[
                
              ]  
            }
    },
    update_source(){
        var a = get_userinfo()
       
          get('orders',{where:`{"send_status":"0","add_by":"${get_userinfo()}"}`},(re)=>{
            this.setState({"order_not_sent":re._items})
          })
    },
    componentDidMount(){
        this.update_source()
      
    },
    componentWillReceiveProps(nextProps, nextState){
      try{
        var a = this.props.query
        var b = this.props.query
      if( a? b:!b){
        this.update_source()
      }
      }
      catch(E){
      } 
    },
    get_info_from_file(ele,cb){
      var to_dict = function(workbook,name) {
        var result = [];
        workbook.SheetNames.forEach(function(sheetName) {
          var json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          result.push(json)
        });
        return {filename:name,result:result}
      }
      var f = ele.files[0]
      var reader = new FileReader();
      var res = ''
      reader.onload = function(e){
            var data = e.target.result;
            var wb
            wb = XLSX.read(data, {type : 'binary'});
            cb(to_dict(wb,f.name)) 
        };
        reader.readAsBinaryString(f);

  },
  do_it(e){
    e.preventDefault();
    get('do_it','',(re)=>{
      this.update_source()      
    })
  },
  remove_all(e){
    e.preventDefault();
    get('del_all','',(re)=>{
      this.update_source()
    })
  },
    handle_change(e){
      e.preventDefault()
        if(document.getElementById("my_file").files.length==0){
          return
        }
        var arr = this.get_info_from_file(document.getElementById("my_file"),(re)=>{
            var tre = []
            var result = re.result[0]
            console.log(result)
            result.map((line)=>{
              console.log(line)
                var order = line
                order.group_name = re.filename
                order.add_by = get_userinfo()
                order.send_status = '0'
                order.message = '初次提交'
                tre.push(order)
            })
            post_json('orders',JSON.stringify(tre),(r)=>{
              this.update_source()
              document.getElementById('myform').reset()
            })
        })
    },
    render() {
        return (
                <Container>
                <form className="am-form" id = 'myform'>
                <Input type="file" label="订单excel文件" id = "my_file" onChange={this.handle_change}/>
                <ButtonToolbar>
                    <Input type="submit" value="发送短信" amStyle="danger" standalone onClick={this.do_it}/>
                    <Input type="submit" value="删除下面的订单" amStyle="danger" standalone onClick={this.remove_all}/>
                </ButtonToolbar>
                </form>
                <br/>
                <EventsTable events={this.state.order_not_sent} responsive bordered /> 
                </Container>
        )
    }
})

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      change: false,
    };
  }
  
  render() {
        return (
       <Container className="am-padding-vertical-lg">
       
        <h2>{myConfig.pages[1].des}</h2>      
        <Tabs animation = 'slide' onSelect = {()=>{this.setState({change:!this.state.change})}}>
            <Tabs.Item eventKey="1" title="待通知订单" >
                    <Task1  title="待通知订单" query = {this.state.change}/>         
            </Tabs.Item>
            
            <Tabs.Item eventKey="3" title="发送成功的订单">
                    <Task3  title="发送成功的订单" query = {this.state.change}/>        
            </Tabs.Item>

            
        </Tabs>
      </Container>
    );
  }
}
export default Message