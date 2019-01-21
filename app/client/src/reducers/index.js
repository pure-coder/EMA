import {combineReducers} from 'redux';
import authenticationReducer from './authenticationReducer';
import dashboardReducer from './dashboardReducer';
import errReducer from "./errReducer";

// Used to combine all of the applications reducers (actions)
export default combineReducers({
    authenticatedUser: authenticationReducer, // Must be defined in stateToProps of components using this reducer
    ptClients: dashboardReducer, // Must be defined in stateToProps of components using this reducer, ie Dashboard.js
    errors: errReducer // Must be defined in stateToProps of components using this reducer,
}); // THIS WILL EXPORT combineReducers function which will be called from ../store.js as rootReducer