import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from './Header';
import App from './App';
import Login from './Login';
import Signup from './Signup';
import CreateScorecard from './CreateScorecard';
import logo from './logo.png';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  ApolloProvider,
  createNetworkInterface,
  ApolloClient
} from 'react-apollo';

const networkInterface = createNetworkInterface({
  uri: process.env.REACT_APP_API_URI
});

const client = new ApolloClient({ networkInterface });

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }

      // get the authentication token from local storage if it exists
      if (localStorage.getItem('graphcoolToken')) {
        req.options.headers.authorization = `Bearer ${localStorage.getItem(
          'graphcoolToken'
        )}`;
      }

      next();
    }
  }
]);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Header />
        <div className="container">
          <img className="logo" src={logo} width="500" />

          <Route exact path="/" component={App} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/scorecard/new" component={CreateScorecard} />
        </div>
      </div>
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
);

registerServiceWorker();
