import {PT_CLIENTS, SET_SIGNED_IN_USER} from "../actions/types";
import isEmpty from "../validation/is_empty";

export default function (state = initialisedState, action) {
    switch (action.type) {
        case PT_CLIENTS:
            // Add pt clients to state
            return {
                ...state, // Using the spread operator allows the state to stay immutable, with only the following
                // code being changed in the state.
                // Add the payload which was returned from from the PT_CLIENTS action in dashboardActions.js
                clients: action.payload
            }
        default:
            return state;
    }
}