import axios from 'axios';
import {GET_ERRS} from "./types";

// Register User
// Used to dispatch (action) data to a reducer, in this case it is the registerUser action with the sign up data
// from the redux state entered in the register route and handled by Register.js in components/authentication folder.

// Note that dispatch is an asynchronous function - redux thunk allows asynchronous functions to be used as actions.
// history is passed in from register.js onSubmit so it can be used to direct the user to another link/route
export const registerUser =(Data, history) => (dispatch) => {
    // Post user data to the API specifically the user/register route
    axios
        .post('/api/register', Data)
        .then(result => history.push('/login')) // Uses history.push to direct the user
        .catch(err =>
        dispatch({ // if an error occurs dispatch is called to send the data as an object to the
                   // redux store, in this case the err data
            type: GET_ERRS,
            payload: err.response.data // Puts err data into the payload which will be sent to the redux store
        })
    );
}