var svgTree = d3.select("#treemap"),
    widthTree = +svgTree.attr("width"),
    heightTree = +svgTree.attr("height");

//var legends = d3.select(".legends");

var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
    //color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
    format = d3.format(",d");

var treemap = d3.treemap()
    .tile(d3.treemapResquarify)
    .size([widthTree, heightTree-30])
    .round(true)
    .paddingInner(1);

d3.json("data/eSportsHours.json", function(error, data) {
  if (error) throw error;

  /*for (i=0; i<data.children.length; i++){
    console.log(data.children[i].name);
    console.log(data.children[i].color);
  }*/

  var rootTree = d3.hierarchy(data)
      .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
      .sum(sumBySize)
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

  treemap(rootTree);

  var cellTree = svgTree.selectAll("g")
    .data(rootTree.leaves())
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

  cellTree.append("rect")
      .attr("id", function(d) { return d.data.id; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("fill", function(d) {return shadeColor2(d.parent.data.color, (1-d.data.percent)); });

  cellTree.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.data.id; })
    .append("use")
      .attr("xlink:href", function(d) { return "#" + d.data.id; });

  cellTree.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
    .selectAll("tspan")
      .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
    .enter().append("tspan")
      .attr("x", 4)
      .attr("y", function(d, i) { return 13 + i * 10; })
      .text(function(d) { return d; });

  cellTree.append("title")
      .text(function(d) { return d.data.id + "\n" + format(d.value); });


  svgTree.selectAll(".legend")
      .data(data.children)
      .enter().append("text")
        .attr("transform", function(d,i) { return "translate(" + 15 + ", " + (heightTree-22+i*10) +")"; })
        .attr("fill", function(d) { return d.color; })
        .text(function(d) {return d.name; });

  svgTree.selectAll(".legend")
      .data(data.children)
      .enter().append("circle")
        .attr("cy", function(d,i){return (heightTree-26+i*10)})
        .attr("cx", 8)
        .attr("r", 5)
        .attr("fill", function(d){ return d.color});
});

function sumBySize(d) {
  return d.size;
}

function shadeColor2(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
