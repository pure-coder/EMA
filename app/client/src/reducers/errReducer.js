import {GET_ERRS, PASSWORD_ERROR} from "../actions/types";

const initialisedState = {};

export default function (state = initialisedState, action) {
    switch (action.type) {
        case GET_ERRS:
            return action.payload; // Here the payload errors will be returned (was defined in actions/authenticationActions.js)
        case PASSWORD_ERROR:
            return action.payload
        default:
            return state;
    }
}
