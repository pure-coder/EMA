import axios from "axios";
import {GET_ERRS, PT_CLIENTS} from "./types";

// Get pt Clients
export const getClients = ptid => dispatch => {
    axios
        .get(`/api/pt_clients/${ptid}`)
        .then(result => {
            // console.log("called in actions")
                dispatch({
                    type: PT_CLIENTS,
                    payload: result.data
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

// Delete Client
export const deleteClient = id => dispatch => {
    axios
        .delete(`/api/delete_client/${id}`)
        .then(() => {
            // console.log("deleted user")
            dispatch({

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