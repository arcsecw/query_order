import React from 'react';
import {
  Link,
} from 'react-router';

class RouteLink extends React.Component {
  render() {
    const isActive = this.context.router.isActive(this.props.to,this.props.query);
    const activeClassName = isActive ? 'am-active' : '';
    const link = (
      <Link {...this.props} />
    );

    return (
      <li className={activeClassName}>
        {link}
      </li>
    );
  }
}

RouteLink.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default RouteLink;
