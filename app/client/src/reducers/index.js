import {combineReducers} from 'redux';
import authReducer from './authReducer';

// Used to combine all of the applications reducers
export default combineReducers({
    auth: authReducer
});