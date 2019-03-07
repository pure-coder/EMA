import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {getClientProgression} from "../../actions/authenticationActions";
//import {addGraph} from '../../utilities/progressGraph'
import Loading from "../../elements/Loading";
import CP from "./Graph";

// import FormInputGroup from "../common/FormInputGroup"; // Allows proper routing and linking using browsers match, location, and history properties

class ClientProfile extends Component {
    // This allows the component states to be up{dated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            client_Progression: undefined,//props.client_Progression !== undefined ? props.client_Progression : undefined,
            userId: props.authenticatedUser.user.id,
            // If user is pt then get clientId from otherwise user is client, so use user.id
            clientId: props.authenticatedUser.clientId !== undefined ? props.authenticatedUser.clientId : props.match.params.Cid,
            loaded: false,
            errors: {}
        };

    }

    static getDerivedStateFromProps(props, state) {
        if (props.authenticatedUser.client_Progression !== state.client_Progression) {
            return {
                client_Progression: props.authenticatedUser.client_Progression,
                loaded: true
            };
        }
        return null
    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        // Check if isAuthenticated is true then redirect to the dashboard
        if (!this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/login');
        }

        this.update()
    } // did mount

    update() {
        // If direct link used then get client progression data
        if (this.state.loaded === false)
            this.props.getClientProgression(this.state.userId, this.state.clientId);
    }


    render() {
        let displayContent;
        let client_progression = this.state.client_Progression;

        if (this.state.loaded === false) {
            return <Loading/>
        }

        // Check to see that client_progression is not undefined or the return data for client_progression is not empty
        if (client_progression !== undefined) {
            displayContent = (
                <CP client_progression={client_progression}/>
            )

        } // if client_progression is not undefined

        return (
            <div className="container  dashboard-custom">
                {displayContent}
            </div>
        );

    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
ClientProfile.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    getClientProgression: PropTypes.func.isRequired
    //errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

// connect must be exported with a passed parameter (not direct parameter) of Dashboard this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is dashboard as the 2nd parameter
export default connect(stateToProps, {getClientProgression})(withRouter(ClientProfile));
