
// Initialize Firebase
firebase.initializeApp(fbConfig);
var DB = firebase.database();

// Auth
var uid = "";
// Using a popup.
var provider = new firebase.auth.GoogleAuthProvider();
// provider.addScope('profile');
// provider.addScope('email');
firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token.
    var token = result.credential.accessToken;
    console.log(token);
    // The signed-in user info.
    var user = result.user;
    uid = user.uid;
    // console.log("user id: " + uid);
});

// Database access stuff.
var lifxHeaders = "";
firebase.auth().onAuthStateChanged(function (user) {
    DB.ref("users/" + user.uid).on("value", function (snap) {
        if (snap.child("lifx").exists()) {
            lifxHeaders = snap.child("lifx/headers").val()
            console.log(lifxHeaders);
        }
        else {
            $("#token-input-modal").modal("show");
        }
    });
});

function SetToken(newToken) {
  DB.ref("users/" + uid).set({ lifx: { headers: { "Authorization": "Bearer " + newToken } } });
  $("#token-input-modal").modal("hide");
}

//our input field...
$("#pac-input").on("keydown", function search(e) {

  //listen for key press
  if (e.keyCode == 13) {

    //grab value from input field
    input = $(this).val();

    //we need to do some string manipulation, since the google maps api doesn't like spaces or commas, we get rid of those and put a + sign in the place of a space
    input = input.split(",");


    input = input.join("+");


    input = input.split(" ");


    input = input.join("");

    console.log("value of input: " + input);

    //google map api query using user input
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?&address=" + input + "&key=" + gmConfig.apiKey;


    $.ajax({
      url: queryURL,
      method: "GET"
    })

      .then(function (response) {

        console.log(queryURL);

        console.log(response);

        //grab lattitude from google map api object
        lat = response.results[0].geometry.location.lat;

        //decimal values too long for open weather map api, so we use precision to make the decimal values smaller
        var cndLat = lat.toPrecision(5);

        console.log(cndLat);

        lng = response.results[0].geometry.location.lng;

        var cndLng = lng.toPrecision(5);

        console.log(cndLng);

        console.log("lattitude: " + cndLat);
        console.log("longitude: " + cndLng);

        //open weather map api url using lattitude and longitude that we received from the google map api call
        var coordQueryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + cndLat + "&lon=" + cndLng + "&units=" + owmConfig.units + "&appid=" + owmConfig.weatherAPIKey;

        $.ajax({
          url: coordQueryURL,
          method: "GET"
        })

          .then(function (response) {

            console.log(coordQueryURL);

            console.log(response);

            console.log("today's temperature: " + response.main.temp);

            console.log("today's high: " + response.main.temp_max);

            console.log("today's low: " + response.main.temp_min);

            console.log("today's description: " + response.weather[0].description);

          });

      });
  }

});


function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 47.6062095, lng: -122.3320708 },
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
        console.log("location: " + place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}