import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/api/products.js';
 
import { ProductDatabase } from '../imports/api/products.js';
 
import '../client/main.html';

//var ProductDatabase = new Meteor.Collection(null);

/*
if(ProductDatabase.find({}).count() === 0){
	for(i = 0; i < 20; i++)
		ProductDatabase.insert({
			score:Math.floor(Math.random() * 100),
			value:Math.floor(Math.random() * 10)
		});
}*/

Template.linegraph.events({
	'click #add':function(event){
		event.preventDefault();
		ProductDatabase.insert({
			overallScore:Math.floor(Math.random() * 100),
			displayName: "testing"
			//value:Math.floor(Math.random() * 10)
		});
	},
	'click #remove':function(){
		var toRemove = _.random(ProductDatabase.find().fetch());
		//ProductDatabase.remove({_id:toRemove._id});
		Meteor.call('removeAllProducts')
	},
	'click #randomize':function(){
		//loop through bars
		ProductDatabase.find({}).forEach(function(point){
			ProductDatabase.update({_id:point._id},{$set:{value:Math.floor(Math.random() * 100)+500}});
		});
	}
});


Template.linegraph.rendered = function(){

	//Width and height
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 1000 - margin.left - margin.right,
		height = 100 - margin.top - margin.bottom;

	//var x = d3.time.scale()
	//	.range([0, width]);

	var x = d3.scale.linear()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var line = d3.svg.line()
		.x(function(d) {
			return x(d.score);
		})
		.y(function(d) {
			return y(d.value);
		});

	var svg = d3.select("#linegraph")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")");

	svg.append("g")
		.attr("class", "y axis")
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Count");

	Deps.autorun(function(){
		//var dataset = ProductDatabase.find({},{sort:{score:-1}}).fetch();
		if (Session.get("selectedProductCategoryID"))
			var modifier = {"category.id" : Session.get("selectedProductCategoryID")};
		else
			var modifier = {};
		var fulldata = ProductDatabase.find(modifier,{sort: {overallScore: 1}}).fetch();
		//var fulldata = ProductDatabase.find({category : {id : "34925"}},{sort: {overallScore: 1}}).fetch();
		var dataset = {};
		dataset = _.groupBy(fulldata, function(fridge){return parseInt(fridge['overallScore'])}); 
					//Obj {88: Array[1], 85: Array[2]}
		console.log('full', fulldata[0]) //array of objs
		console.log('grouped', dataset) // an obj of arrays
		console.log('grouped keys: scores', _.keys(dataset))
		var vals = _.values(dataset)
		console.log('grouped values: scores', _.values(dataset))
		
		var groupedScores = [];

		_.each((vals), function(d){
			var value = d.length;
		})
		_.each((_.keys(dataset)), function(d){
			//console.log(d)
		})

		_.mapValues(dataset, function(val, key) {
		//_.mapObject(dataset, function(val, key){
			key = parseInt(key);
			groupedScores.push({'score': key, 'value': val.length})
		})

		console.log("final array :: ", groupedScores)



		//add 'anchor' points to anchor the graph to the bottom.
		if (groupedScores.length > 0){
		//start achor
			//score: smallest score , value : 0
			var score = groupedScores[0].score;
			var firstAnchor = {'score':  score, "value" : 0}
			//groupedScores.push(firstAnchor)
		//end anchor
			//score: highest score , value : 0
			var scorem = groupedScores[groupedScores.length -1].score;
			var lastAnchor = {'score': scorem, "value" : 0}
			//groupedScores.push(lastAnchor)
		}

//fill in the array with 0 scores
		var fullarray = [];
		for (var i = 0; i <= 100; i++) {
			fullarray.push({'score': i, 'value': 0})

			groupedScores.forEach(function(element, index, array){
				//console.log ("this old", element)
				if (element.score == i) {
					fullarray[i]['value'] = element['value']
					//console.log ("this exists", element)
				}
			})
		}
		console.log(groupedScores, fullarray)

		dataset = fullarray;

		x.domain(d3.extent(dataset, function(d) { return d.score; }));
		y.domain(d3.extent(dataset, function(d) { return d.value; }));
// Define the area fill
var	area = d3.svg.area()	
    .x(function(d) { return x(d.score); })	
    .y0(height)					
    .y1(function(d) { return y(d.value); });
    

		//add the gradient
		/* svg.append("linearGradient")				
        .attr("id", "area-gradient")			
        .attr("gradientUnits", "userSpaceOnUse")	
        .attr("x1", 0).attr("y1", y(0))			
        .attr("x2", 0).attr("y2", y(1000))		
    .selectAll("stop")						
        .data([								
            {offset: "0%", color: "steelblue"},
        {offset: "50%", color: "gray"},
        {offset: "100%", color: "red"}
        ])						
    .enter().append("stop")			
        .attr("offset", function(d) { return d.offset; })	
        .attr("stop-color", function(d) { return d.color; });
		*/	

    svg.append("linearGradient")				
        .attr("id", "area-gradient")			
        .attr("gradientUnits", "userSpaceOnUse")	
        .attr("x1", 0).attr("y1", y(0))			
        .attr("x2", 0).attr("y2", y(1000))		
    .selectAll("stop")						
        .data([								
            {offset: "0%", color: "red"},		
            {offset: "30%", color: "red"},	
            {offset: "45%", color: "black"},		
            {offset: "55%", color: "black"},		
            {offset: "60%", color: "lawngreen"},	
            {offset: "100%", color: "lawngreen"}	
        ])						
    .enter().append("stop")			
        .attr("offset", function(d) { return d.offset; })	
        .attr("stop-color", function(d) { return d.color; });

		var paths = svg.selectAll("path.line")
			.data([dataset])
			
		//Update X axis
		svg.select(".x.axis")
			.transition()
			.duration(1000)
			.call(xAxis);
			
		//Update Y axis
		svg.select(".y.axis")
			.transition()
			.duration(1000)
			.call(yAxis);
		
		paths
			.enter()
			.append("path")
			.attr("class", "line")
			.attr('d', line)

		paths
			.attr('d', line); //todo - should be a transisition, but removed it due to absence of key
			
		paths
			.exit()
			.remove();
	});
};