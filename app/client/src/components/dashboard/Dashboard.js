import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { dashboard} from "../../actions/authenticationActions"; // Used to import create action for dashboarding user
import { withRouter } from 'react-router-dom';
import * as d3 from 'd3';
// import FormInputGroup from "../common/FormInputGroup"; // Allows proper routing and linking using browsers match, location, and history properties

class Dashboard extends Component {
    // This allows the component states to be up{dated and re-rendered
    constructor(props) {
        super(props);
        this.state = {

            errors: {}
        }

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        // Check if isAuthenticated is true then redirect to the dashboard
        if (!this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/login');
        }

        // set data
        let myData = [
            {date: '01-May-12', frequency: 1.13},
            {date: '01-Jun-12', frequency: 5.00},
            {date: '01-Jul-12', frequency: 10},
            {date: '01-Aug-12', frequency: 20},
            {date: '01-Sep-12', frequency: 30},
            {date: '01-Nov-12', frequency: 35},
            {date: '01-Dec-12', frequency: 42},
            {date: '01-Jan-13', frequency: 55},
            {date: '05-Feb-13', frequency: 55},
            {date: '05-Mar-13', frequency: 60},
            {date: '05-Apr-13', frequency: 66},
            {date: '05-may-13', frequency: 68},
            {date: '10-Jun-13', frequency: 62},
            {date: '10-Jul-13', frequency: 70},
            {date: '10-Aug-13', frequency: 76},
        ]

        // set data
        let myData2 = [
            {date: '01-May-12', frequency: 10},
            {date: '01-Jun-12', frequency: 15},
            {date: '01-Jul-12', frequency: 10},
            {date: '01-Aug-12', frequency: 11},
            {date: '01-Sep-12', frequency: 52},
            {date: '01-Nov-12', frequency: 35},
            {date: '01-Dec-12', frequency: 42},
            {date: '01-Jan-13', frequency: 68},
            {date: '05-Feb-13', frequency: 55},
            {date: '05-Mar-13', frequency: 25},
            {date: '05-Apr-13', frequency: 66},
            {date: '05-may-13', frequency: 68},
            {date: '10-Jun-13', frequency: 62},
            {date: '10-Jul-13', frequency: 70},
            {date: '10-Aug-13', frequency: 76},
        ]

        // 1st parameter takes array of objects as data to plot graph, 2nd parameter takes div as position to display graph
        function addGraph(data, position) {// set the dimensions and margins of the graph

            // Takes data given in function
            let myData = data;

            let marginTop = 20;
            let marginRight = 20;
            let marginBottom = 30;
            let marginLeft = 50;
            let width = 500 - marginLeft - marginRight;
            let height = 300 - marginTop - marginBottom;

            // parse the {date / time
            let parseTime = d3.timeParse("%d-%b-%y");

            // set the ranges
            let x = d3.scaleTime().range([0, width]);
            let y = d3.scaleLinear().range([height, 0]);

            // define the line
            let valueline = d3.line()
                .x(function (d) {
                    return x(d.date);
                })
                .y(function (d) {
                    return y(d.frequency);
                });

            // append the svg object to the body of the page
            // appends a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            // setPosition - sets specific graph to div specified as position parameter
            let svg = d3.select(position).append("svg")
                .attr("width", width + marginLeft + marginRight)
                .attr("height", height + marginTop + marginBottom)
                .append("g")
                .attr("transform",
                    "translate(" + marginLeft + "," + marginTop + ")");

            // Get the data
            function draw(data) {

                // format the data
                data.forEach(function (d) {
                    d.date = parseTime(d.date);
                    d.frequency = +d.frequency;
                });

                // Scale the range of the data
                x.domain(d3.extent(data, function (d) {
                    return d.date;
                }));
                y.domain([0, d3.max(data, function (d) {
                    return d.frequency;
                })]);

                // Add the valueline path.
                svg.append("path")
                    .data([data])
                    .attr("class", "line")
                    .attr("d", valueline);

                // Add the X Axis
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                // Add the Y Axis
                svg.append("g")
                    .call(d3.axisLeft(y))
            } // d3.json

            draw(myData);
        } // addGraph

        // 1st argument takes array of objects as data to plot graph, 2nd argument takes div as position to display graph
        addGraph(myData, ".progression-data");
        addGraph(myData2, ".progression-data2");

    }

    // Life cycle method for react which will run when this component receives new properties
    componentWillReceiveProps(nextProps) {
        // If property (nextProps) contains errors (contains the "errors" prop) then set the component state of errors
        // defined in the constructor above to the errors that was sent to it via the dispatch call from
        // authenicationActions.js
        if(nextProps.errors){
            this.setState({errors: nextProps.errors})
        }
    }

    // This captures what the user types and sets the specific input to the respective state variable
    onChange(event) {
        // event.target.name is used instead of a specific named state (ie "event.target.FullName") as there is more then
        // one, making it easier to capture all of them with this onChange function.
        this.setState({[event.target.name]: event.target.value})
    }

    onSubmit(event) {
        event.preventDefault();

        const newUser = {

        }

        // Calls the action/reducer loginUser with the user data as well
        // as using the history function of withRouter for directing user to another link/route. (calls dashboard
        // from actions/authenticationActions.js)

        // If no errors occur then dashboard user
        this.props.dashboard(newUser, this.props.history);
    }

    render() {
        //const {errors} = this.state; // This allows errors to be pulled out of this.state with pulling them out directly

        return (
                <div className="container  dashboard-custom">
                    <div className="row">
                        <div className="m-auto col-md-8">
                            <h1 className=" text-center display-5">Personal Trainer <br/> Sign Up</h1>
                            <p className="description text-center">Create your Personal Trainer account</p>
                            <div className="progression-data"></div>
                            <div className="progression-data2"></div>
                        </div>
                    </div>
                </div>
        );
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Dashboard.propTypes = {
    dashboard: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    //errors: PropTypes.object.isRequired
}

// Used to pull auth state and errors into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

// connect must be exported with a passed parameter (not direct parameter) of Dashboard this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is dashboard as the 2nd parameter
export default connect(stateToProps, { dashboard })(withRouter(Dashboard));
