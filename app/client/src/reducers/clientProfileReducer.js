import {
    GET_CLIENT_PROFILE,
    PROFILE_LOADING,
    CLIENT_PROGRESSION,
    CLEAR_PROGRESSION,
    CLEAR_CLIENT_PROFILE,
    GET_PROFILE_NOTES,
    CLEAR_PROFILE_NOTES
} from '../actions/types';

const initialState = {
    client_data: null,
    profile_notes: null,
    client_progression: null,
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
        case CLEAR_CLIENT_PROFILE:
            return {
                ...state,
                client_data: null,
                client_progression: null,
            };
        case GET_PROFILE_NOTES:
            return {
                ...state,
                profile_notes: action.payload
            };
        case CLEAR_PROFILE_NOTES:
            return {
                ...state,
                profile_notes: null
            };
        case CLIENT_PROGRESSION:
            return {
                ...state,
                client_progression: action.payload
            };
        case CLEAR_PROGRESSION:
            return {
                ...state,
                client_progression: null
            };
        default:
            return state;
    }
}
