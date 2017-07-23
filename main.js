$( document ).ready(function() {
    var data = [
        {"from":"Jul 13, 2017 10:48:00 PM","to":"Jul 14, 2017 7:09:00 AM"},
        {"from":"Jul 17, 2017 10:50:00 PM","to":"Jul 18, 2017 6:14:00 AM"},
        {"from":"Jul 18, 2017 11:22:00 PM","to":"Jul 19, 2017 6:40:00 AM"},
        {"from":"Jul 19, 2017 10:33:00 PM","to":"Jul 20, 2017 6:54:00 AM"}
    ]
    render_chart("#chart1", mapData(data));
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

function getWeekDay(date) {
    let result = new Date(date)
    switch (result.getDay()) {
        case 0: return 'Mo'
        case 1: return 'Di'
        case 2: return 'Mi'
        case 3: return 'Do'
        case 4: return 'Fr'
        case 5: return 'Sa'
        case 6: return 'So'
    }
    return ""
}



function render_chart(container, data){
    var width = 700,
            height = 400,
            padding = 100;
            
        // create an svg container
        var vis = d3.select(container).
            append("svg:svg")
                .attr("width", width)
                .attr("height", height);
                
        // define the y scale  (vertical)
        var yScale = d3.time.scale()
	        .domain(rangeY)    // values between 0 and 100
		.range([height - padding, padding]);   // map these to the chart height, less padding.  
                 //REMEMBER: y axis range has the bigger number first because the y value of zero is at the top of chart and increases as you go down.
            
        let rangeX = [d3.min(data, function(d) { return d.day; }), d3.max(data, function(d) { return d.day; })]


            
        var xScale = d3.time.scale()
	        .domain(rangeX)    // values between for month of january
		.range([padding, width - padding * 2]);   // map these the the chart width = total width minus padding at both sides
		    
	
        // define the y axis
        var yAxis = d3.svg.axis()
            .orient("left")
            .tickFormat(function(d) { return d.getHours() + ' Uhr' })
            .scale(yScale);
        
        // define the y axis
        var xAxis = d3.svg.axis()
            .orient("bottom")
            .tickFormat(function(d) { return getWeekDay(d) + ' ' + d.getDate() + "." + d.getMonth() })
            .ticks(5)
            .scale(xScale);
            
        // draw y axis with labels and move in from the size by the amount of padding
        vis.append("g")
            .attr("class", "yaxis axis") 
            .attr("transform", "translate("+padding+",0)")
            .call(yAxis);

        // draw x axis with labels and move to the bottom of the chart area
        vis.append("g")
            .attr("class", "xaxis axis")   // give it a class so it can be used to select only xaxis labels  below
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(xAxis);    

}