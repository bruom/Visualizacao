var regions = ["North America","Europe","CIS","China","SEA"];

var matrix = [
  [0,1,0,4,0],
  [1,5,1,2,1],
  [0,1,0,0,0],
  [4,4,0,2,0],
  [1,0,1,0,0]
];

var svgChord = d3.select("#svgChord"),
    widthChord = +svgChord.attr("width"),
    heightChord = +svgChord.attr("height"),
    outerRadius = Math.min(widthChord, heightChord) * 0.5 - 40,
    innerRadius = outerRadius - 30;

var chordLabel = d3.select("#chordLabel");

//var formatValue = d3.formatPrefix(",.0", 1e3);

var chord = d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending);

var arcChord = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var ribbon = d3.ribbon()
    .radius(innerRadius);

var colorChord = d3.scaleOrdinal()
    .domain(d3.range(4))
    //.range(["#000000", "#FFDD89", "#957244", "#F26223", "#"]);
    .range(["#b70101", "#538fef", "#957244", "#F26223", "#8901b7"]);

var gChord = svgChord.append("g")
    .attr("transform", "translate(" + widthChord / 2 + "," + heightChord / 2 + ")")
    .datum(chord(matrix));

var group = gChord.append("g")
    .attr("class", "groups")
  .selectAll("g")
  .data(function(chords) { return chords.groups; })
  .enter().append("g");

group.append("path")
    .attr("id", "chordPath")
    .style("fill", function(d) { return colorChord(d.index); })
    .style("stroke", function(d) { return d3.rgb(colorChord(d.index)).darker(); })
    .attr("d", arcChord)
    .on("mouseover",mouseoverChord);

var groupTick = group.selectAll(".group-tick")
  //.data(function(d) { return groupTicks(d, 1e3); })
  .data(function(d) { return groupTicks(d, 1); })
  .enter().append("g")
    .attr("class", "group-tick")
    .attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)"; });

groupTick.append("line")
    .attr("x2", 6);

groupTick
  //.filter(function(d) { return d.value % 5e3 === 0; })
  .append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    //.text(function(d) { return formatValue(d.value); });
    .text(function(d) { return d.value;});

gChord.append("g")
    .attr("class", "ribbons")
  .selectAll("path")
  .data(function(chords) { return chords; })
  .enter().append("path")
    .attr("d", ribbon)
    .style("fill", function(d) { return colorChord(d.target.index); })
    .style("stroke", function(d) { return d3.rgb(colorChord(d.target.index)).darker(); });

function mouseoverChord(d, i) {
  chordLabel.text(regions[i]);
}

// Returns an array of tick angles and values for a given group and step.
function groupTicks(d, step) {
  var k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, step).map(function(value) {
    return {value: value, angle: value * k + d.startAngle};
  });
}
