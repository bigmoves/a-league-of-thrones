import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from './Header';
import App from './App';
import Login from './Login';
import Signup from './Signup';
import Scorecard from './Scorecard';
import logo from './logo.png';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  ApolloProvider,
  createNetworkInterface,
  ApolloClient
} from 'react-apollo';

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj55ue2dwq21a0148ytkgob1r'
});

const client = new ApolloClient({networkInterface});

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }

    // get the authentication token from local storage if it exists
    if (localStorage.getItem('graphcoolToken')) {
      req.options.headers.authorization = `Bearer ${localStorage.getItem('graphcoolToken')}`;
    }

    next();
  }
}]);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Header/>
        <div className="container">
          <img className="logo" src={logo} width="500"/>

          <Route exact path="/" component={App} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/scorecard" component={Scorecard} />
        </div>
      </div>
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
);

registerServiceWorker();
