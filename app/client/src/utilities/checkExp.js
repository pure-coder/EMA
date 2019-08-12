import {logOutUser} from "../actions/authenticationActions";

export const checkExp = (store) => {
    const expiredTime = (store.authenticatedUser.user.exp * 1000);
    const currentTime = Date.now();
    if (expiredTime < currentTime) {
        // Log the user out
        store.dispatch(logOutUser());
        // Redirect the user to the login page
        window.location.href = '/re-login';
    } // if decodedToken

};
