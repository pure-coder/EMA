import {combineReducers} from 'redux';
import authenticationReducer from './authenticationReducer';
import errReducer from "./errReducer";
import schedulerReducer from './schedulerReducer';

// Used to combine all of the applications reducers (actions)
export default combineReducers({
    authenticatedUser: authenticationReducer,
    dataPosted: schedulerReducer,
    errors: errReducer
});