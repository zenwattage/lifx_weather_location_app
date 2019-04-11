
var weatherAPIKey = "b0162c0944ec2d5f987eb39c7b914117";
var idInput = "2172797"
var zipCodeInput;
var units = "imperial";
var cityID;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDd3BtmB_Yt1nkW8WG25orFzOW_hHm84-Y",
    authDomain: "project1-e4ebd.firebaseapp.com",
    databaseURL: "https://project1-e4ebd.firebaseio.com",
    projectId: "project1-e4ebd",
    storageBucket: "project1-e4ebd.appspot.com",
    messagingSenderId: "404140451591"
};
firebase.initializeApp(config);
  

  //look into parseint() returns true if a number nan (not a number) if false
$("#submit").on("click", function(event) {

  event.preventDefault();

  var userInput = $("#input").val().trim();

  console.log(userInput);

  if (userInput != ""){
    citytoID(userInput);
  }
  else {
    $(".input-error").show();
  }

});


function citytoID (city) {

  var cityQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + weatherAPIKey;

  $.ajax({
      url: cityQueryURL,
      method: "GET"
  })
      
    .then(function(response) {

      console.log(response);

      cityID = response.id;

      console.log(cityID);

      var idQueryURL = "https://api.openweathermap.org/data/2.5/weather?id=" + cityID + "&units=" + units + "&appid=" + weatherAPIKey;

        $.ajax({
          url: idQueryURL,
          method: "GET"
        })
          
          .then(function(response) {
    
            console.log(idQueryURL);

            console.log(response);

            console.log("today's temperature: " + response.main.temp);

            console.log("today's high: " + response.main.temp_max);

            console.log("today's low: " + response.main.temp_min);

            console.log("today's description: " + response.weather[0].description);
    
            //console.log(cityID);
          });
  });

}

//google maps integration
function initMap() {
  var map = new google.maps.Map(
      document.getElementById('map'),
      {center: {lat: -33.8688, lng: 151.2195}, zoom: 13});

  var input = document.getElementById('pac-input');

  var autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.bindTo('bounds', map);

  // Specify just the place data fields that you need.
  autocomplete.setFields(['place_id', 'geometry', 'name', 'formatted_address']);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  var geocoder = new google.maps.Geocoder;

  var marker = new google.maps.Marker({map: map});
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    var place = autocomplete.getPlace();

    if (!place.place_id) {
      return;
    }
    geocoder.geocode({'placeId': place.place_id}, function(results, status) {
      if (status !== 'OK') {
        window.alert('Geocoder failed due to: ' + status);
        return;
      }

      map.setZoom(11);
      map.setCenter(results[0].geometry.location);

      // Set the position of the marker using the place ID and location.
      marker.setPlace(
          {placeId: place.place_id, location: results[0].geometry.location});

      marker.setVisible(true);

      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-id'].textContent = place.place_id;
      infowindowContent.children['place-address'].textContent =
          results[0].formatted_address;

      infowindow.open(map, marker);
    });
  });
}

/* $(document).ready(function () {
  $(".input-error").hide();
});
 */
