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
    CLEAR_CLIENT_PROGRESSION
} from "./types"; // import custom defined types
import {manageErrors} from "./authenticationActions";
import {setSuccess} from "./ptProfileActions";

export const clientGetData = (clientId, history) => dispatch => {
    dispatch(setProfileLoading());
    axios
        .get(`/api/client/${clientId}`)
        .then(result => {
            dispatch({
                type: GET_CLIENT_PROFILE,
                payload: result.data
            });
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

export const setProfileLoading = () => {
    return {
        type: CLIENT_PROFILE_LOADING
    }
};

// Get pt Clients profile notes
export const clientGetProfileNotes = (clientId, history) => dispatch => {
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

export const clientGetBodyBio = (clientId, history) => dispatch => {
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

export const clientGetProgression = (clientId, history) => dispatch => {
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

// export const clientSaveProfilePic = (data, image, history) => dispatch => {
//     const formData = new FormData();
//     formData.append('profilePicture', data, 'filename.png');
//     axios.post(`/api/upload_profile_pic`, formData)
//         .then(() => {
//                 dispatch({
//                     type: UPDATE_PROFILE_PIC_CLIENT,
//                     payload: image
//                 });
//                 dispatch(setSuccess("Profile Picture has been updated."));
//             }
//         )
//         .catch(err => {
//             manageErrors(err, dispatch, history);
//         });
// };


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
