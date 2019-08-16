import {
    GET_CLIENT_PROFILE,
    PROFILE_LOADING,
    CLIENT_PROGRESSION,
    CLEAR_PROGRESSION,
    CLEAR_CLIENT_PROFILE,
    GET_PROFILE_NOTES,
    CLEAR_PROFILE_NOTES,
    BODY_BIO_CLIENT,
    CLEAR_BODY_BIO_CLIENT,
    UPDATE_PROFILE_PIC_CLIENT
} from '../actions/types';

const initialState = {
    client_data: null,
    profile_notes: null,
    body_bio: null,
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
        case BODY_BIO_CLIENT:
            return {
                ...state,
                body_bio: action.payload
            };
        case CLEAR_BODY_BIO_CLIENT:
            return {
                ...state,
                body_bio: null
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
        case UPDATE_PROFILE_PIC_CLIENT:
            return {
                ...state,
                client_data: {
                    ...state.client_data,
                    ProfilePicUrl: action.payload
                }
            };
        default:
            return state;
    }
}
