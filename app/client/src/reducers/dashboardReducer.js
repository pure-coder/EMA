// THIS MUST BE IMPORTED INTO INDEX.JS IN REDUCERS FOLDER

import {PT_CLIENTS} from "../actions/types";

// intialised State must be defined for states to be added to store, which is dictated in store.js
const initialisedState = {
    clients: null
}

export default function (state = initialisedState, action) {
    switch (action.type) {
        case PT_CLIENTS:
            // Add pt clients to state
            // console.log("called in reducers")
            return {
                ...state, // Using the spread operator allows the state to stay immutable, with only the following
                // code being changed in the state.
                // Add the payload which was returned from from the PT_CLIENTS action in dashboardActions.js
                clients : action.payload
            }
        default:
            return state;
    }
}