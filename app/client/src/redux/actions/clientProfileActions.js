import axios from 'axios';
import {
    GET_CLIENT_PROFILE,
    CLIENT_PROFILE_LOADING,
    CLEAR_CLIENT_PROFILE,
    CLIENT_PROGRESSION,
    GET_ERRS,
    GET_PROFILE_NOTES,
    CLEAR_PROFILE_NOTES,
    BODY_BIO_CLIENT,
    UPDATE_PROFILE_PIC_CLIENT,
    CLIENT_PROFILE_EDITED,
    CLIENT_NEXT_WORKOUTS
} from "./types"; // import custom defined types
import {setSuccess} from "./ptProfileActions";
import {manageErrors} from "./errorsAction";

export const clientGetData = () => dispatch => {
    dispatch(setProfileLoading());
    axios
        .get(`/api/client/:cid`)
        .then(result => {
            dispatch({
                type: GET_CLIENT_PROFILE,
                payload: result.data
            });
        })
        .catch(err => {
            dispatch(manageErrors(err));
        });
};

export const clientNextWorkouts = () => dispatch => {
    axios.get(`/api/next_workouts`)
        .then(result => {
            dispatch({
                type: CLIENT_NEXT_WORKOUTS,
                payload: result.data
            })
        })
        .catch(err =>{
            dispatch(manageErrors(err));
        })
};

export const setProfileLoading = () => {
    return {
        type: CLIENT_PROFILE_LOADING
    }
};

// Get pt Clients profile notes
export const clientGetProfileNotes = () => dispatch => {
    axios
        .get(`/api/profile_notes/`)
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
            dispatch(manageErrors(err));
        })
};

export const clientGetBodyBio = () => dispatch => {
    // userId can either be same as clientId or the id of the personal trainer
    axios.get(`/api/body_bio/` ) // using grave accent instead of single quote
        .then(result => {
            dispatch({
                type: BODY_BIO_CLIENT,
                payload: result.data
            });
        })
        .catch(err => {
            dispatch(manageErrors(err));
        });
};

export const clientGetProgression = () => dispatch => {
    // userId can either be same as clientId or the id of the personal trainer
    axios.get(`/api/client_progression/` ) // using grave accent instead of single quote
        .then(result => {
            dispatch({
                type: CLIENT_PROGRESSION,
                payload: result.data
            });
        })
        .catch(err => {
            dispatch(manageErrors(err));
        });
};

export const clientUploadProfilePic = (dataImage, fileName) => dispatch => {
    const formData = new FormData();
    formData.append('profileImage', dataImage, fileName);

    // Get token for fetch ---- content type
    const token = localStorage.getItem('jwtToken');
    if(token !== null){
        let config = {
            method: 'POST',
            headers: new Headers({
                Authorization: token
            }),
            body : formData
        };

        // As using fetch dealing with result status is different then axios
        fetch(`/api/upload_profile_pic`, config)
            .then(response => {
                if(response.status === 400){
                    response.json()
                        .then(result => {
                            dispatch({
                                type: GET_ERRS,
                                payload: result.msg
                            })
                        })
                }
                else {
                    response.json()
                        .then(data =>{
                            dispatch({
                                type: UPDATE_PROFILE_PIC_CLIENT,
                                payload: data.url
                            });
                            dispatch(setSuccess(data.msg));
                        })
                }
            })
            .catch(err => {
                dispatch(manageErrors(err));
            })
    }
};

export const clientEditData = (data) => dispatch => {
    axios
        .put(`/api/edit_client/`, data)
        .then(result => {
            if(result.status === 200){
                dispatch({
                    type : CLIENT_PROFILE_EDITED,
                    payload: result.data
                });
                dispatch(setSuccess("Client data successfully updated."))
            }
        })
        .catch(err => {
           dispatch(manageErrors(err));
        })
};

/* Clear */

export const clientClearProfile = () => {
    return {
        type: CLEAR_CLIENT_PROFILE
    }
};

export const clientClearProfileNotes = () => dispatch => {
    dispatch({
        type: CLEAR_PROFILE_NOTES
    })
};

export const clearErrors = () => dispatch => {
    dispatch({
        type: GET_ERRS,
        payload: {}
    })
};
