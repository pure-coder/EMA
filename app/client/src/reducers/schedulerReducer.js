import {POST_WORKOUT_DATA_TO_DATABASE} from "../actions/types";
import isEmpty from '../validation/is_empty';

const initialisedState = {
    data: {}
}

export default function (state = initialisedState, action) {
    switch (action.type) {
        case POST_WORKOUT_DATA_TO_DATABASE:
            // return the current state and authenticated
            return {
                ...state,
                data: action.payload
            }
        default:
            return state;
    }
}