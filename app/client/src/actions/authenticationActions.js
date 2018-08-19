import {TEST_DISPATCH} from "./types";

// Register User
import {TEST_DISPATCH} from "./types";

// Used to dispatch (action) data to a reducer
export const registerUser =(Data) => {
    return {
        // Type is the only requirement that MUST be returned, other key value data can be added.
        type: TEST_DISPATCH
        payload: Data
    }
}