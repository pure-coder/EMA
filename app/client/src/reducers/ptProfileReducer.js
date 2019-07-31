import {
    GET_PT_PROFILE,
    GET_PT_CLIENTS_DATA,
    GET_CURRENT_CLIENT,
    PROFILE_LOADING,
    CLEAR_CURRENT_PROFILE,
    CLIENT_PROGRESSION,
    CLEAR_PROGRESSION,
} from '../actions/types';

const initialState = {
    pt_data: null,
    current_client: null,
    clients: null,
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
        case CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                pt_data: null,
                current_client: null,
                clients: null,
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
