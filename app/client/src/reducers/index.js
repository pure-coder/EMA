import {combineReducers} from 'redux';
import authenticationReducer from './authenticationReducer';
import dashboardReducer from './dashboardReducer';
import errReducer from "./errReducer";

// Used to combine all of the applications reducers (actions)
export default combineReducers({
    authenticatedUser: authenticationReducer,
    clients: dashboardReducer,
    errors: errReducer
}); // THIS WILL EXPORT combineReducers function which will be called from ../store.js as rootReducer