// Used to redirect user if they are not authenticated to view a page
import store from "../../../store";
import {Redirect, Route} from "react-router-dom";
import React from "react";

const PrivateRoute = ({component: Component, ...rest}) => {

    // const props = {...rest};
    // console.log(props.location.pathname);
    // console.log(props);
    return (
        <Route
            {...rest}
            render={
                props =>{
                    return store.getState().authenticatedUser.isAuthenticated ? (<Component {...props} />) :
                        (<Redirect from={props.location.pathname} to={{pathname: '/re-login'}} />)
                }
            }
        />
    )
};

export default PrivateRoute;
