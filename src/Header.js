import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
class Header extends Component {
  signin = () => {
    this.props.history.push('/login');
  };

  logout = () => {
    window.localStorage.removeItem('graphcoolToken');
    window.location.reload();
  };
  render() {
    console.log(this.props.data);
    return (
      <div className="Header">
        {this.props.data.user && this.props.data.user.email}
        {!this.props.data.user &&
          <button className="btn-link" onClick={this.signin}>
            sign in
          </button>}
        {this.props.data.user &&
          <button className="btn-link" onClick={this.logout}>
            logout
          </button>}
      </div>
    );
  }
}

const userQuery = gql`
  query {
    user {
      id
      email
    }
  }
`;

export default graphql(userQuery, { options: { fetchPolicy: 'network-only' } })(
  withRouter(Header)
);
