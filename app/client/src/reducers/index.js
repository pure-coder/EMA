import {combineReducers} from 'redux';
import authenticationReducer from './authenticationReducer';
import errReducer from "./errReducer";

// Used to combine all of the applications reducers (actions)
export default combineReducers({
    authenticatedUser: authenticationReducer,
    errors: errReducer
}); // THIS WILL EXPORT combineReducers function which will be called from ../store.js as rootReducer