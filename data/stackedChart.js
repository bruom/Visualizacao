var svgStack = d3.select("#stack"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = svgStack.attr("width") - margin.left - margin.right,
    heightStack = svgStack.attr("height") - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y %m");

var x = d3.scaleTime().range([0, width]),
    yStack = d3.scaleLinear().range([heightStack, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var stack = d3.stack();

var area = d3.area()
    .x(function(d, i) { return x(d.data.Quarter); })
    .y0(function(d) { return yStack(d[0]); })
    .y1(function(d) { return yStack(d[1]); });

var gStack = svgStack.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/mobileMarket.tsv", type, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);
  x.domain(d3.extent(data, function(d) { return d.Quarter; }));
  z.domain(keys);
  stack.keys(keys);

  var layerStack = gStack.selectAll(".layer")
    .data(stack(data))
    .enter().append("g")
      .attr("class", "layer");

  layerStack.append("path")
      .attr("class", "area")
      .style("fill", function(d) { return z(d.key); })
      .attr("d", area);

  layerStack.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
    .append("text")
      .attr("x", 1)
      .attr("y", function(d) { return yStack((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
      .attr("dy", ".35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.key; });

  gStack.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + heightStack + ")")
      .call(d3.axisBottom(x));

  gStack.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(yStack).ticks(10, "%"));
});

function type(d, i, columns) {
  d.Quarter = parseDate(d.Quarter);
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] / 100;
  return d;
}
