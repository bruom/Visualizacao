d3.select("#report").text("Aponte um país");

var h = 450,
    w = 660;

var minimum = 0, maximum = 26116;
var minimumColor = "#BFD3E6", maximumColor = "#88419D";
var color = d3.scaleLinear().domain([minimum, maximum]).range([minimumColor, maximumColor]);


// set-up unit projection and path
var projection = d3.geoMercator()
    .center([0,90])
    .scale(1)
    .rotate([0,-3])
    .translate([0, -0.8]);
var path = d3.geoPath()
    .projection(projection);
// set-up svg canvas
var svg = d3.select("#map").append("svg")
    .attr("height", h)
    .attr("width", w);
//https://github.com/johan/world.geo.json
/*d3.json("/data/countries.geo.json", function(error, data) {
    d3.csv("/data/cellsubs.csv", function(error, csv) {
        var world = data.features;
        csv.forEach(function(d, i) {
            world.forEach(function(e, j) {
                if (d.id === e.id) {
                    e.name = d.Entity;
                    e.value = d.subs;
                }
            })
        })
        // calculate bounds, scale and transform
        // see http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
        var b = path.bounds(data),
            s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
            t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];
        projection.scale(s)
            .translate(t);
        svg.selectAll("path")
            .data(world).enter()
            .append("path")
            .style("fill", function(d) {
      	  return color(d.value);
            })
            .style("stroke", "grey")
            .style("stroke-width", "1px")
            .attr("d", path)
            .on("mouseover", function(d, i) {
                reporter(d);
            });
    })
    function reporter(x) {
        console.log(x)
        d3.select("#report").text(function() {
            return x.name;
        });
    }
})*/

//function byArea(){
  d3.json("data/countries.geo.json", function(error, data) {
    var world = data.features;

    d3.csv("data/countries.csv", function(error, csvCountries) {

      d3.csv("data/internet.csv", function(error, csvInternet){

        d3.csv("data/idCountry.csv", function(error, idCountry){
          world.forEach(function(e,j){
            idCountry.forEach(function(d,i){
              if(d.id == e.id){
                e.name = d.name;
              }
            })

            csvCountries.forEach(function(ctr,i){
                if(e.name == ctr.name){
                  e.id2 = ctr.CountryCode;
                  e.area = ctr.Area;
                }
            })

            csvInternet.forEach(function(net,i){
              if(e.id2 == net.id2.toUpperCase()){
                e.internetRate = net.kbps;
              }
            })

          })

          var b = path.bounds(data),
              s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
              t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];
              projection.scale(s)
                  .translate(t);
              svg.selectAll("path")
                  .data(world).enter()
                  .append("path")
                  .style("fill", function(d, i) {
                return color(d.internetRate);
                  })
                  .style("stroke", "grey")
                  .style("stroke-width", "1px")
                  .attr("d", path)
                  .on("mouseover", function(d, i) {
                      reporter(d);
                  });

        })
      })
    })



      function reporter(x) {
          console.log(x)
          d3.select("#report").text(function() {
              if (x.name == null || x.internetRate == null){
                return "Dados indisponíveis";
              }
              return (x.name + ": " + x.internetRate);
          });
      }
    })
//}
