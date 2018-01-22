import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LandingView from './landingPageView.jsx';

import './landingPage.css';

class Landing extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    
  }

  render() {
    return (
      <div className="GCAL">
        <LandingView />
      </div>
    )
  }
}

const LandingState = (state) => {

}

const LandingDispatch = (dispatch) => {

}

// export default connect(LandingState, LandingDispatch)(Landing)
export default Landing;