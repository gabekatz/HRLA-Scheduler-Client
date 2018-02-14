import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import fc from 'fullcalendar';
import view from 'fullcalendar';

import LandingView from './landingPageView.jsx';

import './landingPage.css';

class Landing extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    for (let i = 1; i < 5; i++){
      $(`#calendar${i}`).fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        allDayText: i === 1 ? 'Room #' : '' 
        ,
        contentHeight: 800,
        minTime:"09:00:00",
        defaultView: 'agendaDay',
        editable: true,
        slotLabetimelFormat: '',
        events: (start, end, timezone, callback) => {
          let events = [
            {
              allDay: true,
              title: i,
              start: '2018-02-13',
            }
          ];
          axios.get(`/api/event/id=${i}`)
            .then(({ data }) => {
              console.log(`successful call to retrieve from room ${i},`, data)
              data.forEach((e) => {
                events.push({
                  title: e.title,
                  start: e.start,
                  end: e.end,
                })
  
              })
              callback(events)
              console.log(events)
            })
            .catch((err) => {
              console.log(err);
            })
        },
        resources: [
        ]
      })
    }

    $('.fc-axis').hide();
    $('#calendar1').find('.fc-axis').show();

  }

  render() {
    return (
      <div className="calendars">
        <div id="calendar1"></div>
        <div id="calendar2"></div>
        <div id="calendar3"></div>
        <div id="calendar4"></div>
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