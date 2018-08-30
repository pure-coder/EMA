import {POST_WORKOUT_DATA_TO_DATABASE} from "../actions/types";
import isEmpty from '../validation/is_empty';

const initialisedState = {
    isAuthenticated: false,
    user: {}
}

export default function (state = initialisedState, action) {
    switch (action.type) {
        case POST_WORKOUT_DATA_TO_DATABASE:
            // return the current state and authenticated
            return {
                ...state,
                // check to see if authentication value is empty (if not empty the user has been authenticated!)
                isAuthenticated: !isEmpty(action.payload),
                // user will have the data of the decoded token
                // this can be called again for logout but pass in an empty user so the user will not be authenticated,
                // and it will be an empty object
                user: action.payload
            }
        default:
            return state;
    }
}