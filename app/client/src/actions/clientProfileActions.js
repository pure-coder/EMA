import axios from 'axios';
import {
    GET_CLIENT_PROFILE,
    PROFILE_LOADING,
    CLEAR_CLIENT_PROFILE,
    CLIENT_PROGRESSION,
    GET_ERRS,
    GET_PROFILE_NOTES,
    CLEAR_PROFILE_NOTES,
    BODY_BIO_CLIENT,
    CLEAR_BODY_BIO_CLIENT
} from "./types"; // import custom defined types
import {manageErrors} from "./authenticationActions";

export const getClientData = (clientId, history) => dispatch => {
    dispatch(setProfileLoading());
    axios
        .get(`/api/client/${clientId}`)
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
export const getProfileNotes = (clientId, history) => dispatch => {
    axios
        .get(`/api/profile_notes/${clientId}`)
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

export const getBodyBioClient = (clientId, history) => dispatch => {
    // userId can either be same as clientId or the id of the personal trainer
    axios.get(`/api/body_bio/${clientId}` ) // using grave accent instead of single quote
        .then(result => {
            dispatch({
                type: BODY_BIO_CLIENT,
                payload: result.data
            });
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

export const clearBodyBioClient = () => dispatch => {
    dispatch({
        type: CLEAR_BODY_BIO_CLIENT
    });
};

export const getClientProgression = (clientId, history) => dispatch => {
    // userId can either be same as clientId or the id of the personal trainer
    axios.get(`/api/client_progression/${clientId}` ) // using grave accent instead of single quote
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
