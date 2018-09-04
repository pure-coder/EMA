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
        if (this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/dashboard');
        }

        // set the dimensions and margins of the graph
        let marginTop = 20;
        let marginRight = 20;
        let marginBottom = 30;
        let marginLeft = 50;
        let width = 960 - marginLeft - marginRight;
        let   height = 500 - marginTop - marginBottom;

        // parse the {date / time
        let parseTime = d3.timeParse("%d-%b-%y");

        // set the ranges
        let x = d3.scaleTime().range([0, width]);
        let y = d3.scaleLinear().range([height, 0]);

        // define the line
        let valueline = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.frequency); });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        let svg = d3.select("body").append("svg")
            .attr("width", width + marginLeft + marginRight)
            .attr("height", height + marginTop + marginBottom)
            .append("g")
            .attr("transform",
                "translate(" + marginLeft + "," + marginTop + ")");

        // set data
        let myData = [
            {date: '1-May-12', frequency: 58.13},
            {date: '27-Apr-12', frequency: 67.00},
            {date: '26-Apr-12', frequency: 89.70},
            {date: '25-Apr-12', frequency: 99.00},
            {date: '24-Apr-12', frequency: 130.28},
            {date: '23-Apr-12', frequency: 166.70},
            {date: '20-Apr-12', frequency: 234.98},
            {date: '19-Apr-12', frequency: 345.44},
            {date: '18-Apr-12', frequency: 443.34},
            {date: '17-Apr-12', frequency: 543.70},
            {date: '16-Apr-12', frequency: 580.13},
            {date: '13-Apr-12', frequency: 605.23},
            {date: '12-Apr-12', frequency: 622.77},
            {date: '11-Apr-12', frequency: 626.20},
            {date: '10-Apr-12', frequency: 628.44},
        ]

        // Get the data
        function draw (data) {

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
        const {errors} = this.state; // This allows errors to be pulled out of this.state with pulling them out directly

        return (
            <div className="dashboard">
                <div className="container  dashboard-custom">
                    <div className="row">
                        <div className="m-auto col-md-8">
                            <h1 className=" text-center display-5">Personal Trainer <br/> Sign Up</h1>
                            <p className="description text-center">Create your Personal Trainer account</p>



                        </div>
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
    errors: PropTypes.object.isRequired
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
