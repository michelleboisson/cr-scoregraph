Template.bargraph.onRendered (function(){
	//Width and height
	var w = 600;
	var h = 250;
	
	var xScale = d3.scale.ordinal()
					.rangeRoundBands([0, w], 0.05);

	var yScale = d3.scale.linear()
					.range([0, h]);
	
	//Define key function, to be used when binding data
	var key = function(d) {
		return d._id;
	};
	
	//Create SVG element
	var svg = d3.select("#barChart")
				.attr("width", w)
				.attr("height", h);

	Deps.autorun(function(){
		var modifier = {};
		/*var modifier = {fields:{overallScore:1}};
		var sortModifier = Session.get('barChartSortModifier');
		if(sortModifier && sortModifier.sort)
			modifier.sort = sortModifier.sort;
		*/
		var fulldata = ProductDatabase.find({},{sort: {overallScore: 1}}).fetch();
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
			console.log(d.length)
			var count = d.length;

		})
		_.each((_.keys(dataset)), function(d){
			console.log(d)
		})

		_.mapValues(dataset, function(val, key) {
		//_.mapObject(dataset, function(val, key){
			key = parseInt(key);
			groupedScores.push({'score': key, 'count': val.length})
		})

		console.log("final array :: ", groupedScores)
		dataset = groupedScores;

		//Update scale domains
		xScale.domain(d3.range(dataset.length));
		yScale.domain([0, d3.max(dataset, function(d) { return d.count; })]);

		//Select…
		var bars = svg.selectAll("rect")
			.data(dataset, key);
		
		//Enter…
		bars.enter()
			.append("rect")
			.attr("x", w)
			.attr("y", function(d) {
				return h - yScale(d.count);
			})
			.attr("width", xScale.rangeBand())
			.attr("height", function(d) {
				return yScale(d.count);
			})
			.attr("fill", function(d) {
				return "rgb(0, 0, " + (d.count * 10) + ")";
			})
			.attr("data-id", function(d){
				return d.score;
			});

		//Update…
		bars.transition()
			// .delay(function(d, i) {
			// 	return i / dataset.length * 1000;
			// }) // this delay will make transistions sequential instead of paralle
			.duration(500)
			.attr("x", function(d, i) {
				return xScale(i);
			})
			.attr("y", function(d) {
				return h - yScale(d.count);
			})
			.attr("width", xScale.rangeBand())
			.attr("height", function(d) {
				return yScale(d.count);
			}).attr("fill", function(d) {
				return "rgb(0, 0, " + (d.count * 10) + ")";
			});

		//Exit…
		bars.exit()
			.transition()
			.duration(500)
			.attr("x", -xScale.rangeBand())
			.remove();



		//Update all labels

		//Select…
		var labels = svg.selectAll("text")
			.data(dataset, key);
		
		//Enter…
		labels.enter()
			.append("text")
			.text(function(d) {
				return d.count;
			})
			.attr("text-anchor", "middle")
			.attr("x", w)
			.attr("y", function(d) {
				return h - yScale(d.count) + 14;
			})						
		   .attr("font-family", "sans-serif")
		   .attr("font-size", "11px")
		   .attr("fill", "white");

		//Update…
		labels.transition()
			// .delay(function(d, i) {
			// 	return i / dataset.length * 1000;
			// }) // this delay will make transistions sequential instead of paralle
			.duration(500)
			.attr("x", function(d, i) {
				return xScale(i) + xScale.rangeBand() / 2;
			}).attr("y", function(d) {
				return h - yScale(d.count) + 14;
			}).text(function(d) {
				return d.count;
			});

		//Exit…
		labels.exit()
			.transition()
			.duration(500)
			.attr("x", -xScale.rangeBand())
			.remove();

	});
});
