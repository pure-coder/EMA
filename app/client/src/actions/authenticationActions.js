import axios from 'axios';
import {
    GET_ERRS,
    SET_SIGNED_IN_USER,
    PT_CLIENTS,
    GET_CLIENT_DATA,
    GET_PT_DATA,
    SAVE_CLIENT_ID,
    LOGGED_OUT,
    PASSWORD_ERROR,
    CLIENT_PROGRESSION,
    CLEAR_PROGRESSION,
    SUCCESS
} from "./types"; // import custom defined types
import setAuthorisationToken from '../utilities/setAuthorisationToken';
import jwtDecode from 'jwt-decode';
import isEmpty from '../utilities/is_empty';

const manageErrors = (err, dispatch, history) => {
    console.log(err.response);
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
        dispatch(setErrors({}));
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

// Register User
// Used to dispatch (action) data to a reducer, in this case it is the registerUser action with the sign up data
// from the redux store (the state) entered in the register route and handled by Register.js in components/authentication folder.
// Note that dispatch is an asynchronous function - redux thunk allows asynchronous functions to be used as actions,
//
// dispatch is used to trigger the action (change) so with the dispatch function being the function call of registerUser
// (Data and history are the parameters of said registerUser) allows dispatch to be used (via the thunk package),
// thus allowing the result to be passed to the dispatch function, the dispatch function is called via the connect function in the component.
//
// history is passed in from register.js onSubmit so it can be used to direct the user to another link/route
export const registerUser =(Data, history) => (dispatch) => {
    // Post user data to the API specifically the user/register route
    axios
        .post('/api/register', Data)
        .then(result => {
            // If registering was successful (having status code of 200) then redirect user to login page
            if(result.status === 200){
                dispatch(setSuccess("Client added successfully."));
            }
        }) // Uses history.push to direct the user
        .catch(err => {
            manageErrors(err, dispatch, history)
        }
    );
}; // registerUser

// Login User - get JWT for user
export const loginUser = (Data, history) => (dispatch) => {
    // Post user data to the API specifically the user/register route
    axios
        .post('/api/login', Data)
        .then(result => {
            // Save JWT to local storage
            const { token } = result.data;
            // Set the token to local storage item 'jwtToken' (local storage can only store strings!)
            localStorage.setItem('jwtToken', token);
            // Set the token to authorisation header
            setAuthorisationToken(token);
            // Decode the token so user data can be used
            const decodedToken = jwtDecode(token);
            // Set the current signedIn user (with setSignedInUser function below), this adds the object returned by the
            // result.data (which was put into token, then token was decoded and put into decodedToken). The object
            // data is sent to setSignedInUser which is then added to the store under user, which is in InitialisedState
            // in authenticatedReducer.js
            dispatch(setSignedInUser(decodedToken));
            if (decodedToken.pt === true) {
                dispatch(getClients(decodedToken.id, history))
            }
        })
        .catch(err => {
                dispatch({
                    type: GET_ERRS,
                    payload: err.response.data
                })
            }
        );
}; // loginUser

// Set signed in user
export const setSignedInUser = (decodedToken) => {
    // dispatch this to reducer/action
    return {
        type: SET_SIGNED_IN_USER,
        payload: decodedToken
    }
}; // setSignedInUser

// Log out the user
export const logOutUser = () => dispatch => {
    // Remove the token from local storage
    localStorage.removeItem('jwtToken');
    // Remove the token from authorisation header for all future requests
    // setAuthorisationToken checks passed parameter for a token or false value (false deletes the header token)
    setAuthorisationToken(false);
    // Set signed in user to an empty object and isAuthenticated to false by passing in {} (empty object)
    dispatch(setSignedInUser({}));
    // remove state from local storage
    localStorage.removeItem('state');
    dispatch({
        type: LOGGED_OUT
    })
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
        type: PT_CLIENTS,
        payload: data
    }
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

export const getClientData = (id, history) => dispatch => {
    axios
        .get(`/api/client/${id}`)
        .then(result => {
            dispatch({
                type: GET_CLIENT_DATA,
                payload: result.data
            })
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
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

export const getPtData = (id, history) => dispatch => {
    axios
        .get(`/api/personal_trainer/${id}`)
        .then(result => {
                // If no data is returned (no data === string) then direct user to error page
                if (typeof result.data === "string"){
                    history.replace('/error_page');
                }
                dispatch({
                    type: GET_PT_DATA,
                    payload: result.data
                })
            }
        )
        .catch(err => {
            manageErrors(err, dispatch, history);
        })
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

export const saveClientId = (id) => dispatch => {
    dispatch({
        type: SAVE_CLIENT_ID,
        payload: id
    });
};

export const passwordsMatchError = (error) => dispatch => {
    dispatch ({
        type: PASSWORD_ERROR,
        payload: error
        }
    )
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
            dispatch(getClientProgression(uid, cid, history));
        })
        .catch(err => {
            manageErrors(err, dispatch, history);
        });
};

export const setErrors = (error) => dispatch => {
    // If error hasn't been defined then make error an empty object
    if(isEmpty(error)){
        error = {};
    }
    dispatch({
        type: GET_ERRS,
        payload: error
    })
};

export const setSuccess = (message) => dispatch => {
    // If error hasn't been defined then make error an empty object
    if(isEmpty(message)){
        message = {};
    }
    dispatch({
        type: SUCCESS,
        payload: {msg : message}
    });
};


export const clearErrors = () => dispatch => {
    dispatch({
        type: GET_ERRS,
        payload: {}
    })
};

