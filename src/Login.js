import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { func, object } from 'prop-types';
import './Login.css';

class Login extends Component {
  static propTypes = {
    data: object.isRequired,
    history: object.isRequired,
    signinUser: func.isRequired
  };

  state = {
    email: '',
    password: ''
  };

  signinUser = () => {
    const { email, password } = this.state;

    this.props
      .signinUser({ variables: { email, password } })
      .then(response => {
        window.localStorage.setItem(
          'graphcoolToken',
          response.data.signinUser.token
        );
        this.props.history.replace('/');
      })
      .catch(e => {
        console.error(e);
        this.props.history.replace('/');
      });
  };

  render() {
    if (this.props.data.loading) {
      return <div>Loading...</div>;
    }

    if (this.props.data.user) {
      this.props.history.replace('/');
    }

    return (
      <div className="Login">
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter email"
            onChange={e => this.setState({ email: e.target.value })}
          />
          <br />
          <input
            type="password"
            placeholder="Enter password"
            onChange={e => this.setState({ password: e.target.value })}
          />
          <br />
          <br />
          <button className="btn-link" onClick={this.signinUser}>
            Sign in
          </button>
        </div>
      </div>
    );
  }
}

const signinUser = gql`
  mutation($email: String!, $password: String!) {
    signinUser(email: { email: $email, password: $password }) {
      token
    }
  }
`;

const userQuery = gql`
  query {
    user {
      id
    }
  }
`;

export default graphql(signinUser, { name: 'signinUser' })(
  graphql(userQuery, { options: { fetchPolicy: 'network-only' } })(
    withRouter(Login)
  )
);
