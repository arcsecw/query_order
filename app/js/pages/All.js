import React from 'react';
import {
  Container,
  Input,
  FormGroup,
  ButtonToolbar,
  Tabs,
  Item,
} from 'amazeui-react';
import { myConfig } from '../components/config.js';
import Message from './Message'
import Index from './Index'
import Test from './Test'
import Login from './Login'
import Logout from './Logout'
class All extends React.Component {
  render() {
    var team_id = this.props.location.query.team
    switch(team_id){
    case '2':
        return <Message/>
    case '10':
        return <Test/>
    case '11':
        return <Login/>
    case '12':
        return <Logout/>
    default:
        return <Login/>
    }
  }
}

export default All;
