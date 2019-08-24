import axios from 'axios';
// AWS functionality
import 'dhtmlx-scheduler';
import {
    GET_PT_PROFILE,
    PT_PROFILE_LOADING,
    CLEAR_CURRENT_CLIENT_PROFILE,
    GET_PT_CLIENTS_DATA,
    PT_CLIENT_PROGRESSION,
    CLEAR_CLIENT_PROGRESSION,
    PASSWORD_ERROR,
    GET_ERRS,
    SUCCESS,
    CLEAR_SUCCESS,
    GET_CURRENT_CLIENT,
    PT_CLEAR_PROFILE,
    SCHEDULER,
    CLEAR_WORKOUT_DATA,
    GET_CLIENT_PROFILE_NOTES,
    CLEAR_CLIENT_PROFILE_NOTES,
    PT_CLIENT_BODY_BIO,
    CLEAR_BODY_BIO,
    UPDATE_PROFILE_PIC_PT,
    UPDATE_PROFILE_PIC_CURRENT_CLIENT
} from "./types"; // import custom defined types
import {manageErrors} from "./authenticationActions";
require('es6-promise').polyfill();
require('isomorphic-fetch');
let crypto = require("crypto-js");

// Register client
export const registerClient =(Data, props, history) => (dispatch) => {
    // Post user data to the API specifically the user/register route
    axios
        .post('/api/new_client', Data)
        .then(result => {
            if(result.status === 200){
                dispatch(setSuccess("Client added successfully."));
            }
        }) // Uses history.push to direct the user) // Uses history.push to direct the user history.push('/login')
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
}; // registerClient

// Get pt Clients
export const ptGetClients = (history) => dispatch => {
    axios
        .get(`/api/pt_clients`)
        .then(result => {
                // return {clients : result.data}
                // dispatch this action to the action below so the data can be sent to the respective reducer
                dispatch(ptSetClients(result.data))
            }
        )
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
};

// Used to send data from getClients action above to the reducer in dashboardReducer.js
export const ptSetClients = (data) => {
    // console.log("set pt clients", data)
    return{
        type: GET_PT_CLIENTS_DATA,
        payload: data
    }
};

