// Used to redirect user if they are not authenticated to view a page
import store from "../store";
import {Redirect, Route} from "react-router-dom";
import isEmpty from "../utilities/is_empty";
import React from "react";

const PrivateRoute = ({component: Component, ...rest}) => {

    let auth = store.getState();

    return(
        <Route
            {...rest}
            render={(props) =>
            {
                if (isEmpty(auth.authenticatedUser)) {
                    // console.log("auth empty - pr")
                    // If direct url used and auth is empty, this will send user to login screen!
                    return <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
                }
                else {
                    if (auth.authenticatedUser.isAuthenticated === true) {
                        // console.log("auth true - pr")
                        return <Component {...props} />
                    }
                    else {
                        // console.log("not logged in - pr")
                        // If direct url used and not logged in, this will send user to login screen!
                        return <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
                    }
                }
            }
            }
        />
    )
}

export default PrivateRoute;
