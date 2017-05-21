var svgTrend = d3.select("#trends"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svgTrend.attr("width") - margin.left - margin.right,
    height = +svgTrend.attr("height") - margin.top - margin.bottom,
    g = svgTrend.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("id","trendG");

var games = ["LoL", "DotA", "CS:GO"];
var colors = ["goldenrod", "red","steelblue"];

for(i=0; i<3; i++){
  svgTrend.append("circle")
      .attr("cy", function(d){return 50 + 30*i;})
      .attr("cx", 80)
      .attr("r", 5)
      .attr("fill", colors[i]);
  svgTrend.append("text")
      .attr("x", 90)
      .attr("y", function(d){return 55 + 30*i;})
      .text(games[i]);
}


var parseTime = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var lineDota = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.dota); });

var lineLol = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.lol); });

var lineCsgo = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.csgo); });

d3.csv("data/esportsGames.csv", function(d) {
  d.date = parseTime(d.date);
  d.dota = +d.dota;
  d.lol = +d.lol;
  d.csgo = +d.csgo;
  return d;
}, function(error, data) {
  if (error) throw error;
  x.domain(d3.extent(data, function(d) { return d.date; }));
  //y.domain(d3.extent(data, function(d) { return d.lol; }));
  y.domain([0,100]);
  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Popularidade relativa");
  g.append("path")
      .attr("id", "pathDota")
      .datum(data)
      .attr("class", "trendPath")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2.5)
      .attr("d", lineDota);
  g.append("path")
      .attr("id", "pathLol")
      .datum(data)
      .attr("class", "trendPath")
      .attr("fill", "none")
      .attr("stroke", "goldenrod")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2.5)
      .attr("d", lineLol);
  g.append("path")
      .attr("id", "pathCsgo")
      .datum(data)
      .attr("class", "trendPath")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2.5)
      .attr("d", lineCsgo);

});
