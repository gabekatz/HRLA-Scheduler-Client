import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import fc from 'fullcalendar';
import view from 'fullcalendar';

import LandingView from './landingPageView.jsx';

require('../../../../node_modules/fullcalendar/dist/fullcalendar.css');


import './landingPage.css';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: []
    }
  }

  componentDidMount() {

    const gridLength= document.getElementById('calendars').children.length
    console.log('grid'/*, this.state.grid*/)
    for (let i = 0; i < gridLength; i++) {
      this.state.grid.push(new Array(30).fill(0));
    }
 
    for (let i = 1; i < 5; i++){
      $(`#calendar${i}`).fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay',
        },
        allDayText: 'Room #',
        contentHeight: 800,
        minTime:"09:00:00",
        defaultDate:"2018-02-13",
        defaultView: 'agendaDay',
        editable: true,
        slotLabetimelFormat: '',
        events: (start, end, timezone, callback) => {
          let events = [
            {
              id: 999,
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
                let start = (Number(e.start.slice(11,13)) * 2 - e.start.slice(14,16 === '00' ? 0 : 1)) - 18;
                let end = (Number(e.end.slice(11,13)) * 2- e.end.slice(14,16 === '00' ? 0 : 1))  - 18;
                this.state.grid[i - 1].fill(1, start, end);
                console.log(e.start.slice(11,13), e.end.slice(11,13));
              })
              callback(events)
              this.fillSlots();

            })
            .catch((err) => {
              console.log(err);
            })
        },
      })
    }

    //bottom of room screen is 660
  console.log('at bottom')

  }

  fillSlots () {
    console.log('filling slots')
    this.state.grid.forEach((row, i) => {
      // console.log(row)
      row.forEach((ele, j) => {
        if (!ele) {
          let btn = document.createElement("a");
          btn.className ='fc-time-grid-event fc-v-event fc-event fc-start fc-end fc-draggable fc-resizable';
          btn.id = [i + 1, j]
          btn.style.top = j * 22  + 3 + 'px';
          btn.style.bottom = (j + 1) * -22 + 3 + 'px';
          btn.style.left = '0%'
          btn.style.right = '0%'
          btn.style.zIndex = 1;
          document.getElementById(`calendar${i + 1}`).getElementsByClassName('fc-event-container')[1].appendChild(btn);

        }
      })
    })
  }

  render() {
    return (
      <div id="calendars">
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