// data - insert data here to add all streams for Top 200 songs in each country and globe
//dataCategories=spotifyCountries, dataArray=spotifyStreams
var countryStreams = {};

d3.json("http://127.0.0.1:5000/spotify")
    .then(
        function(songs) {
            songs.forEach(
                function(song) {
                  var songCountry = song["country"];
                  var songStreams = song["streams"];
                  if(countryStreams[songCountry]) {
                    countryStreams[songCountry] += songStreams;
                  }
                  else {
                    countryStreams[songCountry] = songStreams;
                  }
                }
            );
            // clean up 'global' item
            delete countryStreams["global"];
            
            makeResponsive();
        }
    )
;

//var spotifyStreams = [10911589, 26887107, 594091, 2165734, 69131311, 1146580, 1156564];
//var spotifyCountries = ["Australia", "Brazil", "South Africa", "Switzerland", "United States", "Vietnam", "Global Average"];

function makeResponsive() {
  var spotifyStreams = Object.values(countryStreams);
  var spotifyCountries = Object.keys(countryStreams);
    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

    // svg params
  var svgHeight = window.innerHeight;
  var svgWidth = window.innerWidth;

    // margins
  var margin = {
    top: 50,
    right: 150,
    bottom: 50,
    left: 150
  };

    // chart area minus margins
  var chartHeight = svgHeight - margin.top - margin.bottom;
  var chartWidth = svgWidth - margin.left - margin.right;

    // create svg container
  var svg = d3.select("body").append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // shift everything over by the margins
  var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // scale y to chart height
  var yScale = d3.scaleLinear()
        .domain([0, d3.max(spotifyStreams)])
        .range([chartHeight, 0]);

    // scale x to chart width
  var xScale = d3.scaleBand()
        .domain(spotifyCountries)
        .range([0, chartWidth])
        .padding(0.1);

    // create axes
  var yAxis = d3.axisLeft(yScale);
  var xAxis = d3.axisBottom(xScale);

    // set x to the bottom of the chart
  chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    // set y to the y axis
  chartGroup.append("g")
        .call(yAxis);


  chartGroup.selectAll("rect")
        .data(spotifyStreams)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(spotifyCountries[i]))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d))
        .attr("fill", "mediumseagreen")
        // event listener for onclick event
        .on("click", function(d, i) {
          alert(`${spotifyCountries[i]} has ${spotifyStreams[i]} streams in Spotify Top 200`);
        })
        // event listener for mouseover
        .on("mouseover", function() {
          d3.select(this)
                .attr("fill", "darkseagreen");
        })
        // event listener for mouseout
        .on("mouseout", function() {
          d3.select(this)
                .attr("fill", "mediumseagreen");
        });
}

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);