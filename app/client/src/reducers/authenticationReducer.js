import {DELETE_CLIENT, SET_SIGNED_IN_USER} from "../actions/types";
import isEmpty from '../validation/is_empty';

const initialisedState = {
    isAuthenticated: false,
    user: {}
}

export default function (state = initialisedState, action) {
    switch (action.type) {
        case SET_SIGNED_IN_USER:
            // return the current state and authenticated
            console.log("Signing in")
            return {
                ...state, // Using the spread operator allows the state to stay immutable, with only the following
                // code being changed in the state.
                // check to see if authentication value is empty (if not empty the user has been authenticated!)
                isAuthenticated: !isEmpty(action.payload),
                // user will have the data of the decoded token
                // this can be called again for logout but pass in an empty user so the user will not be authenticated,
                // and it will be an empty object
                user: action.payload
            }
        case DELETE_CLIENT:
            // return the current state and authenticated
            //console.log(state, action.id)
            return {
                ...state,
                user: {
                    id: state.user.id, // had to reenter id, name, pt, iat, exp, as they were overwriten with nothing otherwise
                    name: state.user.name,
                    pt: state.user.pt,
                    clients: state.user.clients.filter((id) => id.id !== action.id), // this where deleted client is removed
                    iat: state.user.iat,
                    exp: state.user.exp
                }
            }
        default:
            return state;
    }
}