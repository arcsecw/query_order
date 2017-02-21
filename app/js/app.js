import React, { Component } from 'react';
import {
  render,
} from 'react-dom';
import {
  Router,
  Route,
  IndexRoute,
  hashHistory,
} from 'react-router';
//解决fetch的兼容性
import 'whatwg-fetch'
import {
  Topbar,
  Nav,
  Link,
  Icon,
  NavItem,
  CollapsibleNav,
} from 'amazeui-react';

import RouteLink from './components/RouteLink';
import SiteFooter from './components/SiteFooter';
import { myConfig } from './components/config.js';

class App extends Component {
  
  render() {
    var routeLinks = (
    myConfig.pages.map((page)=>{
        return (<RouteLink to="run" query = {{team:page.teamid}}>{page.des}</RouteLink>)
    })
    )
    return (
      <div className="ask-page">
        <Topbar
          className="ask-header"
          brand={myConfig.brand}
          inverse
          toggleNavKey="nav"
        >
          <CollapsibleNav>
            <Nav topbar>
            {routeLinks}
            {localStorage.refresh_token !=undefined ?(
              <RouteLink to = '/logout'>退出</RouteLink>
            ) :(
            <RouteLink to = '/login'>登录</RouteLink> )             
            }
            </Nav>
            
          </CollapsibleNav>
        </Topbar>
        <main className="ask-main">
          {this.props.children}
        </main>
        <SiteFooter />
      </div>
    );
  }
}

// Pages
import Index from './pages/Index';
import All from './pages/All'
import Login from './pages/Login'
import Logout from './pages/Logout'
function requireAuth(nextState, replace) {
  console.log(localStorage)
  if (localStorage.refresh_token==undefined){
    console.log("您无权访问本页面")
      replace({
      pathname:'/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
  
}
const routes = (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Login} />
      <Route path = '/run' component = {All} onEnter={requireAuth}/>
      <Route path = '/login' component = {Login}/>
      <Route path = '/logout' component = {Logout}/>
    </Route>
  </Router>
);

document.addEventListener('DOMContentLoaded', () => {
  render(routes, document.getElementById('root'));
});
