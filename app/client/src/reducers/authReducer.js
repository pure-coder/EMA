import {TEST_DISPATCH} from "../actions/types";

const initialisedState = {
    isAuthenticated: false,
    user: {}
}

export default function (state = initialisedState, action) {
    switch (action.type) {
        case TEST_DISPATCH:
            return {
                // Using spread operator to add to the initialised state
                ...state,
                user: action.payload // This sets the user data that was defined in initialisedState to the payload that
                                    // was defined in authenticationActions.js
            }
        default:
            return state;
    }
}