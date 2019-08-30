import {GET_ERRS} from './types';
import {logOutUser} from "./authenticationActions";

export const manageErrors = (err) => dispatch => {

    // If 404 status code (not found) then redirect to error page
    if(err.response.status === 404){
        window.location.href = '/error_page';
    }
    // If 401 status code (unauthorised) means token expired so logout user/(clear current token, clear redux) then redirect to login page
    else if(err.response.status === 401){
        dispatch(logOutUser());
        window.location.href = '/re-login';
    }
    else{
        dispatch({
        type: GET_ERRS,
        payload: err.response.data
        });
    }
};
