import axios from "axios";
import {GET_ERRS} from "./types";
import {DELETE_CLIENT} from "./types";

// Delete Client
export const deleteClient = id => dispatch => {
    axios
        .delete(`/api/delete_client/${id}`)
        .then(() => {
            // console.log("deleted user")
            dispatch({
                type: DELETE_CLIENT,
                id: id
            })
            }
        )
        .catch(err => {
            console.log(err)
            dispatch({
                type: GET_ERRS,
                payload: {msg: "Error"}
            })
        })
};