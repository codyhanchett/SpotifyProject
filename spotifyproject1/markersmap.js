
// d3.csv("/data/employees.csv", function(data) {
//   for (var i = 0; i < data.length; i++) {
//       console.log(data[i].Name);
//       console.log(data[i].Age);
//   }
// });

var topSongs = {};
d3.json("http://127.0.0.1:5000/spotify")
    .then(
        function(songs) {
          songs.forEach(
            function(song) {
              var songCountry = song.country;
              if(!topSongs[songCountry]) {
                topSongs[songCountry] = song;
              }
              else {
                var currentSong = topSongs[songCountry];
                if(song.streams > currentSong.streams) {
                  topSongs[songCountry] = song;
                }
              }
            }
          );
          console.log(topSongs);
          createMap();
        }
    )
;



function createMap() {
  // Creating our initial map object
  // We set the longitude, latitude, and the starting zoom level
  // This gets inserted into the div with an id of 'map'
  var myMap = L.map("map", {
      center: [0, 0],
      zoom: 2.8
    });
    
    // Adding a tile layer (the background map image) to our map
    // We use the addTo method to add objects to our map
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    }).addTo(myMap);
    
    
    // Use this link to get the geojson data.
    // var link = "Solved/us.geojson";
    
    // Grabbing our GeoJSON data..
    // d3.json(link, function(data) {
    //   // Creating a GeoJSON layer with the retrieved data
    //   L.geoJson(data).addTo(myMap);
    // });

    var countryMap = {
      "us": "United States",
      "brazil": "Brazil",
      "australia": "Australia",
      "south africa" : "South Africa",
      "switzerland" : "Switzerland",
      "vietnam" : "Vietnam"
    };
    
    var markers = [{
      location: [39.8283, -95.5795],
      key: "us"
    },
    {
      location: [-30.5595, 22.9375],
      key: "south africa" 
    },
    {
      location: [-25.2744, 133.7751],
      key: "australia"
    },
    {
      location: [-14.2350, -51.9253],
      key: "brazil"
    },
    {
      location: [14.0583, 108.2772],
      key: "vietnam"
    },
    {
      location: [46.8182, 8.2275],
      key: "switzerland"
    }
    ];
    
    for (var i = 0; i < markers.length; i++) {
      var marker = markers[i];
      var markerKey = marker.key;
      if(markerKey) {
        L.marker(marker.location)
          .bindPopup("<h1>" + countryMap[markerKey] + "</h1> <hr> <h3>Top Streamed Song: " + topSongs[markerKey]["track_name"] + "</h3> <hr> <h5>URL: " + topSongs[markerKey]["url"] + "</h5>")
          .addTo(myMap);
      }
    }
}