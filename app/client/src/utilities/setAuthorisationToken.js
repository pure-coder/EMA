import axios from 'axios';

// Called from App.js
const setAuthorisationToken = (token) => {
    // Check if the token exists
    if(token){
        // Apply token to every request (main reason for using axios over fetch)
        axios.defaults.headers.common['Authorization'] = token;
    }
    // if token doesn't exist then delete the authorisation header
    else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export default setAuthorisationToken;