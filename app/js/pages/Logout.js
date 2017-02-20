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
import { logout } from '../components/Call';
import { browserHistory, Router, Route, Link, withRouter } from 'react-router'

var Logout =withRouter( React.createClass({

  render() {
        logout()
       this.props.router.replace('/login')
       return(<div/>)
  }
}))
export default Logout