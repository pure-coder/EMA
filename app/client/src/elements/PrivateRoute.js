// Used to redirect user if they are not authenticated to view a page
import store from "../store";
import {Redirect, Route} from "react-router-dom";
import React from "react";

const PrivateRoute = ({component: Component, ...rest}) => (
            <Route
            {...rest}
            render={
                props =>
                    store.getState().authenticatedUser.isAuthenticated ? (<Component {...props} />):
                        (<Redirect to={{pathname: '/re-login'}}/>)
            }
        />
);

export default PrivateRoute;
