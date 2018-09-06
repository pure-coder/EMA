import axios from 'axios';
import {GET_ERRS} from "./types"; // import custom defined types
import {SET_SIGNED_IN_USER} from "./types"; // import custom defined types
// import {POST_WORKOUT_DATA_TO_DATABASE} from "./types"; // import custom defined types
import setAuthorisationToken from '../utilities/setAuthorisationToken';
import jwtDecode from 'jwt-decode';

// Register User
// Used to dispatch (action) data to a reducer, in this case it is the registerUser action with the sign up data
// from the redux state entered in the register route and handled by Register.js in components/authentication folder.
// Note that dispatch is an asynchronous function - redux thunk allows asynchronous functions to be used as actions.
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
        .catch(err =>
        dispatch({ // if an error occurs dispatch is called to send the data as an object to the
                   // redux store, in this case the err data
            type: GET_ERRS,
            payload: err.response.data // Puts err data into the payload which will be sent to the redux store
        })
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
            // Set the current signedIn user
            dispatch(setSignedInUser(decodedToken));
        })
        .catch(err =>
            dispatch({ // if an error occurs dispatch is called to send the data as an object to the
                // redux store, in this case the err data
                type: GET_ERRS,
                payload: err.response.data // Puts err data into the payload which will be sent to the redux store
            })
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
    dispatch(setSignedInUser({}))
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
        .catch(err =>
            dispatch({ // if an error occurs dispatch is called to send the data as an object to the
                // redux store, in this case the err data
                type: GET_ERRS,
                payload: err.response.data // Puts err data into the payload which will be sent to the redux store
            })
        );
}; // registerUser

export const dashboard =(Data, history) => (dispatch) => {
    // Post user data to the API specifically the user/register route
    axios
        .post( )
        .then(response => {

        }) // Uses history.push to direct the user
        .catch(err =>
            dispatch({ // if an error occurs dispatch is called to send the data as an object to the

            })
        );
}; // registerUser

