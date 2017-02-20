import React from 'react';
import {
  Container,
  Input,
  ButtonToolbar,
  Tabs,
  Item,
  Icon,
  Table,
} from 'amazeui-react';
import { myConfig } from '../components/config.js';
import { get_token } from '../components/Call';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router'

var Login =withRouter( React.createClass({
  getInitialState(){
        return {   
            username:'',
            password:'',
        }
  },       
  handle_submit(e){
      e.preventDefault();
      get_token(this.state.username,this.state.password,(re)=>{
          if(localStorage.refresh_token!=undefined)  {
            this.props.router.replace('/run?team=1')
          }      
      })
      

  },
  render() {
       var iconUser = <Icon icon="user" />;
        return (
       <Container className="am-padding-vertical-lg">
       
        <h2>用户登录</h2>      
        <form className="am-form" id = 'myform'>
                <Input type="text" addonBefore={iconUser} addonAfter='必填' label="用户名"  onChange = {(e)=>{this.setState({"username":e.target.value})}} />
                <Input type="password" addonBefore={iconUser} addonAfter='必填' label="用户名"  onChange = {(e)=>{this.setState({"password":e.target.value})}} />
                <ButtonToolbar>
                    <Input  type = "submit" value="提交" standalone onClick={this.handle_submit} />
                    <Input type="reset" value="重置" amStyle="danger" standalone />
                </ButtonToolbar>
        </form>
      </Container>
    )
  }
}))
export default Login