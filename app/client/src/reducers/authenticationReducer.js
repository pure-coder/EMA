// THIS MUST BE IMPORTED INTO INDEX.JS IN REDUCERS FOLDER

import {PT_CLIENTS, SET_SIGNED_IN_USER, GET_CLIENT_DATA, EDIT_PROFILE} from "../actions/types";
import isEmpty from '../validation/is_empty';

const initialisedState = {
};

export default function (state = initialisedState, action) {
    switch (action.type) {
        case SET_SIGNED_IN_USER:
            // return the current state and authenticated
            // console.log("Signing in")
            return {
                ...state, // Using the spread operator allows the state to stay immutable, with only the following
                // code being changed in the state.
                // check to see if authentication value is empty (if not empty the user has been authenticated!)
                isAuthenticated: !isEmpty(action.payload),
                // user will have the data of the decoded token
                // this can be called again for logout but pass in an empty user so the user will not be authenticated,
                // and it will be an empty object
                user: action.payload
            };
        case PT_CLIENTS:
            // Add pt clients to state
            return {
                ...state, // Using the spread operator allows the state to stay immutable, with only the following
                // code being changed in the state.
                // Add the payload which was returned from from the PT_CLIENTS action in dashboardActions.js
                clients: action.payload
            };
        case GET_CLIENT_DATA:
            return {
                ...state, // Using the spread operator allows the state to stay immutable, with only the following
                // code being changed in the state.
                // Add the payload which was returned from from the PT_CLIENTS action in dashboardActions.js
                client_data: action.payload
            };
        case EDIT_PROFILE:
            return {
                ...state,
                clientId: action.payload
            };
        default:
            return state;
    }
}
