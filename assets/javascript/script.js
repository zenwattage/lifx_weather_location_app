// Pointless comment
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
var lifxBulb = "Waiting for bulb info";
var lifxHeaders = "Waiting for header info";
var lifxStateUrl = "Also waiting for bulb info";

firebase.auth().onAuthStateChanged(function (user) {
  DB.ref("users/" + user.uid).on("value", function (snap) {
    if (snap.child("lifx/bulb").exists() && snap.child("lifx/headers").exists()) {
      lifxBulb = snap.child("lifx/bulb").val();
      lifxHeaders = snap.child("lifx/headers").val();
      lifxStateUrl = "https://api.lifx.com/v1/lights/" + lifxBulb + "/state";
      console.log(lifxBulb);
      console.log(lifxHeaders);
      //just calling the api to console log some stuff making sure it's working
    }
    else if (snap.child("lifx/headers").exists()) {
      lifxHeaders = snap.child("lifx/headers").val();
      $.ajax({
        url: 'https://api.lifx.com/v1/lights/all',
        headers: lifxHeaders,
        type: 'GET'

      }).then(function (res) {
        console.log(res);
        for (var i = 0; i < res.length; i++) {
          console.log("id is: " + res[i].id);
          newOpt = $("<option>").val(res[i].id).text(res[i].id);
          $("#bulb-id").append(newOpt);
          $("#bulb-input-modal").modal("show");
        }
      });
    }
    else {
      $("#token-input-modal").modal("show");
    }
  });
});

console.log("bulb ID: " + lifxBulb);
console.log("headers: " + lifxHeaders);

function SetToken(newToken) {
  DB.ref("users/" + uid + "/lifx").set({ headers: { "Authorization": "Bearer " + newToken } });
  $("#token-input-modal").modal("hide");
}
function SetBulb(newBulb) {
  DB.ref("users/" + uid + "/lifx").update({ bulb: newBulb });
  $("#bulb-input-modal").modal("hide");
}


// --- LIFX API CALLS ----





// COLOR FUNCTIONS



//onOff switch
function onOffSwitch() {
  $.ajax({
    type: "POST",
    url: "https://api.lifx.com/v1/lights/" + lifxBulb + "/toggle",
    headers: lifxHeaders,
    contentType: "application/json",
    data: {}
  });

} //end of onOff

$("#onoffbutton").on("click", onOffSwitch);


//red for hot weather 
function redSwitch() {
  $.ajax({
    type: "PUT",
    url: lifxStateUrl,
    headers: lifxHeaders,
    contentType: "application/json",
    data: JSON.stringify({
      "power": "on",
      "color": "red",
      "brightness": 0.1,
      "kelvin": 2700,
      "fast": false,
    })
  });
} // end of redSwitch

$("#redbutton").on("click", redSwitch);



//green switch
function greenSwitch() {
  $.ajax({
    type: "PUT",
    url: lifxStateUrl,
    headers: lifxHeaders,
    contentType: "application/json",
    data: JSON.stringify({
      "power": "on",
      "color": "green",

      "kelvin": 2700,
      "brightness": 0.1,
      "fast": false,
    })
  });

} //end of green

$("#greenbutton").on("click", greenSwitch);


// blue for rain?
// or blue for clear ?  flickering for rain?

function blueSwitch() {
  $.ajax({
    type: "PUT",
    url: lifxStateUrl,
    headers: lifxHeaders,
    contentType: "application/json",
    data: JSON.stringify({
      "power": "on",
      "color": "blue",
      "brightness": 0.1,
      "kelvin": 5000,
      "fast": false,
    })
  });
} //end of blueSwitch

$("#bluebutton").on("click", blueSwitch);



//purple switch
function purpleSwitch() {
  $.ajax({
    type: "PUT",
    url: lifxStateUrl,
    headers: lifxHeaders,
    contentType: "application/json",
    data: JSON.stringify({
      "power": "on",
      "color": "purple",

      "kelvin": 2700,
      "brightness": 0.1,
      "fast": false,
    })
  });

} //end of purple

$("#purplebutton").on("click", purpleSwitch);


//yellow switch
function yellowSwitch() {
  $.ajax({
    type: "PUT",
    url: lifxStateUrl,
    headers: lifxHeaders,
    contentType: "application/json",
    data: JSON.stringify({
      "power": "on",
      "color": "yellow",

      "kelvin": 2700,
      "brightness": 0.1,
      "fast": false,
    })
  });

} //end of yellow

$("#yellowbutton").on("click", yellowSwitch);






// ----- end of LIFX ----



//user clicked input
var clickInput;
//holds the average latitude
var googleLat;
//holds the average longitude
var googleLng;
//60 seconds in a minute
var seconds = 60;
//15 minute timer for our page to refresh
var minutes = 15;
//convert 15 minutes to seconds, use this in our setInterval function
var timeDuration = seconds * minutes;

//our input field...
$("#pac-input").on("keydown", function search(e) {

  //listen for key press
  if (e.keyCode == 13 || e.button == 0) {

    //grab value from input field
    input = $(this).val().trim();

    //we need to do some string manipulation, since the google maps api doesn't like spaces or commas, we get rid of those and put a + sign in the place of a space
    var inputFormat = stringFormat(input);

    console.log("value of input: " + inputFormat);

    //call our function with the specified user input
    placetoCoord(inputFormat);

    //call our placetoCoord function every 15 minutes to get updated weather forecasts
    setInterval(function () {
      placetoCoord(inputFormat);
    }, 1000 * timeDuration);

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

    console.log(searchBox);

    clickInput = searchBox.gm_accessors_.places.Uc.formattedPrediction;

    var clickedInput = stringFormat(clickInput);

    console.log("click input: " + clickedInput);

    placetoCoord(clickedInput);

    //call the weather api every 15 minutes
    setInterval(function () {
      placetoCoord(clickedInput);
    }, 1000 * timeDuration);


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

//format input string. Get rid of "," and spaces, put a "+" in place of space i.e seattle, wa, us would turn out to be seattle+wa+us
function stringFormat(str) {
  str = str.split(",");
  str = str.join("+");
  str = str.split(" ");
  str = str.join("");
  return str;
}

//when user enters a place in the search bar and then presses enter. This function will that place and use the google map api to query that place. Then extract coordinates from that place and use the latitude and longitude of selected place and make another ajax call to the open weather map api. From this second query, we are able to get weather information
function placetoCoord(place) {

  //google map api query using user input
  var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?&address=" + place + "&key=" + gmConfig.apiKey;


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

      //open weather map api call
      var coordQueryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + cndLat + "&lon=" + cndLng + "&units=" + owmConfig.units + "&appid=" + owmConfig.weatherAPIKey;

      //ajax call
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
