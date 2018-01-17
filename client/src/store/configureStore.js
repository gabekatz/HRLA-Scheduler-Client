import { createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { createLogger as logger } from 'redux-logger';
import thunk from 'redux-thunk';

import Reducer from '../reducer';

const history = createBrowserHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(
  thunk,
  router,
  logger(),
);

function configureStore() {
  return createStore(Reducer, enhancer);
};

module.exports = { configureStore, history };