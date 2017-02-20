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
import {get_token} from '../components/Call'
import {post} from '../components/Call'
import {get} from '../components/Call'
import {get_userinfo} from '../components/Call'

class Test extends React.Component {
  render() {
        console.log(get_token('top','top',(re)=>{
            
        }))
        return (
          <div>
          <h1>测试页面</h1>
          </div>
    );
  }
}
export default Test