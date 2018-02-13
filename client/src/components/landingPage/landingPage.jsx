import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import fc from 'fullcalendar';
import view from 'fullcalendar';

import LandingView from './landingPageView.jsx';

import './landingPage.css';

class Landing extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('#calendar').fullCalendar({
      header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
      defaultView: 'agendaDay',
      editable: true,
      eventSources: [
        {
          url: '/room1.php',
          color: 'blue',
          textColor: 'white'
        },
        {
          url: '/room2.php',
          color: 'yellow',
          textColor: 'black'
        }
      ],
      resources: [
          // resources go here
      ]
      // other options go here...)
  })
}

  render() {
    return (
      <div className="GCAL">
        <div id="calendar">
        </div>
        {/* <LandingView /> */}
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