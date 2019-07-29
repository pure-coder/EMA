import {
    GET_PROFILE,
    GET_PT_CLIENTS_DATA,
    PROFILE_LOADING,
    CLEAR_CURRENT_PROFILE,
    //SAVE_CLIENT_ID,
    CLIENT_PROGRESSION,
    CLEAR_PROGRESSION,
} from '../actions/types';

const initialState = {
    user_data: null,
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
        case GET_PT_CLIENTS_DATA:
            return {
                ...state,
                clients: action.payload,
                loading: false
            };
        case CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                user_data: null,
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

// export default function (state = initialisedState, action) {
//     switch (action.type) {
//         case SAVE_CLIENT_ID:
//             return {
//                 ...state,
//                 clientId: action.payload
//             };
//         default:
//             return state;
//     }
// }
