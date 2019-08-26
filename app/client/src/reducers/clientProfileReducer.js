import {
    GET_CLIENT_PROFILE,
    CLIENT_PROFILE_LOADING,
    CLIENT_PROGRESSION,
    CLEAR_PROGRESSION,
    CLEAR_CLIENT_PROFILE,
    GET_PROFILE_NOTES,
    CLEAR_PROFILE_NOTES,
    BODY_BIO_CLIENT,
    CLEAR_BODY_BIO_CLIENT,
    UPDATE_PROFILE_PIC_CLIENT,
    CLIENT_PROFILE_EDITED,
    PT_CLIENT_PROFILE_EDITED
} from '../actions/types';

const initialState = {
    client_data: null,
    profile_notes: null,
    body_bio: null,
    client_progression: null,
    clientLoading: false
};


export default function(state = initialState, action) {
    switch (action.type) {
        case CLIENT_PROFILE_LOADING:
            return {
                ...state,
                clientLoading: true
            };
        case GET_CLIENT_PROFILE:
            return {
                ...state,
                client_data: action.payload,
                clientLoading: false
            };
        case CLEAR_CLIENT_PROFILE:
            return {
                ...initialState
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
        case CLIENT_PROFILE_EDITED:
            return {
                ...state,
                client_data: action.payload
            };
        case PT_CLIENT_PROFILE_EDITED:
            return {
                ...state,
                client_data: action.payload
            };
        default:
            return state;
    }
}
