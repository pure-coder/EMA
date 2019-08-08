import axios from 'axios';
import {
    GET_CLIENT_PROFILE,
    PROFILE_LOADING,
    CLEAR_CLIENT_PROFILE,
    CLIENT_PROGRESSION,
    GET_ERRS,
    GET_PROFILE_NOTES,
    CLEAR_PROFILE_NOTES
} from "./types"; // import custom defined types
import {logOutUser} from "./authenticationActions";

const manageErrors = (err, dispatch, history) => {
    // console.log(err.response);
    // 401 Unauthorised
    if(err.response.status === 401){
        dispatch({
            type: GET_ERRS,
            payload: {
                error_message: err.response.data,
                error_code: err.response.status
            }
        });
        dispatch(logOutUser());
        dispatch(clearClientProfile());
        dispatch(clearErrors());
        history.push('/re-login');
    }
    // If used direct url, and id doesn't exist send user to error page (404 - Not Found)
    else if (err.response.status === 404){
        history.replace('/error_page');
    }
    else {
        dispatch({
            type: GET_ERRS,
            payload: err.response.data
        })
    }
};

export const getClientData = (id, history) => dispatch => {
    dispatch(setProfileLoading());
    axios
        .get(`/api/client/${id}`)
        .then(result => {
            dispatch({
                type: GET_CLIENT_PROFILE,
                payload: result.data
            })
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};



export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
};

export const clearClientProfile = () => {
    return {
        type: CLEAR_CLIENT_PROFILE
    }
};

// Get pt Clients profile notes
export const getProfileNotes = (cId, history) => dispatch => {
    axios
        .get(`/api/profile_notes/${cId}`)
        .then(result => {
                // dispatch this action to the action below so the data can be sent to the respective reducer
                dispatch(
                    {
                        type: GET_PROFILE_NOTES,
                        payload: result.data
                    }
                )
            }
        )
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
};

export const clearProfileNotes = () => dispatch => {
    dispatch({
        type: CLEAR_PROFILE_NOTES
    })
};

export const getClientProgression = (userId, clientId, history) => dispatch => {
    // userId can either be same as clientId or the id of the personal trainer
    axios.get(`/api/${userId}/client_progression/${clientId}` ) // using grave accent instead of single quote
        .then(result => {
            dispatch({
                type: CLIENT_PROGRESSION,
                payload: result.data
            });
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

export const clearErrors = () => dispatch => {
    dispatch({
        type: GET_ERRS,
        payload: {}
    })
};
