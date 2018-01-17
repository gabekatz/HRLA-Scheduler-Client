import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

//import component routes


import Routes from './routes.jsx';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Test
      </div>
    )
  }
};

const AppState = (state) => {
  return {
  };
};

export default withRouter(connect(AppState)(App));