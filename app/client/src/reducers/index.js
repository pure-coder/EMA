import {combine_Reducers} from 'redux';
import authReducer from './authReducer;';

// Used to combine all of the applications reducers
export default combine_Reducers({
    auth: authReducer
})