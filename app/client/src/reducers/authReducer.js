import { TEST_DISPATCH} from "../actions/types";

const initialisedState = {
    isAuthenticated: false,
    user: {}
}

export default function (state = initialisedState, action) {
    switch (action.type) {
        default:
            return state;
    }
}