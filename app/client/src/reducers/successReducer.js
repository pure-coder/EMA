import {
    SUCCESS,
    CLEAR_SUCCESS
} from "../actions/types";

const initialisedState = {};

export default function (state = initialisedState, action) {
    switch (action.type) {
        case SUCCESS:
            return action.payload; // Here the payload errors will be returned (was defined in actions/authenticationActions.js)
        case CLEAR_SUCCESS:
            return{};
        default:
            return state;
    }
}
