// Used to redirect user if they are not authenticated to view a page
import store from "../store";
import {Redirect, Route} from "react-router-dom";
import React from "react";

const PrivateRoute = ({component: Component, ...rest}) => {

    const props = {...rest};
    // console.log(props.location.pathname);
    console.log(props);
    // console.log(props.computedMatch.path)
    // console.log(props.computedMatch.url)

    return (
        <Route
            {...rest}
            render={
                props =>{
                    // console.log(<Component {...props}/>)
                     return store.getState().authenticatedUser.isAuthenticated ? (<Component {...props} />) :
                        (<Redirect from={props.location.pathname} to={{pathname: '/re-login'}} />)
                    }
            }
        />
    )
};

export default PrivateRoute;
