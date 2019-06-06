// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 20
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var chart = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("transform", `translate(0, ${margin.top})`);

//Append a div to the body to create tooltips
var toolTip = d3.select("body").append("div")
					.attr("class", "tooltip")
					.style("opacity", 0);


var chosenXAxis='poverty'
var chosenYAxis='healthcare'
// Import Data

// Step 1: Parse Data/Cast as numbers
// ==============================
d3.csv("assets/data/data.csv").then(function(healthData){


    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xMin;
    var xMax;
    var yMin;
    var yMax;
     
	function plotcircleandaxis(chosenXAxis,chosenYAxis) {
		chart.selectAll("svg > *").remove();
		
		xMin = d3.min(healthData, function (data){
		  return +data[chosenXAxis] * 0.95;
		});
		xMax = d3.max(healthData, function (data){
		  return +data[chosenXAxis] * 1.05;
		});
		yMin = d3.min(healthData, function (data){
		  return +data[chosenYAxis] * 0.95;
		});
		yMax = d3.max(healthData, function (data){
		  return +data[chosenYAxis] * 1.05;
		});
		xLinearScale.domain([xMin, xMax]);
		yLinearScale.domain([yMin, yMax]);


		// Step 5: Create Circles
		// ==============================
		chart
			.append("g")
			.attr('transform', `translate(80, 0)`)
			.selectAll("circle")
			.data(healthData)
			.enter()
			.append("circle")
			.attr("cx", function(data, index) {
				return xLinearScale(data[chosenXAxis])
			})
			.attr("cy", function(data, index) {
				return yLinearScale(data[chosenYAxis])
			})
			.attr("r", "15")
			.attr("fill", "lightblue")
			
			// display tooltip on click
			.on("mouseenter", function(data) {
				//console.log(chosenXAxis);
				toolTip.transition()
					.duration(200)
					.style('opacity',.9)
				toolTip.html('<ul class="info"><li>State: '+data.state+'</li><li>'+chosenXAxis+' : '+data[chosenXAxis]+'</li><li>'+chosenYAxis+' : '+data[chosenYAxis]+'</li></ul>')
					.style('left',(d3.event.pageX+5)+'px')
					.style('top',(d3.event.pageY-28)+'px')
			})
			// hide tooltip on mouseout
			.on("mouseout", function(data, index) {
				toolTip.transition()
					.duration(500)
					.style('opacity',0)
			});
		
		// Appending a label to each data point
		chart
			.append("g")
			.attr('transform', `translate(80, 0)`)
			.append("text")
			.style("text-anchor", "middle")
			.style("font-size", "12px")
			.selectAll("tspan")
			.data(healthData)
			.enter()
			.append("tspan")
				.attr("x", function(data) {
					return xLinearScale(data[chosenXAxis] - 0);
				})
				.attr("y", function(data) {
					return yLinearScale(data[chosenYAxis]- 0.2);
				})
				.text(function(data) {
					return data.abbr
				});
		// Append an SVG group for the xaxis, then display x-axis 
		chart
			.append("g")
			.attr('transform', `translate(80, ${height})`)
			.call(bottomAxis);

		// Append a group for y-axis, then display it
		chart
			.append("g")
			.attr('transform', `translate(80, 0)`)
			.call(leftAxis);

		// Append y-axis label
		chart
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0-margin.left + 50)
			.attr("x", 0 - height/2)
			.attr("dy","1em")
			.attr("class", "axis-text")
			.attr("value","Yobesity")
			.text("obesity (%)")
		chart
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0-margin.left + 35)
			.attr("x", 0 - height/2)
			.attr("dy","1em")
			.attr("class", "axis-text")
			.attr("value","Ysmokes")
			.text("smokes (%)")    
		chart
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0-margin.left +20)
			.attr("x", 0 - height/2)
			.attr("dy","1em")
			.attr("class", "axis-text")
			.attr("value","Yhealthcare")
			.text("healthcare (%)")

		// Append x-axis labels
		chart
			.append("text")
			.attr(
				"transform",
				"translate(" + width / 2 + " ," + (height + margin.top + 40) + ")"
			)
			.attr("class", "axis-text")
			.attr("value","Xpoverty")
			.text("In Poverty (%)");
		chart
			.append("text")
			.attr(
				"transform",
				"translate(" + width / 2 + " ," + (height + margin.top + 25) + ")"
			)
			.attr("class", "axis-text")
			.attr("value","Xincome")
			.text("income ");	
		chart
			.append("text")
			.attr(
				"transform",
				"translate(" + width / 2 + " ," + (height + margin.top + 10) + ")"
			)
			.attr("class", "axis-text")
			.attr("value","Xage")
			.text("age ");				
		

		// updateToolTip function above csv import
		// var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

		// x axis labels event listener

		d3.selectAll(".axis-text")
			.on("click", function() {
			  // get value of selection
			  value=d3.select(this).attr("value");
			  console.log(value)

			  if (value.slice(0,1)=="X"){
				if (value.slice(1,20) !== chosenXAxis) {
				// replaces chosenXAxis with value
					chosenXAxis = value.slice(1,20);
					plotcircleandaxis(chosenXAxis,chosenYAxis)
				}
			  }else{
				if (value.slice(1,20) !== chosenYAxis) {
				// replaces chosenXAxis with value
					chosenXAxis = value.slice(1,20);
					plotcircleandaxis(chosenXAxis,chosenYAxis)
				}		  
			  }
		  });		
				
    }
	
	plotcircleandaxis(chosenXAxis,chosenYAxis)

});   