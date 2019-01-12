import axios from "axios";
import {GET_ERRS} from "./types";

// Delete Client
export const deleteClient = id => dispatch => {
    axios
        .delete(`/api/delete_client/${id}`)
        .then(res => {

    }
        )
        .catch(err => {
            dispatch({
                type: GET_ERRS,
                payload: err.response.data
            })
        })
};