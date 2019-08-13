import axios from 'axios';
import {
    GET_ERRS,
    SET_SIGNED_IN_USER,
} from "./types"; // import custom defined types
import setAuthorisationToken from '../utilities/setAuthorisationToken';
import jwtDecode from 'jwt-decode';
import {clearErrors, setSuccess, getPtData, clearCurrentProfile} from "./ptProfileActions";
import {clearClientProfile, getClientData} from "./clientProfileActions";

export const manageErrors = (err, dispatch, history) => {
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
        dispatch(clearErrors());
        //history.push('/re-login');
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
                dispatch(getPtData(history))
            }
            else{
                dispatch(getClientData(decodedToken.id, history))
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
    // Remove data based on user (either pt or client)

    // Clear Profile if pt
    dispatch(clearCurrentProfile());

    // Clear Profile if client
    dispatch(clearClientProfile());
};

// RefreshToken
export const refreshToken = () => dispatch => {
    axios
        .get('/api/refreshToken')
        .then(result => {
            if(result){
                // Save JWT to local storage
                const { token } = result.data;
                // Set the token to local storage item 'jwtToken' (local storage can only store strings!)
                localStorage.setItem('jwtToken', token);
                // Set the token to authorisation header
                setAuthorisationToken(token);
                // Decode the token so user data can be used
                const decodedToken = jwtDecode(token);
                dispatch(setSignedInUser(decodedToken));
            }
        })
        .catch(err =>{
            console.log(err);
            }
        )
};
