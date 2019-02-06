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
                    return <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
                }
                else {
                    if (auth.authenticatedUser.isAuthenticated === true) {
                        return <Component {...props} />
                    }
                    else {
                        return <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
                    }
                }
            }
            }
        />
    )
}

export default PrivateRoute;
