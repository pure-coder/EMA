import axios from "axios";
import {GET_ERRS, PT_CLIENTS} from "./types";

// Get pt Clients
export const getClients = ptid => dispatch => {
    axios
        .get(`/api/pt_clients/${ptid}`)
        .then(result => {
            // console.log("called in actions")
            // console.log(result.data)
            //return {clients : result.data}

            // dispatch this action to the action below so the data can be sent to the respective reducer
            dispatch(setPtClients(result.data))
            }
        )
        .catch(err => {
            console.log(err)

        })
};

// Used to send data from getClients action above to the reducer in dashboardReducer.js
export const setPtClients = (data) => {
    return{
        type: PT_CLIENTS,
        payload: data
    }
}

// Delete Client
export const deleteClient = id => dispatch => {
    axios
        .delete(`/api/delete_client/${id}`)
        .then(() => {
            // console.log("deleted user")
            // dispatch({
            //
            // })
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