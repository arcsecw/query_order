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
        <td>{new Date(event._created).toLocaleDateString()}</td>
        <td>{new Date(event._updated).toLocaleDateString()}</td>
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
        console.log(get_userinfo())
          get('orders',{where:`{"send_status":"2","add_by":"${get_userinfo()}"}`},(re)=>{
            this.setState({"order_not_sent":re._items})
          })
    },
    componentWillMount(){
      this.update_source()
    },
    del_sended(){
      get('del_sended','',(re)=>{
        this.update_source()
      })
    },
    render() {
        return (
                <Container>
                <ButtonToolbar>
                    <Input  type = "submit" value="删除全部" standalone onClick={this.del_sended} />
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
        console.log(get_userinfo())
          get('orders',{where:`{"send_status":"1","add_by":"${get_userinfo()}"}`},(re)=>{
            this.setState({"order_not_sent":re._items})
          })
    },
    componentWillMount(){
      this.update_source()
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
        console.log(get_userinfo())
          get('orders',{where:`{"send_status":"0","add_by":"${get_userinfo()}"}`},(re)=>{
            this.setState({"order_not_sent":re._items})
          })
    },
    componentWillMount(){
      this.update_source()
    },
    add_order_from_dict(arr){
      var s = JSON.stringify(arr)
        
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
  do_it(){
    get('do_it','',(re)=>{
      this.update_source()      
    })
  },
  remove_all(){
    get('del_all','',(re)=>{
      this.update_source()
    })
  },
    handle_submit(e){
        e.preventDefault();
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
                <Input type="file" label="订单文件" id = "my_file"/>
                <ButtonToolbar>
                    <Input  type = "submit" value="提交" standalone onClick={this.handle_submit} />
                    <Input type="submit" value="执行" amStyle="danger" standalone onClick={this.do_it}/>
                    <Input type="submit" value="删除全部" amStyle="danger" standalone onClick={this.remove_all}/>
                </ButtonToolbar>
                </form>
                <br/>
                <EventsTable events={this.state.order_not_sent} responsive bordered /> 
                </Container>
        )
    }
})

class Message extends React.Component {
  render() {
        return (
       <Container className="am-padding-vertical-lg">
       
        <h2>{myConfig.pages[1].des}</h2>      
        <Tabs animation = 'slide'>
            <Tabs.Item eventKey="1" title="待发送">
                    <Task1  title="待发送"/>         
            </Tabs.Item>
            <Tabs.Item eventKey="2" title="队列中">
                    <Task2  title="队列中"/>        
                    
            </Tabs.Item>
            <Tabs.Item eventKey="3" title="已发送">
                    <Task3  title="已发送"/>        
            </Tabs.Item>

            
        </Tabs>
      </Container>
    );
  }
}
export default Message