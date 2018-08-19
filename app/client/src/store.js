import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialisedState = {}; // Allows a preloaded state to be passed into the store

// Allows the action creators to be written that returns a function instead of an action
const middleware = [thunk];

// Used to create store to hold application state, 1st parameter of createStore is the root reducer (specifies how app state
// changes in response to actions), 2nd parameter takes the initialisedState, 3rd parameter takes the thunk middleware.
const store = createStore(rootReducer, initialisedState, applyMiddleware(...middleware));

export default  store;