function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.select(".area").attr("d", area);
    focus.select(".x.axis").call(xAxis);
    var s = x.domain();
    var s_orig = x2.domain();
    var newS = (s_orig[1] - s_orig[0]) / (s[1] - s[0]);
    var t = (s[0] - s_orig[0]) / (s_orig[1] - s_orig[0]);
    var trans = width * newS * t;
    zoom.scale(newS);
    zoom.translate([-trans, 0]);
}

function zoomed() {
    var t = d3.event.translate;
    var s = d3.event.scale;
    var size = width * s;
    t[0] = Math.min(t[0], 0);
    t[0] = Math.max(t[0], width - size);
    zoom.translate(t);
    focus.select(".area").attr("d", area);
    focus.select(".x.axis").call(xAxis);
    //Find extent of zoomed area, what's currently at edges of graphed region
    var brushExtent = [x.invert(0), x.invert(width)];
    context.select(".brush").call(brush.extent(brushExtent));
}

var margin = { top: 60, right: 20, bottom: 30, left: 50 },
    margin2 = { top: 430, right: 20, bottom: 30, left: 40 },
    width = 900 - margin.left - margin.right,
    height = 365 - margin.top - margin.bottom;
height2 = 500 - margin2.top - margin2.bottom;


// Adjust parsing of data to properly show tooltip
var parseDate = d3.time.format("%b %Y").parse,
    bisectDate = d3.bisector(function (d) { return d.date; }).left,
    formatValue = d3.format(",.2f"),
    formatCurrency = function (d) { return formatValue(d) + "%"; };

var x = d3.time.scale()
    .range([0, width]);

var x2 = d3.time.scale().range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
var xAxis2 = d3.svg.axis()
    .scale(x2)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
//create brush function redraw scatterplot with selection

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);


var line = d3.svg.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.rate); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");





var xscale = d3.scale.linear()
    .domain([0, 1])
    .range([-100, 775]);

var yscale = d3.scale.linear()
    .domain([0, 1])
    .range([0, 300]);

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);
// Add brushing
var area = d3.svg.area()
    .interpolate("monotone")
    .x(function (d) { return x(d.date); })
    .y0(height)
    .y1(function (d) { return y(d.rate); });

var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function (d) { return x2(d.date); })
    .y0(height2)
    .y1(function (d) { return y2(d.rate); });

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var zoom = d3.behavior.zoom().scaleExtent([1, 1000])
    .on("zoom", zoomed);

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");



d3.csv("data/2005-2019.csv", function (error, data) {
    if (error) throw error;
    console.log(data);

    data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.rate = +d.rate;



    });

    x.domain(d3.extent(data, function (d) { return d.date; }));
    y.domain(d3.extent(data, function (d) { return d.rate; }));
    x2.domain(x.domain());
    y2.domain(y.domain());

    zoom.x(x);


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Unemployment Rate (%)");


    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Unemployement Rate in the US from 2005 to 2019");


    // animation on click
    d3.select("#start").on("click", function () {
        var path = svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);


        
        var totalLength = path.node().getTotalLength();

        //  Dash Array and Dash Offset and initiate Transition
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition() // Call Transition Method
            .duration(4000) // Set Duration timing (ms)
            .ease("linear") // Set Easing option
            .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition

        // Create SVG for Tooltip and Circle on Mouseover
        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        // Append a circle to show on Mouseover
        focus.append("circle")
            .attr("r", 4.5);

        // Append text to show on Mouseover
        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

      //tooltip
        // that allows user to hover anywhere on graphic
        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function () { focus.style("display", null); })
            .on("mouseout", function () { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        // Mousemove function that sets location and changes properties of Focus SVG
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d.rate) + ")");
            focus.select("text").text(formatCurrency(d.rate));
        }

        svg.append("g")
            .attr('class', 'scrubline' + ' ' + this.id)
            .attr('x1', 0).attr('x2', 0)
            .attr('y1', 0).attr('y2', this.height)
            .classed('hidden', true);


    });
    // Reset Animation
    d3.select("#reset").on("click", function () {
        d3.select(".line").remove();
       
    });
});
