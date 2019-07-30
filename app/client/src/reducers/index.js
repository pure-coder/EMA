import {combineReducers} from 'redux';
import authenticationReducer from './authenticationReducer';
import ptProfileReducer from "./ptProfileReducer";
import clientProfileReducer from "./clientProfileReducer";
import errReducer from "./errReducer";
import successReducer from "./successReducer";

// Used to combine all of the applications reducers (actions)
export default combineReducers({
    authenticatedUser: authenticationReducer, // Must be defined in stateToProps of components using this reducer
    ptProfile: ptProfileReducer,
    clientProfile: clientProfileReducer,
    errors: errReducer, // Must be defined in stateToProps of components using this reducer,
    success: successReducer
}); // THIS WILL EXPORT combineReducers function which will be called from ../store.js as rootReducer
