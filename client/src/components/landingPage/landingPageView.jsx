import React from 'react';

const GCAL_URL = process.env.GCAL_URL;

const LandingView = () => {
  return(
  <div>
    <iframe src={GCAL_URL} style={{borderWidth: 0}} width="800" height="600" frameBorder="0" scrolling="no" />
  </div>
  )
} 

export default LandingView;