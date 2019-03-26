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
        .then(response => {
            // If registering was successful (having status code of 200) then redirect user to login page
            if (response.status === 200)
            history.push('/login')
        }) // Uses history.push to direct the user
        .catch(err => {
            dispatch({ // if an error occurs dispatch is called to send the data as an object to the
                // redux store, in this case the err data
                type: GET_ERRS,
                payload: err.response.data // Puts err data into the payload which will be sent to the redux store
            })
        }
    );
}; // registerUser

// Login User - get JWT for user

export const loginUser = (Data) => (dispatch) => {
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
                dispatch(getClients(decodedToken.id))
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
export const registerClient =(Data, props) => (dispatch) => {
    // Post user data to the API specifically the user/register route
    axios
        .post('/api/new_client', Data)
        .then(response => {
            // If registering was successful (having status code of 200) then redirect user to login page
            if (response.status === 200)
                props.history.push('/login')
        }) // Uses history.push to direct the user) // Uses history.push to direct the user history.push('/login')
        .catch(err => {
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
            }
            else {
                dispatch({
                    type: GET_ERRS,
                    payload: err.response.data
                })
            }
            }
        );
}; // registerClient

// Get pt Clients
export const getClients = ptId => dispatch => {
    axios
        .get(`/api/pt_clients/${ptId}`)
        .then(result => {
                // return {clients : result.data}
                // dispatch this action to the action below so the data can be sent to the respective reducer
                dispatch(setPtClients(result.data))
            }
        )
        .catch(err => {
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
            }
            else {
                dispatch({
                    type: GET_ERRS,
                    payload: err.response.data
                })
            }
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
export const deleteClient = (id, ptId) => dispatch => {
    axios
        .delete(`/api/delete_client/${id}`)
        .then(() => {
                // causes refresh of dashboard with updated client list
                dispatch(getClients(ptId))
            }
        )
        .catch(err => {
            // if(err.response.status === 401){
            //     window.location.href = '/re-login';
            //     dispatch(logOutUser());
            // }
            // else {
                dispatch({
                    type: GET_ERRS,
                    payload: {msg: err}
                })
            // }
        })
};

export const getClientData = (id, history) => dispatch => {
    axios
        .get(`/api/client/${id}`)
        .then(result => {
            // If no data is returned (no data === string) then direct user to error page
            if (typeof result.data === "string"){
                history.replace('/error_page');
            }
            dispatch({
                type: GET_CLIENT_DATA,
                payload: result.data
            })
        }
        )
        .catch(err => {
            // if(err.response.status === 401){
            //     window.location.href = '/re-login';
            //     dispatch(logOutUser());
            // }
            // else {
                dispatch({
                    type: GET_ERRS,
                    payload: {msg: err}
                })
            // }
        })
};

export const editClientData = (id, Data, history) => dispatch => {
    axios
        .put(`/api/edit_client/${id}`, Data)
        .then(() => {
            // Go back to dashboard after successful update
            history.goBack();
            }
        )
        .catch(err => {
            //errCheck(err, dispatch);
            dispatch({
                type: GET_ERRS,
                payload: err.response.data
            })
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
            }
            else {
                dispatch({
                    type: GET_ERRS,
                    payload: err.response.data
                })
            }
        })
};

export const editPtData = (id, Data, history) => dispatch => {
    axios
        .put(`/api/edit_personal_trainer/${id}`, Data)
        .then(() => {
                // Go back to dashboard after successful update
                history.goBack();
            }
        )
        .catch(err => {
            //errCheck(err, dispatch);
            dispatch({
                type: GET_ERRS,
                payload: err.response.data
            })
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

export const getClientProgression = (userId, clientId) => dispatch => {
    // userId can either be same as clientId or the id of the personal trainer
    axios.get(`/api/${userId}/client_progression/${clientId}` ) // using grave accent instead of single quote
        .then(result => {
                dispatch({
                    type: CLIENT_PROGRESSION,
                    payload: result.data
                });
        })
        .catch(err => {
            //errCheck(err, dispatch);
            dispatch({
                type: GET_ERRS,
                payload: err.response.data
            })
        });
};

export const clearProgression = () => dispatch => {
    dispatch({
        type: CLEAR_PROGRESSION
    });
};

export const newClientProgress = (id, cid ,data) => dispatch => {
    axios.post(`/api/${id}/client_progression/${cid}`, data)
        .then(result => {
            console.log("client_p", result);
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
            //errCheck(err, dispatch);
            dispatch({
                type: GET_ERRS,
                payload: err.response.data
            })
        });
};

export const deleteExercise =(uid, cid, data) => dispatch => {
    axios.delete(`/api/${uid}/client_progression/${cid}`, {data : {exerciseName : data}})
        .then(() => {
            dispatch(getClientProgression(uid, cid));
        })
        .catch(err => {
            // if(err.response.status === 401){
            //     window.location.href = '/re-login';
            //     dispatch(logOutUser());
            // }
            // else {
                dispatch({
                    type: GET_ERRS,
                    payload: err
                })
            // }
        });
};

export const setErrors = (error) => dispatch => {
    dispatch({
        type: GET_ERRS,
        payload: error
    })
};

export const setSuccess = (message) => dispatch => {
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

