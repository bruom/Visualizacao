var minimumColor = "#BFD3E6", maximumColor = "#88419D";

var body = d3.select("body");

var map = d3.select("#carto"),
    layer = map.append("g")
      .attr("id", "layer"),
    states = layer.append("g")
      .attr("id", "states")
      .selectAll("path");

var proj = d3.geoAlbersUsa(),
    topology,
    geometries,
    rawData,
    dataById = {},
    carto = d3.cartogram()
      .projection(proj)
      .properties(function(d) {
        return dataById[d.id];
      })
      .value(function(d) {
        return +d.properties["INTERNET"];
      });

window.onhashchange = function() {
  parseHash();
};

d3.json("data/us-states.json", function(topo) {
  console.log(topo);
  topology = topo;
  geometries = topology.objects.states.geometries;
  d3.csv("data/nst_2011_v2.csv", function(data) {
    console.log(data);
    rawData = data;
    dataById = d3.nest()
      .key(function(d) { return d.NAME; })
      .rollup(function(d) { return d[0]; })
      .map(data);
    init();
  });
});

function init() {
  var features = carto.features(topology, geometries),
      path = d3.geo.path()
        .projection(proj);

  states = states.data(features)
    .enter()
    .append("path")
      .attr("class", "state")
      .attr("id", function(d) {
        return d.properties.NAME;
      })
      .attr("fill", "#fafafa")
      .attr("d", path);

  states.append("title");

  parseHash();
}

function update() {
  var //key = field.key.replace("%d", year), // csv collumn name
      key = "INTERNET",
      value = function(d) {
        return +d.properties[key];
      },
      values = states.data()
        .map(value)
        .filter(function(n) {
          return !isNaN(n);
        })
        .sort(d3.ascending),
      lo = values[0],
      hi = values[values.length - 1];
  var color = d3.scale.linear()
    .range([minimumColor,maximumColor])
    .domain(lo < 0
      ? [lo, 0, hi]
      : [lo, d3.mean(values), hi]);
  // normalize the scale to positive numbers
  var scale = d3.scale.linear()
    .domain([lo, hi])
    .range([1, 1000]);

  // tell the cartogram to use the scaled values
  carto.value(function(d) {
    return scale(value(d));
  });

  // generate the new features, pre-projected
  var features = carto(topology, geometries).features;

  // update the data
  states.data(features)
    .select("title")
      .text(function(d) {
        return [d.properties.NAME, value(d)].join(": ");
      });

  states.transition()
    .duration(1)
    .ease("linear")
    .attr("fill", function(d) {
      return color(value(d));
    })
    .attr("d", carto.path);
}

function parseHash(){
  update.apply(null, arguments);}
