import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'; // mimics server allowing back, forward page routing etc
import {Provider} from 'react-redux'; // A react component that provides the store (holds state/data for app) for redux
import store from './store'; // Imports store to be used with redux to hold application state
import isEmpty from './utilities/is_empty';
import 'axios';
/*import navbar component*/
import Navigation from './components/layout/Navigator';
/*import landing_page component*/
import Landing_page from './components/layout/Landing_page';
/*import footer component*/
import Footer from './components/layout/Footer';
/*import register component*/
import Register from './components/authentication/Register';
/*import register client component*/
import RegisterClient from './components/authentication/RegisterClient';
/*import login component*/
import Login from './components/authentication/Login';
/*import scheduler component*/
import Scheduler from './components/scheduler/Scheduler';
/*import dashboard component*/
import Dashboard from './components/dashboard/Dashboard'
/*import edit client component*/
import EditClient from './components/dashboard/EditClient'

import ErrorComponent from './components/error/ErrorComponent';

import './App.css';

// To use tokens for signed in users on every request
import jwtDecode from 'jwt-decode';
import setAuthorisationToken from './utilities/setAuthorisationToken';
import {setSignedInUser} from './actions/authenticationActions';

// Used to log the user out
import {logOutUser} from './actions/authenticationActions';

// check if token exists in local storage
if (localStorage.jwtToken) {
    // Set the token to local storage item 'jwtToken'
    setAuthorisationToken(localStorage.jwtToken);
    // Decode the token so user data can be used and get information and expiration data
    const decodedToken = jwtDecode(localStorage.jwtToken);
    // Call the setSignedInUser action/reducer and set the user and isAuthenticated
    store.dispatch(setSignedInUser(decodedToken));

    // I have set the jwt token in the REST API to expire in 1 hr, so they will have to log back in
    // - Delete the jwt token given in the expiration.
    const currentTime = Date.now() / 1000; // convert to milliseconds
    if (decodedToken.exp < currentTime) {
        // Log the user out
        store.dispatch(logOutUser());
        // TODO: clear current profile data on logout and redirect to login page

        // Redirect the user to the login page
        window.location.href = '/login';
    } // if decodedToken
} // if localStorage.jwtToken

// Used to redirect user if they are not authenticated to view a page
function PrivateRoute ({component: Component, ...rest}){

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

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <Router>
                    {/* Wrap the App div with Router so the functionality can be used  */}
                    <div className="App">
                        <Navigation/> {/*adds navbar component to web app*/}
                        {/*Using Switch let the route be checked if it exist or not, if not the last component (error) which doesn't have a path
                         will be rendered*/}
                        <Switch>
                            <Route exact path="/"
                                   component={Landing_page}/> {/* using Route functionality that adds the landing_page component to web app*/}
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/login" component={Login}/>
                            {/* Register Scheduler below uses restful url*/}
                            {/* Register_client below uses restful url*/}
                            <PrivateRoute path="/users/:uid?/register_client" component={RegisterClient}/>
                            <PrivateRoute path="/users/:uid?/scheduler/:Cid?" component={Scheduler}/>
                            {/* Register Dashboard below uses restful url*/}
                            <PrivateRoute path="/users/:uid?/dashboard/:Cid?" component={Dashboard}/>
                            <PrivateRoute path="/users/:uid?/edit_client" component={EditClient}/>

                            {/*If page doesn't exist * then show error page component*/}
                            <Route component={ErrorComponent}/>
                        </Switch>
                        <Footer/> {/*adds footer component to web app*/}
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