export const ptGetData = (history) => dispatch => {
    dispatch(ptSetProfileLoading());
    axios
        .get(`/api/personal_trainer`)
        .then(result => {
            if (typeof result.data === "string"){
                history.replace('/error_page');
            }
            dispatch({
                type: GET_PT_PROFILE,
                payload: result.data
            });
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
};

export const ptGetCurrentClient = (clientId, history) => dispatch => {
    dispatch(ptSetProfileLoading());
    axios
        .get(`/api/client/${clientId}`)
        .then(result => {
            dispatch({
                type: GET_CURRENT_CLIENT,
                payload: result.data
            });
            if(result.data.ProfilePicUrl !== "NA") {
                dispatch({
                    type: UPDATE_PROFILE_PIC_CURRENT_CLIENT,
                    payload: result.data.ProfilePicUrl
                });
            }
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

export const ptEditData = (Data, history) => dispatch => {
    axios
        .put(`/api/edit_personal_trainer`, Data)
        .then(result => {
                if(result.status === 200){
                    dispatch(setSuccess("Personal Trainer profile has been updated successfully"));
                }
            }
        )
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
};

export const ptEditClientData = (clientId, data, history) => dispatch => {
    axios
        .put(`/api/edit_client/${clientId}`, data)
        .then(result => {
            if(result.status === 200){
                dispatch(setSuccess("Client data successfully updated."))
            }
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
};

// Get pt Clients profile notes
export const ptGetClientProfileNotes = (clientId, history) => dispatch => {
    axios
        .get(`/api/profile_notes/${clientId}`)
        .then(result => {
                // dispatch this action to the action below so the data can be sent to the respective reducer
                dispatch(
                    {
                        type: GET_CLIENT_PROFILE_NOTES,
                        payload: result.data
                    }
                )
            }
        )
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
};

// Get pt Clients profile notes
export const ptUpdateClientProfileNotes = (clientId, data, history) => dispatch => {
    axios
        .put(`/api/profile_notes/${clientId}`, {data})
        .then(result => {
            // causes refresh of dashboard with updated client list
            if(result.status === 200) {
                dispatch(setSuccess("Data updated", "PROFILE"));
            }
            if(result.status === 400){
                dispatch(setErrors("Could not update data"))
            }
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
};

// Delete Client
export const ptDeleteClient = (clientId, history) => dispatch => {
    axios
        .delete(`/api/delete_client/${clientId}`)
        .then(result => {
            // causes refresh of dashboard with updated client list
            if(result.status === 200) {
                dispatch(ptGetClients(history));
                dispatch(setSuccess("Client deleted successfully."));
            }
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
};

export const ptSetProfileLoading = () => {
    return {
        type: PT_PROFILE_LOADING
    }
};

export const ptGetClientProgression = (clientId, history) => dispatch => {
    // userId can either be same as clientId or the id of the personal trainer
    axios.get(`/api/client_progression/${clientId}` ) // using grave accent instead of single quote
        .then(result => {
            dispatch({
                type: PT_CLIENT_PROGRESSION,
                payload: result.data
            });
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};


export const ptNewClientProgress = (clientId, data, history) => dispatch => {
    axios.post(`/api/client_progression/${clientId}`, data)
        .then(result => {
            // If successful then clear error messages and send success message
            if(result.data.n === 1 && result.data.nModified === 1){
                dispatch({
                    type: GET_ERRS,
                    payload: {}  // Empty object payload clears errors in component
                });
                // Have to use dispatch to send action function to another action function in the actions file
                dispatch(setSuccess("ENTRY SUCCESSFUL"));
            }
        })
        .catch(err => {
            manageErrors(err, dispatch,history);
        });
};

export const ptDeleteExercise =(clientId, data, history) => dispatch => {
    axios.delete(`/api/client_progression/${clientId}`, {data : {exerciseName : data}})
        .then(() => {
            dispatch(ptGetClientProgression(clientId, history));
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

export const ptEditClientExercise =(clientId, exerciseId, data, history) => dispatch => {
    axios.put(`/api/client_progression/${clientId}`,
        {data :
                {
                    exerciseId: exerciseId,
                    newMetrics: data
                }
        })
        .then( result => {
            dispatch(setSuccess(result.data.msg));
            dispatch(ptGetClientProgression(clientId, history));
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

export const ptGetClientBodyBio = (clientId, history) => dispatch => {
    // userId can either be same as clientId or the id of the personal trainer
    axios.get(`/api/body_bio/${clientId}` ) // using grave accent instead of single quote
        .then(result => {
            dispatch({
                type: PT_CLIENT_BODY_BIO,
                payload: result.data
            });
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

export const ptNewClientBodyBio = (clientId, data, history) => dispatch => {
    axios.post(`/api/body_bio/${clientId}`, data)
        .then(result => {
            // If successful then clear error messages and send success message
            if(result.data.n === 1 && result.data.nModified === 1){
                dispatch({
                    type: GET_ERRS,
                    payload: {}  // Empty object payload clears errors in component
                });
                // Have to use dispatch to send action function to another action function in the actions file
                dispatch(setSuccess("ENTRY SUCCESSFUL"));
            }
        })
        .catch(err => {
            manageErrors(err, dispatch,history);
        });
};

export const ptDeleteBodyPart =(clientId, data, history) => dispatch => {
    axios.delete(`/api/body_bio/${clientId}`, {data : {bodyPart : data}})
        .then(() => {
            dispatch(ptGetClientBodyBio(clientId, history));
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

export const ptEditClientBodyBio =(clientId, bodyPartId, data, history) => dispatch => {
    axios.put(`/api/body_bio/${clientId}`,
        {data :
                {
                    bodyPartId: bodyPartId,
                    bodyMetrics: data
                }
        })
        .then( result => {
            dispatch(setSuccess(result.data.msg));
            dispatch(ptGetClientBodyBio(clientId, history));
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

export const ptWorkoutScheduler = (userId, clientId) => dispatch => {
    axios.get(`/api/${userId}/scheduler/${clientId}`)
        .then(result => {
            if (result) {
                dispatch({
                    type: SCHEDULER,
                    payload: result.data
                })
            }
        })
        .catch(err => {
            manageErrors(err, dispatch);
        });
};

// export const ptSaveProfilePic = (data, image, history) => dispatch => {
//     const formData = new FormData();
//     formData.append('profilePicture', data, 'filename.png');
//     axios.post(`/api/upload_profile_pic`, formData)
//         .then(() => {
//                 dispatch({
//                     type: UPDATE_PROFILE_PIC_PT,
//                     payload: image
//                 });
//                 dispatch(setSuccess("Profile Picture has been updated."));
//             }
//         )
//         .catch(err => {
//             manageErrors(err, dispatch, history);
//         });
// };


// Clear

export const ptClearProfile = () => dispatch => {
    dispatch({
        type: PT_CLEAR_PROFILE
    });
};

export const ptClearCurrentClientProfile = () => {
    return {
        type: CLEAR_CURRENT_CLIENT_PROFILE
    }
};

export const ptClearClientBodyBio = () => dispatch => {
    dispatch({
        type: CLEAR_BODY_BIO
    });
};

export const ptClearClientProgression = () => dispatch => {
    dispatch({
        type: CLEAR_CLIENT_PROGRESSION
    });
};

export const ptClearClientProfileNotes = () => dispatch => {
    dispatch({
        type: CLEAR_CLIENT_PROFILE_NOTES
    })
};

export const ptClearWorkoutData = () => dispatch => {
    dispatch({
        type: CLEAR_WORKOUT_DATA
    })
};


/* Errors and success */

export const setErrors = (error) => dispatch => {
    if(typeof error === "string"){
        dispatch({
            type: GET_ERRS,
            payload: {
                type: "ERROR",
                msg: error
            }
        })
    } // typeof string
    if(typeof error === "object"){
        // Object error message should only have one value so extract the message error to string
        let message = Object.values(error).toString();
        dispatch({
            type: GET_ERRS,
            payload: {
                type: "ERROR",
                msg: message
            }
        })
    } // typeof string
};

export const setSuccess = (message, optional = null) => dispatch => {
    if(optional === null){
        dispatch({
            type: SUCCESS,
            payload: {
                type: "SUCCESS",
                msg: message
            }
        })
    }
    else{
        dispatch({
            type: SUCCESS,
            payload: {
                type: optional,
                msg: message
            }
        })
    }
};


export const clearErrors = () => dispatch => {
    dispatch({
        type: GET_ERRS,
        payload: {}
    })
};

export const clearSuccess = () => dispatch => {
    dispatch({
        type: CLEAR_SUCCESS,
        payload: {}
    })
};

export const passwordsMatchError = (error) => dispatch => {
    dispatch ({
            type: PASSWORD_ERROR,
            payload: error
        }
    )
};


function getSignatureKey(key, dateStamp, regionName, serviceName) {
    let kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
    let kRegion = crypto.HmacSHA256(regionName, kDate);
    let kService = crypto.HmacSHA256(serviceName, kRegion);
    let kSigning = crypto.HmacSHA256("aws4_request", kService);
    return kSigning;
}

export const uploadProfilePic = () => dispatch => {
    const fileName = "newFile";
    const fileType = 'image/jpeg';
    const host = 'https://jrdunkleyfitnessapp.s3.amazonaws.com';

    // axios.post('/api/upload_profile_pic', {
    //     params: {
    //         fileName: fileName,
    //         fileType: fileType
    //      }
    // })
    //     .then(result =>{
    //         console.log(result);
    //     })
    //     .catch(err =>{
    //         console.log(err);
    //     });

    // Get token for fetch
    const token = localStorage.getItem('jwtToken');
    if(token !== null){
        let config = {
            method: 'POST',
            headers: new Headers({
                Authorization: token,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                fileName: fileName,
                fileType: fileType
            })
        };

        fetch(`/api/upload_profile_pic`, config)
            .then()
            .catch()
    }




};

