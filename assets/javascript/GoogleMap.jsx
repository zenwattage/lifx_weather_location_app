import React from 'react';

class GoogleMaps extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var clickInput;
    var googleLat;
    var googleLng;
    var seconds = 60;
    var minutes = 15;
    var timeDuration = seconds * minutes;
    var rainId = [
      200, 201, 202, 210, 211, 212, 221, 230, 231, 232, 300, 301, 302, 310, 311,
      312, 313, 314, 321, 500, 501, 502, 503, 504, 511, 520, 521, 522, 531,
    ];

    $('#pac-input').on('keydown', function search(e) {
      if (e.keyCode == 13 || e.button == 0) {
        input = $(this).val().trim();

        var inputFormat = stringFormat(input);

        console.log('value of input: ' + inputFormat);

        placetoCoord(inputFormat);

        setInterval(function () {
          placetoCoord(inputFormat);
        }, 1000 * timeDuration);
      }
    });

    function initAutocomplete() {
      var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 47.6062095, lng: -122.3320708 },
        zoom: 13,
        mapTypeId: 'roadmap',
      });

      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
      });

      var markers = [];

      searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        console.log(places);

        if (places.length > 0) {
          var clickInput = places[0].formatted_address;
          console.log(clickInput);
        } else {
          console.log('No places found');
          return;
        }

        var clickedInput = stringFormat(clickInput);

        console.log('click input: ' + clickedInput);

        placetoCoord(clickedInput);

        setInterval(function () {
          placetoCoord(clickedInput);
        }, 1000 * timeDuration);

        if (places.length == 0) {
          return;
        }

        markers.forEach(function (marker) {
          marker.setMap(null);
        });
        markers = [];

        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
          if (!place.geometry) {
            console.log('Returned place contains no geometry');
            return;
          }
          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
          };

          markers.push(
            new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location,
            })
          );

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
            console.log('location: ' + place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    }
    function placetoCoord(place) {
  // ...existing code...
  .then(function (response) {
    console.log(coordQueryURL);
    console.log(response);
    var temp = response.main.temp;
    var id = response.weather[0].id;
    console.log("today's temperature: " + temp);
    console.log("today's description: " + response.weather[0].description);
    console.log("today's description: " + id);

    if (temp >= 80 && rainId.indexOf(id) < 0) {
      //call red function
      console.log("it's hot out");
      redSwitch();
    }
    //if temp less than 60 and id is in rainid array...
    else if (temp < 60 && rainId.indexOf(id) > -1) {
      //call blue function
      console.log(rainId.indexOf(id));
      console.log("it's chilly outside and raining");
      blueSwitch();
    }
    //if temp is less than 60 and id is not in rainid array...
    else if (temp < 60 && rainId.indexOf(id) < 0) {
      //call purple function
      console.log(rainId.indexOf(id));
      console.log("it's chilly outside");
      purpleSwitch();
    }
    //if temp is greater than 60, or less than 85 and is not a rainid
    else if ((temp >= 60 && rainId.indexOf(id) < 0) || (temp < 80 && rainId.indexOf(id) < 0)) {
      //call green function
      console.log(rainId.indexOf(id));
      console.log("it's nice outside");
      greenSwitch();
    }
    //if temp is greater than 60, or less than 85 and is in rainid
    else if ((temp >= 60 && rainId.indexOf(id) > -1) || (temp < 80 && rainId.indexOf(id) > -1)) {
      //call blue function
      console.log(rainId.indexOf(id));
      console.log("it's nice outside and it's raining");
      blueSwitch();
    }
  });
}


  }
}
