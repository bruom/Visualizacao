

var svgForce = d3.select("#svgForce"),
    widthForce = +svgForce.attr("width"),
    heightForce = +svgForce.attr("height");

//var colorForce = d3.scaleOrdinal(d3.schemeCategory20);

var colorForce = d3.scaleOrdinal()
    .domain(d3.range(6))
    .range(["#ffffff", "#f4eb49", "#b70104", "#7cefe6", "#8d39d6", "#8c5819", "#3ec163"]);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) {return (150 - d.value) * 2; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(widthForce / 2, heightForce / 2));

d3.json("data/forceJson.json", function(error, graph) {
  if (error) throw error;

  var link = svgForce.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return (d.value/20); });

  var nodeForce = svgForce.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return colorForce(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  nodeForce.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    nodeForce
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
