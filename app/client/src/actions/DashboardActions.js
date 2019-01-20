import axios from "axios";
import {GET_ERRS} from "./types";

// Get pt Clients
export const getClients = ptid => dispatch => {
    axios
        .delete(`/api/pt_clients/${ptid}`)
        .then(result => {
                dispatch({
                    type: PT_CLIENTS,
                    payload: result
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