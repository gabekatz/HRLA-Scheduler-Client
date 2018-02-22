import React from 'react';

const GCAL_URL = process.env.GCAL_URL;

const LandingView = () => {
  return (
    <div>
      <iframe src={GCAL_URL} style={{ borderWidth: 0 }} width="800" height="600" frameBorder="0" scrolling="no" />
      <div className="modal fade" id='timeSlots' role='dialog'>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Select Time Slot
            </button>
                <div className="dropdown-menu">
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingView;