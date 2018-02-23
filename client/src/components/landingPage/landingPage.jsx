import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import fc from 'fullcalendar';
import view from 'fullcalendar';
import Promise from 'bluebird';

import LandingView from './landingPageView.jsx';

require('../../../../node_modules/fullcalendar/dist/fullcalendar.css');
import '../../../../node_modules/bootstrap/dist/js/bootstrap.bundle';


import './landingPage.css';
import { create } from 'domain';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      selectedStartTime: '',
      nextTime: '',
      selectedEndTime: '',
      selectedRoom: '',
      dropdownMessage: 'Select end time'
    }
    this.submitTime = this.submitTime.bind(this);
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
                  let start = this.convertToGridIdx(e.start.slice(11));
                  let end = this.convertToGridIdx(e.end.slice(11));
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
        if (ele === 0) {
          let mult = 1
          if (arr[j + 1] === 0 && j % 2 === 0) {
            mult = 2
          } else if (arr[j - 1] === 0 && j % 2 === 1) {
            mult = 0
          }
          btn.id = [i + 1, j];
          btn.style.top = j * 22 + 3 + 'px';
          btn.style.bottom = (j + mult) * -22 + 3 + 'px';
          btn.style.left = '0%';
          btn.style.right = '0%';
          btn.style.zIndex = 1;
          btn.onclick = () => {
            //overlay to prompt user for times
            console.log('button clicked', $('#timeSlots'))
            $('.dropdown-menu').empty();
            $('#timeSlots').modal('show');
            console.log(timeMoment, endTimeMoment);
            this.setState({
              selectedStartTime: timeMoment,
              selectedRoom: i + 1
            });
            this.populateOptions();
            // this.state.selectedStartTime = timeMoment;
            console.log('state of time', this.state.selectedStartTime)
            // axios.post(`/api/event/id=${i + 1}`, {
            //   title: 'newTest',
            //   start: `2018-02-13T${timeMoment}`,
            //   end: `2018-02-13T${endTimeMoment}`,
            //   owner: 'Admin'
            // })
          }
          document.getElementById(`calendar${i + 1}`)
            .getElementsByClassName('fc-event-container')[1]
            .appendChild(btn);

          // } else if (ele === 0) {
          //   //should not repeat find a way to min this

          //   btn.id = [i + 1, j];
          //   btn.style.top = j * 22 + 3 + 'px';
          //   btn.style.bottom = (j + 1) * -22 + 3 + 'px';
          //   btn.style.left = '0%';
          //   btn.style.right = '0%';
          //   btn.style.zIndex = 1;
          //   btn.onclick = () => {
          //     // console.log(timeMoment, endTimeMoment);
          //     // axios.post(`/api/event/id=${i + 1}`, {
          //     //   title: 'newTest',
          //     //   start: `2018-02-13T${timeMoment}`,
          //     //   end: `2018-02-13T${endTimeMoment}`,
          //     //   owner: 'Admin'
          //     // })
          //     // window.location.reload(false)
          //   }
          //   document.getElementById(`calendar${i + 1}`).getElementsByClassName('fc-event-container')[1].appendChild(btn);
          // }
        }
      })
    })
  }

  populateOptions() {
    
    this.state.nextTime = this.state.selectedStartTime;
    let idx = this.convertToGridIdx(this.state.selectedStartTime);
    let hourIdx = idx % 2 === 0 ? idx : idx - 1;
    console.log(idx, hourIdx)
    if (!this.state.grid[this.state.selectedRoom][hourIdx]) {
      let hourSlot = document.createElement('option');
      hourSlot.text = this.state.selectedStartTime.slice(0, 2) + ':00';
      hourSlot.onClick = () => {
        this.setState({
          selectedStartTime: hourSlot.text
        })
      }
      $('#startTimes').find('.dropdown-menu').append(hourSlot);
    }

    if (!this.state.grid[this.state.selectedRoom][hourIdx + 1]) {
      let halfHourSlot = document.createElement('option');
      halfHourSlot.text = this.state.selectedStartTime.slice(0, 2) + ':30';
      halfHourSlot.onClick = () => {
        this.setState({
          selectedStartTime: halfHourSlot.text
        })
      }
      $('#startTimes').find('.dropdown-menu').append(halfHourSlot);
    }

    // let currentSlot = document.createElement('option');
    // currentSlot.text = this.state.selectedStartTime.slice(0, 5);
    // $('#startTimes').find('.dropdown-menu').append(currentSlot);
    for (let i = 0; i < 5; i++) {
      let time = this.state.nextTime;
      let hour = time.slice(0, 2);
      let minutes = time.slice(3, 5);
      let option = document.createElement('option');
      option.className = 'dropdown-item';
      let nextTime = minutes === '00' ? hour + ':30' : '' + (Number(hour) + 1) + ':00';
      this.state.nextTime = nextTime + ':00';
      console.log('gridspot', this.state.grid[this.state.selectedRoom], this.convertToGridIdx(nextTime), this.state.grid[this.state.selectedRoom - 1][this.convertToGridIdx(nextTime)], 'in room: ', this.state.selectedRoom)
      option.text = nextTime;
      $('#endTimes').find('.dropdown-menu').append(option);
      option.onclick = () => {
        this.setState({
          dropdownMessage: nextTime,
          selectedEndTime: nextTime + ':00'
        })
      }
      if (this.state.grid[this.state.selectedRoom - 1][this.convertToGridIdx(nextTime)]) {
        return;
      }

    }
  }

  convertToGridIdx(time) {
    return (Number(time.slice(0, 2)) * 2 + (time.slice(3, 5) === '00' ? 0 : 1)) - 18
  }

  submitTime() {
    console.log('submitting start as:', this.state.selectedStartTime, 'and end as:', this.state.selectedEndTime);
    axios.post(`/api/event/id=${this.state.selectedRoom}`, {
      title: 'newerTest',
      start: `2018-02-13T${this.state.selectedStartTime}`,
      end: `2018-02-13T${this.state.selectedEndTime}`,
      owner: 'Admin'
    })
  }

  render() {
    return (
      <div>
        <div className="modal fade" id='timeSlots' role='dialog' ref={modal => this.modal = modal}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modal title</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="dropdown" id="startTimes">
                  <div> Select Start Time </div>
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.state.selectedStartTime.slice(0, 5)}
                  </button>
                  <div className="dropdown-menu">
                  </div>
                </div>
                <div className="dropdown" id="endTimes">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.state.dropdownMessage}
                  </button>
                  <div className="dropdown-menu">
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={this.submitTime} data-dismiss="modal">Submit</button>
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div id="calendars">
          <div id="calendar1"></div>
          <div id="calendar2"></div>
          <div id="calendar3"></div>
          <div id="calendar4"></div>
        </div>
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