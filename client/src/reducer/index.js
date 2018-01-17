import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

//import paths for other reducers


const Reducer = combineReducers({
  //other reducers
  router,
});

export default Reducer;