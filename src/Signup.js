import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import './Login.css';
class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: ''
  };

  createUser = () => {
    const { email, password, name } = this.state;

    this.props
      .createUser({ variables: { email, password, name } })
      .then(response => {
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
            this.props.router.replace('/');
          });
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
      this.props.router.replace('/');
    }

    return (
      <div className="Signup">
        <h1>## Signup</h1>

        <div className="input-container">
          <input
            type="text"
            placeholder="Enter name"
            onChange={e => this.setState({ name: e.target.value })}
          />
          <br />
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
          <button className="btn-link" onClick={this.createUser}>
            Sign up
          </button>
        </div>
      </div>
    );
  }
}

const createUser = gql`
  mutation($email: String!, $password: String!, $name: String!) {
    createUser(
      authProvider: { email: { email: $email, password: $password } }
      name: $name
    ) {
      id
    }
  }
`;

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

export default graphql(createUser, { name: 'createUser' })(
  graphql(userQuery, { options: { fetchPolicy: 'network-only' } })(
    graphql(signinUser, { name: 'signinUser' })(withRouter(Signup))
  )
);
