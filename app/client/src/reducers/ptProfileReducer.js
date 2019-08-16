import {
    GET_PT_PROFILE,
    GET_PT_CLIENTS_DATA,
    GET_CURRENT_CLIENT,
    PROFILE_LOADING,
    CLEAR_CURRENT_PROFILE,
    PT_CLIENT_PROGRESSION,
    CLEAR_PROGRESSION,
    CLEAR_CURRENT_CLIENT,
    SCHEDULER,
    CLEAR_WORKOUT_DATA,
    GET_CLIENT_PROFILE_NOTES,
    CLEAR_CLIENT_PROFILE_NOTES,
    PT_CLIENT_BODY_BIO,
    CLEAR_BODY_BIO,
    UPDATE_PROFILE_PIC_PT, UPDATE_PROFILE_PIC_CURRENT_CLIENT
} from '../actions/types';

const initialState = {
    pt_data: null,
    current_client: null,
    clients: null,
    scheduler: null,
    profile_notes: null,
    body_bio: null,
    loading: false
};


export default function(state = initialState, action) {
    switch (action.type) {
        case PROFILE_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_PT_PROFILE:
            return {
                ...state,
                pt_data: action.payload,
                loading: false
            };
        case GET_PT_CLIENTS_DATA:
            return {
                ...state,
                clients: action.payload,
                loading: false
            };
        case GET_CURRENT_CLIENT:
            return {
                ...state,
                current_client: action.payload,
                loading: false
            };
        case PT_CLIENT_BODY_BIO:
            return {
                ...state,
                body_bio: action.payload,
            };
        case CLEAR_BODY_BIO:
            return {
                ...state,
                body_bio: null,
            };
        case GET_CLIENT_PROFILE_NOTES:
            return {
                ...state,
                profile_notes: action.payload
            };
        case CLEAR_CLIENT_PROFILE_NOTES:
            return {
                ...state,
                profile_notes: null
            };
        case CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                pt_data: null,
                current_client: null,
                clients: null,
                client_progression: null,
            };
        case CLEAR_CURRENT_CLIENT:
            return {
                ...state,
                current_client: null
            };
        case PT_CLIENT_PROGRESSION:
            return {
                ...state,
                client_progression: action.payload
            };
        case CLEAR_PROGRESSION:
            return {
                ...state,
                client_progression: null
            };
        case SCHEDULER:
            return {
                ...state,
                scheduler: action.payload,
            };
        case CLEAR_WORKOUT_DATA:
            return {
                ...state,
                scheduler: null
            };
        case UPDATE_PROFILE_PIC_PT:
            return {
                ...state,
                pt_data: {
                    ...state.pt_data,
                    ProfilePicUrl: action.payload
                }
            };
        case UPDATE_PROFILE_PIC_CURRENT_CLIENT:
            return {
                ...state,
                current_client: {
                    ...state.current_client,
                    ProfilePicUrl: action.payload
                }
            };
        default:
            return state;
    }
}
