import axios from 'axios';


const REST_SERVER = process.env.REST_SERVER;

export const checkAuth = () => (dispatch) => {
  axios.get(`${REST_SERVER}/`)
    .then(({ data }) => {
      const payload = {
        
      }
    })
}