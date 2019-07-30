import {
    GET_CLIENT_PROFILE,
    PROFILE_LOADING,
    CLEAR_CURRENT_PROFILE,
    CLIENT_PROGRESSION,
    CLEAR_PROGRESSION,
} from '../actions/types';

const initialState = {
    client_data: null,
    loading: false
};


export default function(state = initialState, action) {
    switch (action.type) {
        case PROFILE_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_CLIENT_PROFILE:
            return {
                ...state,
                client_data: action.payload,
                loading: false
            };
        case CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                client_data: null,
                client_progression: null,
            };
        case CLIENT_PROGRESSION:
            return {
                ...state,
                client_Progression: action.payload
            };
        case CLEAR_PROGRESSION:
            return {
                ...state,
                client_Progression: null
            };
        default:
            return state;
    }
}
