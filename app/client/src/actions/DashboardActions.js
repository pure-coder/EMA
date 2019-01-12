import axios from "axios";
import {GET_ERRS} from "./types";
import {DELETE_CLIENT} from "./types";

// Delete Client
export const deleteClient = id => dispatch => {

    axios
        .delete(`/api/delete_client/${id}`)
        .then(function (response){
            console.log("deleted user hard")
            dispatch({type: DELETE_CLIENT})
            }
        )
        .catch(err => {
            dispatch({
                type: GET_ERRS,
                payload: err.response.data
            })
        })
};