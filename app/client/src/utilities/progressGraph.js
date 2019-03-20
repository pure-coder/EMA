import * as d3 from "d3";

function addGraph(data, position) {// set the dimensions and margins of the graph
    // Takes data given in function
    let dataToDraw = data;

    let marginTop = 20;
    let marginRight = 20;
    let marginBottom = 30;
    let marginLeft = 50;
    let width = 400 - marginLeft - marginRight;
    let height = 250 - marginTop - marginBottom;

    // parse the {Date / time
    let parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L%Z");

    // set the ranges
    let x = d3.scaleTime().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    // define the area to shade (fill)
    let area = d3.area()
        .x(function(d) { return x(d.Date); })
        .y0(height)
        .y1(function(d) { return y(d.maxWeight); });

    // define the line
    let valueline = d3.line()
        .x(function (d) {
            return x(d.Date);
        })
        .y(function (d) {
            return y(d.maxWeight);
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

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(5)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(5)
    }

    // Get the data
    function draw(data) {

        // format the data
        data.forEach(function (d) {
            d.Date = parseTime(d.Date);
            d.maxWeight = +d.maxWeight;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.Date;
        }));
        // Changed y-axis to use the min to max range of data like what is used in x-axis
        y.domain(d3.extent(data, function (d) {
            return d.maxWeight;
        }));

        // add the area
        svg.append("path")
            .data([data])
            .attr("class", "area")
            .attr("d", area);

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // text label for the graph title
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," + // first value is distance from left, second is distance from top
                (-5) + ")")


        // add the X gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(make_x_gridlines()
                .tickSize(-height)
                .tickFormat("")
                .ticks(d3.timeMonth)
            );

        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
            );


        // Add the X Axis
        svg.append("g")
            .attr("class", "grid x-axis")
            .attr("transform", "translate(0," + height + ")")
            // tickValues used to display only the dates given in the data
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d %b %Y")).tickValues(data.map(elements => {return elements.Date})))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")


        // text label for the x axis
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + marginTop + 62) + ")")
            .style("text-anchor", "middle")
            .text("Date");

        // Add the Y Axis
        svg.append("g")
            .attr("class", "grid y-axis")
            .call(d3.axisLeft(y))


        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - marginLeft)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Weight (Kg)"); // y-axis label

        // Add (lines) strokes to x and y axis, as adding the grid changed it.
        d3.selectAll(".x-axis")
            .selectAll(".domain")
            .style("stroke", "black")
            .style("stroke-width", 1);

        d3.selectAll(".y-axis")
            .selectAll(".domain")
            .style("stroke", "black")
            .style("stroke-width", 1);

        // Add (lines) strokes to ticks on x and y axis, as adding the grid changed it.
        d3.selectAll(".y-axis")
            .selectAll(".tick")
            .selectAll("line")
            .style("stroke", "black")
            .style("stroke-width", 1);

        d3.selectAll(".x-axis")
            .selectAll(".tick")
            .selectAll("line")
            .style("stroke", "black")
            .style("stroke-width", 1);

    } // draw
    return draw(dataToDraw);

} // addGraph

export {addGraph}
