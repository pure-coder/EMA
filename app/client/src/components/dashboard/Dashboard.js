import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { withRouter } from 'react-router-dom';
import ClientList from './ClientList'
import { saveState, loadState }from '../../utilities/localState'; // import function to save and load state to local storage
//import * as d3 from 'd3';

class Dashboard extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        super(props);
        this.state = {
            authenticatedUser: loadState() || props.authenticatedUser,
            errors: {}
        }

    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        // Check if isAuthenticated is true then redirect to the dashboard
        if (!this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/login');
        }

    } // ComponentDidMount

    componentWillUnmount() {

    }

    // Life cycle method for react which will run when this component receives new properties
    // componentWillReceiveProps(nextProps) {
    //     // If property (nextProps) contains errors (contains the "errors" prop) then set the component state of errors
    //     // defined in the constructor above to the errors that was sent to it via the dispatch call from
    //     // authenicationActions.js
    //     if(nextProps.errors){
    //         this.setState({errors: nextProps.errors})
    //     }
    //
    //     // If authenticatedUser properties have changed then update the state of authenticatedUser
    //     if(nextProps.authenticatedUser !== this.state.authenticatedUser){
    //         this.setState({authenticatedUser: nextProps.authenticatedUser})
    //         saveState(nextProps.authenticatedUser)
    //     }
    // }

    static getDerivedStateFromProps(nextProps, prevState){
        // If authenticatedUser properties have changed then update the state of authenticatedUser
        if(nextProps.authenticatedUser !== prevState.authenticatedUser){
            saveState(nextProps.authenticatedUser)
            return {
                authenticatedUser: nextProps.authenticatedUser
            }
        }
        return null
    }

    render() {
        console.log("render state", this.state)
        console.log("render props", this.props)

        // Get clients from pt client list via redux
        let clients = this.state.authenticatedUser.user.clients

        let displayContent;

        // If user is a PT then display pt dashboard of clients
        if(this.props.authenticatedUser.user.pt){
            displayContent = (
                // send clients data to client component, and render client component
                <ClientList clients={clients}/>
            )
        } // If PT

        return (
                <div className="container  dashboard-custom">
                    <div className="row">
                        <div className="m-auto col-md-10">
                            <h1 className=" text-center display-5">Dashboard</h1>
                            {displayContent}
                        </div>
                    </div>
                </div>
        );
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Dashboard.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}


// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

// connect must be exported with a passed parameter (not direct parameter) of Dashboard this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is dashboard as the 2nd parameter
export default connect(stateToProps, null)(withRouter(Dashboard));
