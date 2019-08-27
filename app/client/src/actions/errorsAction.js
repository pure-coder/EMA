import {GET_ERRS} from './types';

export const manageErrors = (err) => dispatch => {

    // If 404 status code (not found) then redirect to error page
    if(err.response.status === 404){
        window.location.href = '/error_page';
    }
    // If 401 status code (unauthorised) then redirect to login page
    else if(err.response.status === 401){
        window.location.href = '/re-login';
    }
    else{
        dispatch({
        type: GET_ERRS,
        payload: err.response.data
        });
    }
};
