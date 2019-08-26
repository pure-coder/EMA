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
    CLEAR_BODY_BIO_CLIENT,
    UPDATE_PROFILE_PIC_CLIENT,
    CLEAR_CLIENT_PROGRESSION,
    CLIENT_PROFILE_EDITED
} from "./types"; // import custom defined types
import {setSuccess} from "./ptProfileActions";

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

        });
};

export const setProfileLoading = () => {
    return {
        type: CLIENT_PROFILE_LOADING
    }
};

// Get pt Clients profile notes
export const clientGetProfileNotes = (clientId) => dispatch => {
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

        })
};

export const clientGetBodyBio = (clientId) => dispatch => {
    // userId can either be same as clientId or the id of the personal trainer
    axios.get(`/api/body_bio/${clientId}` ) // using grave accent instead of single quote
        .then(result => {
            dispatch({
                type: BODY_BIO_CLIENT,
                payload: result.data
            });
        })
        .catch(err => {

        });
};

export const clientGetProgression = (clientId) => dispatch => {
    // userId can either be same as clientId or the id of the personal trainer
    axios.get(`/api/client_progression/${clientId}` ) // using grave accent instead of single quote
        .then(result => {
            dispatch({
                type: CLIENT_PROGRESSION,
                payload: result.data
            });
        })
        .catch(err => {

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

        fetch(`/api/upload_profile_pic`, config)
            .then(result => result.json())
            .then(data => {
                dispatch({
                    type: UPDATE_PROFILE_PIC_CLIENT,
                    payload: data.url
                });
                dispatch(setSuccess(data.msg))
            })
            .catch(err => {

            })
    }
};

export const clientEditData = (clientId, data) => dispatch => {
    axios
        .put(`/api/edit_client/${clientId}`, data)
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

        })
};

/* Clear */

export const clientClearProfile = () => {
    return {
        type: CLEAR_CLIENT_PROFILE
    }
};

export const clientClearBodyBio = () => dispatch => {
    dispatch({
        type: CLEAR_BODY_BIO_CLIENT
    });
};

export const clientClearProgression = () => dispatch => {
    dispatch({
        type: CLEAR_CLIENT_PROGRESSION
    });
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
