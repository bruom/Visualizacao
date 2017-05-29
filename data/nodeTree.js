var svgNode = d3.select("#nodelink"),
    widthNode = +svgNode.attr("width"),
    heightNode = +svgNode.attr("height"),
    gNode = svgNode.append("g").attr("transform", "translate(99.5,0)");

var tree = d3.tree()
    .size([heightNode, widthNode - 260]);

var stratify = d3.stratify()
    .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

d3.csv("data/gameDev.csv", function(error, data) {
  if (error) throw error;

  var root = stratify(data)
      .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });

  var link = gNode.selectAll(".link")
    .data(tree(root).links())
    .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; }));

  var node = gNode.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
      .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

  node.append("circle")
      .attr("r", 2.5);

  node.append("text")
      .attr("dy", 3)
      .attr("x", function(d) { return d.children ? -8 : 8; })
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .style("fill","#000000")
      .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });
});
