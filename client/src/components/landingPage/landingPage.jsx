import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import fc from 'fullcalendar';
import view from 'fullcalendar';
import Promise from 'bluebird';

import LandingView from './landingPageView.jsx';

require('../../../../node_modules/fullcalendar/dist/fullcalendar.css');


import './landingPage.css';
import { create } from 'domain';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: []
    }
  }

  componentDidMount() {

    //bottom of room screen is 660
    this.getCalendars()
      .then(() => {
        console.log('done')
        this.fillSlots()
      })

  }


  createGrid() {
    const gridLength = document.getElementById('calendars').children.length
    console.log('grid'/*, this.state.grid*/)
    for (let i = 0; i < gridLength; i++) {
      this.state.grid.push(new Array(30).fill(0));
    }

  }
  getCalendars() {
    return new Promise((resolve, reject) => {
      this.state.grid = [];
      this.createGrid();
      for (let i = 1; i < 5; i++) {
        $(`#calendar${i}`).fullCalendar({
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay',
          },
          allDayText: 'Room #',
          contentHeight: 800,
          minTime: "09:00:00",
          defaultDate: "2018-02-13",
          defaultView: 'agendaDay',
          editable: true,
          slotLabetimelFormat: '',
          events: async (start, end, timezone, callback) => {
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
                  let start = (Number(e.start.slice(11, 13)) * 2 + (e.start.slice(14, 16) === '00' ? 0 : 1)) - 18;
                  let end = (Number(e.end.slice(11, 13)) * 2 + (e.end.slice(14, 16) === '00' ? 0 : 1)) - 18;
                  console.log('start: ', start, 'end: ', end, 'for row:', i)
                  console.log('starthour slice:', e.start.slice(11, 13), 'endhour slice:', e.end.slice(11, 13));
                  this.state.grid[i - 1].fill(1, start, end);
                  console.log('grid after filling', this.state.grid)
                })
                // callback(events);
                console.log(callback)
                callback(events);
                if (i === 4) {
                  resolve();
                }

                // callbackAsync()
                // .then(()=> {
                //     this.fillSlots(i);
                // });
              })
              .catch((err) => {
                console.log(err);
              })
          },
        })
      }

    })
  }

  fillSlots() {
    // console.log('filling slots', this.state.grid, i)

    this.state.grid.forEach((row, i) => {

      row.forEach((ele, j, arr) => {
        let btn = document.createElement("a");
        btn.className = 'fc-time-grid-event fc-v-event fc-event fc-start fc-end fc-draggable fc-resizable';
        let timeDigit = (j + 18) / 2;
        let hours = Math.floor(timeDigit);
        let minutes = timeDigit !== hours ? '30' : '00';
        let timeMoment = '' + hours + ':' + minutes + ':00';
        let endMinutes = minutes === '00' ? '30' : '00';
        let endHour = endMinutes === '00' ? hours + 1 : hours;
        let endTimeMoment = '' + endHour + ':' + endMinutes + ':00';
        if (ele === 0 && arr[j + 1] === 0 && j % 2 === 0) {
          btn.id = [i + 1, j];
          btn.style.top = j * 22 + 3 + 'px';
          btn.style.bottom = (j + 2) * -22 + 3 + 'px';
          btn.style.left = '0%';
          btn.style.right = '0%';
          btn.style.zIndex = 1;
          btn.onclick = () => {
            console.log(timeMoment, endTimeMoment);
            axios.post(`/api/event/id=${i + 1}`, {
              title: 'newTest',
              start: `2018-02-13T${timeMoment}`,
              end: `2018-02-13T${endTimeMoment}`,
              owner: 'Admin'
            })
            // this.setState({
            //   grid: []
            // })
            // this.getCalendars();
          }
          document.getElementById(`calendar${i + 1}`)
          .getElementsByClassName('fc-event-container')[1]
          .appendChild(btn);

        } else if (ele === 0) {
//should not repeat find a way to min this

          btn.id = [i + 1, j];
          btn.style.top = j * 22 + 3 + 'px';
          btn.style.bottom = (j + 1) * -22 + 3 + 'px';
          btn.style.left = '0%';
          btn.style.right = '0%';
          btn.style.zIndex = 1;
          btn.onclick = () => {
            console.log(timeMoment, endTimeMoment);
            axios.post(`/api/event/id=${i + 1}`, {
              title: 'newTest',
              start: `2018-02-13T${timeMoment}`,
              end: `2018-02-13T${endTimeMoment}`,
              owner: 'Admin'
            })
            window.location.reload(false)
          }
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