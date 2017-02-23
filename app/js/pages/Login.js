import React from 'react';
import {
  Container,
  Input,
  ButtonToolbar,
  Tabs,
  Item,
  Icon,
  Table,
  Panel,
  Col,
  Grid,
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
            this.props.router.replace('/run?team=2')
          }      
      })
      

  },
  render() {
       var iconUser = <Icon icon="user" />;
       var iconPassword = <Icon icon="lock" />;
        return (
    
          
       <Container className="am-padding-vertical-lg">
        <h1>&nbsp;</h1>
       <Grid className="doc-g">
      <Col sm={7}>&nbsp;</Col>
      <Col sm={5}>
      <Panel header="用户登录" amStyle="warning">
        <form className="am-form" id = 'myform'>
                <Input type="text" addonBefore={iconUser}  label="用户名"  onChange = {(e)=>{this.setState({"username":e.target.value})}} />
                <Input type="password" addonBefore={iconPassword} label="密码"  onChange = {(e)=>{this.setState({"password":e.target.value})}} />
                <Grid className="doc-g">
                <Col sm={8}>&nbsp;</Col>
                <ButtonToolbar>
                    <Input  type = "submit" value="登录系统" standalone onClick={this.handle_submit} />
                </ButtonToolbar>
                </Grid>
                
        </form>
       </Panel>    
      </Col>
    </Grid>
        
        
      </Container>
    )
  }
}))
export default Login