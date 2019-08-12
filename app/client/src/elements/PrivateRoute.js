// Used to redirect user if they are not authenticated to view a page
import store from "../store";
import {Redirect, Route} from "react-router-dom";
import React from "react";
import {checkExp} from "../utilities/checkExp";

const PrivateRoute = ({component: Component, ...rest}) => {

    const auth = store.getState();
    const {isAuthenticated} = auth.authenticatedUser;

    return(
        <Route
            {...rest}
            render={(props) =>
            {
                checkExp(store);
                if (!isAuthenticated) {
                    // console.log("auth empty - pr")
                    // If direct url used and auth is empty, this will send user to login screen!
                    return <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
                }
                else {
                    return <Component {...props} />
                }
            }
            }
        />
    )
}

export default PrivateRoute;
