$( document ).ready(function() {
    var data = [
        {"from":"Jul 13, 2017 10:48:00 PM","to":"Jul 14, 2017 7:09:00 AM"},
        {"from":"Jul 17, 2017 10:50:00 PM","to":"Jul 18, 2017 6:14:00 AM"},
        {"from":"Jul 18, 2017 11:22:00 PM","to":"Jul 19, 2017 6:40:00 AM"},
        {"from":"Jul 19, 2017 10:33:00 PM","to":"Jul 20, 2017 6:54:00 AM"}
    ]
    render_chart(mapData(data));
});

const splitON = 17

var rangeY = [new Date(2000, 0, 1, splitON, 0, 0, 0), new Date(2000, 0, 2, splitON, 0, 0, 0)]



function mapData(data){
    return data.map(entry => ({
        from: getTime(entry.from),
        to: getTime(entry.to),
        day: getDate(entry.to)
    }))
}

function getTime(date) {
    let result = new Date(date)
    result.setDate(1)
    result.setMonth(0)
    result.setFullYear(2000)
    if (result < rangeY[0]) {
        result.setDate(2)
    }
    return result
}

function getDate(date) {
    let result = new Date(date)
    result.setHours(0)
    result.setMinutes(0)
    result.setSeconds(0)
    return result
}

function render_chart(data){
    console.log(data)
    var stack = d3.layout.stack();
    const color = "#3498db"

    xGroupMax = d3.max(data, function(d) { return d.day; })
    xGroupMin = d3.min(data, function(d) { return d.day; })

    

    const rangeX = [xGroupMin, xGroupMax]
    
    console.log(rangeX)
    console.log(rangeY)

    var margin = {top: 50, right: 50, bottom: 50, left: 100},
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    var x = d3.scale.ordinal()
        .domain(rangeX)
        .range([0, width])

    var y = d3.time.scale()
        .domain(rangeY)
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(5)
        .tickPadding(6)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(function(d) { return d.getHours() + ' Uhr' })

    var svg = d3.select("#chart1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var rect = svg.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("x", function(d, i, j) { return x(d.day) + x.rangeBand()* j; })
        .attr("width", x.rangeBand())
        .transition()
        .attr("y", function(d) { return y(d.to); })
        .attr("height", function(d) { console.log(y(d.to-d.from)); return y(d.from) - y(d.to)})
        .attr("class","bar")
        .style("fill",function(d){return color})

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.select("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("text")
        .attr("x", width/3)
        .attr("y", 0)
        .attr("dx", ".71em")
        .attr("dy", "-.71em")
        .text("Min - Max Temperature (Month wise)");

    // add legend
    var legend = svg.append("g")
      .attr("class", "legend")

    legend.selectAll('text')
      .data([color])
      .enter()
      .append("rect")
      .attr("x", width-margin.right)
      .attr("y", function(d, i){ return i *  20;})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d) {
        return "A";
      })

    legend.selectAll('text')
      .data(['Schlaf'])
      .enter()
    .append("text")
    .attr("x", width-margin.right + 25)
    .attr("y", function(d, i){ return i *  20 + 9;})
    .text(function(d){return d});

    var tooltip = d3.select("body")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'day');
    tooltip.append('div')
    .attr('class', 'tempRange');

    svg.selectAll("rect")
    .on('mouseout', function() {
        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
    });

}