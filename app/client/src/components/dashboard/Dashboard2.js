import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { withRouter } from 'react-router-dom';
import {getClientProgression} from "../../actions/authenticationActions";
import * as d3 from 'd3';
// import FormInputGroup from "../common/FormInputGroup"; // Allows proper routing and linking using browsers match, location, and history properties

class Dashboard2 extends Component {
    // This allows the component states to be up{dated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        };

        // // This sets the state value to it's respective state (via binding)
        // this.onChange = this.onChange.bind(this);
        //
        // // This binds the onSubmit function to this.OnSubmit
        // this.onSubmit = this.onSubmit.bind(this);
    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        // Check if isAuthenticated is true then redirect to the dashboard
        if (!this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/login');
        }

        this.props.getClientProgression('5c2e2d484489901a743d87da', '5c2e2e604489901a743d87db');


        let myData = [
            {date: '2019-01-03T15:42:00.238+0000', frequency: 1.13},
            {date: '2019-02-03T15:42:00.238+0000', frequency: 5.00},
            {date: '2019-03-03T15:42:00.238+0000', frequency: 10},
            {date: '2019-04-03T15:42:00.238+0000', frequency: 20},
            {date: '2019-05-03T15:42:00.238+0000', frequency: 30},
            {date: '2019-06-03T15:42:00.238+0000', frequency: 35},
            {date: '2019-07-03T15:42:00.238+0000', frequency: 42},
            {date: '2019-08-03T15:42:00.238+0000', frequency: 55},
            {date: '2019-09-03T15:42:00.238+0000', frequency: 55},
            {date: '2019-10-03T15:42:00.238+0000', frequency: 60},
            {date: '2019-12-03T15:42:00.238+0000', frequency: 66},
            {date: '2020-01-03T15:42:00.238+0000', frequency: 68},
            {date: '2020-02-03T15:42:00.238+0000', frequency: 62},
            {date: '2020-04-03T15:42:00.238+0000', frequency: 70},
            {date: '2020-05-03T15:42:00.238+0000', frequency: 76}
        ];

        // 1st parameter takes array of objects as data to plot graph, 2nd parameter takes div as position to display graph
        function addGraph(data, position) {// set the dimensions and margins of the graph

            // Takes data given in function
            let myData = data;

            let marginTop = 20;
            let marginRight = 20;
            let marginBottom = 30;
            let marginLeft = 50;
            let width = 500 - marginLeft - marginRight;
            let height = 310 - marginTop - marginBottom;

            // parse the {date / time
            let parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L%Z");

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

                // text label for the graph title
                svg.append("text")
                    .attr("transform",
                        "translate(" + (width/2) + " ," + // first value is distance from left, second is distance from top
                        (-5) + ")")
                    .style("text-anchor", "middle")
                    .text("Title");

                // Add the X Axis
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%m %b %Y")))
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)" );

                // text label for the x axis
                svg.append("text")
                    .attr("transform",
                        "translate(" + (width/2) + " ," +
                        (height + marginTop + 62) + ")")
                    .style("text-anchor", "middle")
                    .text("Date");

                // Add the Y Axis
                svg.append("g")
                    .call(d3.axisLeft(y));

                // text label for the y axis
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - marginLeft)
                    .attr("x",0 - (height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Weight (Kg)"); // y-axis label

            } // d3.json

            draw(myData);
        } // addGraph

        // 1st argument takes array of objects as data to plot graph, 2nd argument takes div as position to display graph
        addGraph(myData, ".progression-data");
        // addGraph(myData2, ".progression-data2");

    }

    render() {
        //const {errors} = this.state; // This allows errors to be pulled out of this.state with pulling them out directly

        return (
            <div className="container  dashboard-custom">
                <div className="row">
                    <div className="m-auto col-md-8">
                        <h1 className=" text-center display-5">Dashboard</h1>
                        <div className="progression-data"></div>
                        <div className="progression-data2"></div>
                    </div>
                </div>
            </div>
        );
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Dashboard2.propTypes = {
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
export default connect(stateToProps, {getClientProgression})(withRouter(Dashboard2));
