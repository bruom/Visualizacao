function averageAngleInterval(num){
  var resultingAngles = [0];
  var interval = (6.283/num);
  while(resultingAngles.length < num){
    resultingAngles.push(resultingAngles[resultingAngles.length-1] + interval);
  }

  return resultingAngles;
}

var svgSimilarity = d3.select("#similarity");

var centreX = svgSimilarity.attr("width")/2,
    centreY = svgSimilarity.attr("height")/2,
    radius = 200;

var items = ["BTS","EULCS","iWD","LCK","PGL_Dota","Summit1G","TwitchPresents"];
var colors = ["#f44a41","#ecf725" ,"#ecf725", "#ecf725" ,"#f44a41","#263def" ,"#c41ff2"];
var angles = averageAngleInterval(items.length);

var similarityMatrix = [];
for (var i = 0; i < items.length; i++) {
  similarityMatrix.push(Array(items.length).fill(0));
}

svgSimilarity.append("g").selectAll("circle")
  .data(items)
  .enter()
  .append("circle")
  .attr("cx",function(d,i){
    return centreX + (radius*Math.cos(angles[i]));
  })
  .attr("cy",function(d,i){
    return centreY + (radius*Math.sin(angles[i]));
  })
  .attr("r", 20)
  .attr("id", function(d,i){
    return "circle"+i;
  })
  .attr("fill", function(d,i){
    return colors[i];
  })
  .append("svg:title")
  .text((function(d){return d}));


var widthScale = d3.scaleLinear()
  .domain([0,25000])
  .range([0,10]);
similarityMatrix = [[0,25,1,337,8391,1,177],[25,0,23,24376,244,1,5133],[1,23,0,1,1,1,1],[337,24376,1,0,288,1,96],[8391,244,1,288,0,1,2641],[1,1,1,1,1,0,264],[177,5133,1,96,2641,264,0]];
for (var m1 = 0; m1 < 7; m1++) {
  for (var m2 = 0; m2 < 7; m2++) {
    if (similarityMatrix[m1][m2] > 1) {
      var linkWidth = widthScale(similarityMatrix[m1][m2]);
      svgSimilarity.append("line")
        .attr("x1", d3.select("#circle"+m1).attr("cx"))
        .attr("x2", d3.select("#circle"+m2).attr("cx"))
        .attr("y1", d3.select("#circle"+m1).attr("cy"))
        .attr("y2", d3.select("#circle"+m2).attr("cy"))
        .attr("stroke-width", linkWidth)
        .attr("stroke", "black");
    }
  }
}
