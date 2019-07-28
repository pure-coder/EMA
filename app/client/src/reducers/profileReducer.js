import {
    GET_PROFILE,
    GET_CLIENT_DATA,
    PROFILE_LOADING,
    CLEAR_CURRENT_PROFILE,
} from '../actions/types';

const initialState = {
    profile: null,
    loading: false
};


export default function(state = initialState, action) {
    switch (action.type) {
        case PROFILE_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_PROFILE:
            return {
                ...state,
                user_data: action.payload,
                loading: false
            };
        case GET_CLIENT_DATA:
            return {
                ...state,
                clients: action.payload,
                loading: false
            };
        case CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                profile: null
            };
        default:
            return state;
    }
}
