import axios from 'axios';
import 'dhtmlx-scheduler';
import {
    GET_PT_PROFILE,
    PROFILE_LOADING,
    CLEAR_CURRENT_PROFILE,
    GET_PT_CLIENTS_DATA,
    PT_CLIENT_PROGRESSION,
    CLEAR_PROGRESSION,
    PASSWORD_ERROR,
    GET_ERRS,
    SUCCESS,
    GET_CURRENT_CLIENT,
    CLEAR_CURRENT_CLIENT,
    SCHEDULER,
    CLEAR_WORKOUT_DATA
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
        dispatch(clearCurrentProfile());
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
export const getClients = (ptId, history) => dispatch => {
    axios
        .get(`/api/pt_clients/${ptId}`)
        .then(result => {
                // return {clients : result.data}
                // dispatch this action to the action below so the data can be sent to the respective reducer
                dispatch(setPtClients(result.data))
            }
        )
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
};

// Used to send data from getClients action above to the reducer in dashboardReducer.js
export const setPtClients = (data) => {
    // console.log("set pt clients", data)
    return{
        type: GET_PT_CLIENTS_DATA,
        payload: data
    }
};

export const getPtData = (id, history) => dispatch => {
    dispatch(setProfileLoading());
    axios
        .get(`/api/personal_trainer/${id}`)
        .then(result => {
                // If no data is returned (no data === string) then direct user to error page
                if (typeof result.data === "string"){
                    history.replace('/error_page');
                }
                dispatch({
                    type: GET_PT_PROFILE,
                    payload: result.data
                })
            }
        )
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
};

export const getCurrentClient = (id, history) => dispatch => {
    dispatch(setProfileLoading());
    axios
        .get(`/api/client/${id}`)
        .then(result => {
            dispatch({
                type: GET_CURRENT_CLIENT,
                payload: result.data
            })
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

export const editPtData = (id, Data, history) => dispatch => {
    axios
        .put(`/api/edit_personal_trainer/${id}`, Data)
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

export const editClientData = (cid, data, history) => dispatch => {
    axios
        .put(`/api/edit_client/${cid}`, data)
        .then(result => {
            if(result.status === 200){
                dispatch(setSuccess("Client data successfully updated."))
            }
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
};

// Delete Client
export const deleteClient = (id, ptId, history) => dispatch => {
    axios
        .delete(`/api/delete_client/${id}`)
        .then(result => {
            // causes refresh of dashboard with updated client list
            if(result.status === 200) {
                dispatch(getClients(ptId, history));
                dispatch(setSuccess("Client deleted successfully."));
            }
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
};

export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
};

export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
};

export const passwordsMatchError = (error) => dispatch => {
    dispatch ({
            type: PASSWORD_ERROR,
            payload: error
        }
    )
};

export const ptGetClientProgression = (userId, clientId, history) => dispatch => {
    // userId can either be same as clientId or the id of the personal trainer
    axios.get(`/api/${userId}/client_progression/${clientId}` ) // using grave accent instead of single quote
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

export const clearCurrentClient = () => dispatch => {
    dispatch({
        type: CLEAR_CURRENT_CLIENT
    });
};

export const clearProgression = () => dispatch => {
    dispatch({
        type: CLEAR_PROGRESSION
    });
};

export const newClientProgress = (id, cid ,data, history) => dispatch => {
    axios.post(`/api/${id}/client_progression/${cid}`, data)
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

export const deleteExercise =(uid, cid, data, history) => dispatch => {
    axios.delete(`/api/${uid}/client_progression/${cid}`, {data : {exerciseName : data}})
        .then(() => {
            dispatch(ptGetClientProgression(uid, cid, history));
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

export const editClientExercise =(uid, cid, exerciseId, data, history) => dispatch => {
    axios.put(`/api/${uid}/client_progression/${cid}`,
        {data :
                {
                    exerciseId: exerciseId,
                    newMetrics: data
                }
        })
        .then( result => {
            dispatch(setSuccess(result.data.msg));
            dispatch(ptGetClientProgression(uid, cid, history));
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

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

export const setSuccess = (message) => dispatch => {
    dispatch({
        type: SUCCESS,
        payload: {
            type: "SUCCESS",
            msg: message
        }
    });
};


export const clearErrors = () => dispatch => {
    dispatch({
        type: GET_ERRS,
        payload: {}
    })
};

export const clearSuccess = () => dispatch => {
    dispatch({
        type: SUCCESS,
        payload: {}
    })
};

export const workoutScheduler = (uid, cid) => dispatch => {
    axios.get(`/api/${uid}/scheduler/${cid}`)
        .then(result => {
            if (result) {
                dispatch({
                    type: SCHEDULER,
                    payload: result.data
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
};

export const clearWorkoutData = () => dispatch => {
    dispatch({
            type: CLEAR_WORKOUT_DATA
    })
};
