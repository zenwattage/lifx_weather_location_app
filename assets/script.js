
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
$("#submit").on("click", function (event) {

  event.preventDefault();

  var userInput = $("#input").val().trim();

  console.log(userInput);

  if (userInput != "") {
    citytoID(userInput);
  }
  else {
    $(".input-error").show();
  }

});


function citytoID(city) {

  var cityQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + weatherAPIKey;

  $.ajax({
    url: cityQueryURL,
    method: "GET"
  })

    .then(function (response) {

      console.log(response);

      cityID = response.id;

      console.log(cityID);

      var idQueryURL = "https://api.openweathermap.org/data/2.5/weather?id=" + cityID + "&units=" + units + "&appid=" + weatherAPIKey;

      $.ajax({
        url: idQueryURL,
        method: "GET"
      })

        .then(function (response) {

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

// --- LIFX API CALLS ----

var bearer = "Bearer ";

//CHANGE THIS TO YOUR PERSONAL LIFX TOKEN
var lifxToken = "";//"cd98e1a574aeb1bb0a18dea42aa3a2ed817ac938425df6acaecd1547d3253e58";
//CHANGE THIS TO THE ID OF THE BULB YOU WANT
var myDeskLamp = ""; //"d073d53e6090";

var lifxStateUrl = "https://api.lifx.com/v1/lights/" + myDeskLamp + "/state";

$.ajax({
  url: 'https://api.lifx.com/v1/lights/all',
  headers: { "Authorization": bearer + lifxToken },
  type: 'GET'

}).then(function (res) {
  console.log(res);
  console.log("id is: " + res[0].id);
  console.log("color is: " + res[0].color);
  console.log("kevlin is: " + res[0].color.kelvin);
  console.log("hue is: " + res[0].color.hue);
  console.log("power is: " + res[0].power);

  //console.log(res[0].data);
})


// COLOR FUNCTIONS


//red for hot weather 
function redSwitch() {
  $.ajax({
    type: "PUT",
    url: lifxStateUrl,
    headers: { "Authorization": bearer + lifxToken },
    data: {
      "power": "on",
      "color": "red",
      "brightness": 0.1,
      "kelvin": 2700,
      "fast": false,
      "defaults":
      {
        "duration": 5.0 // all states will be applied over 5 seconds

      }
    }
  });
} // end of redSwitch

$("#redbutton").on("click", redSwitch);



//green switch
function greenSwitch() {
  $.ajax({
    type: "PUT",
    url: lifxStateUrl,
    headers: { "Authorization": bearer + lifxToken },
    data: {
      "power": "on",
      "color": "green",

      "kelvin": 2700,
      "brightness": 0.1,
      "fast": false,
      "defaults":
      {
        "duration": 6.0 // all states will be applied over 5 seconds

      }
    }
  });

} //end of green

$("#greenbutton").on("click", greenSwitch);


// blue for rain?
// or blue for clear ?  flickering for rain?

function blueSwitch() {
  $.ajax({
    type: "PUT",
    url: lifxStateUrl,
    headers: { "Authorization": bearer + lifxToken },
    data: {
      "power": "on",
      "color": "blue",
      "brightness": 0.1,
      "kelvin": 5000,
      "fast": false,
      "defaults":
      {
        "duration": 5.0 // all states will be applied over 5 seconds

      }
    }
  });
} //end of blueSwitch

$("#bluebutton").on("click", blueSwitch);



//purple switch
function purpleSwitch() {
  $.ajax({
    type: "PUT",
    url: lifxStateUrl,
    headers: { "Authorization": bearer + lifxToken },
    data: {
      "power": "on",
      "color": "purple",

      "kelvin": 2700,
      "brightness": 0.1,
      "fast": false,
      "defaults":
      {
        "duration": 6.0 // all states will be applied over 5 seconds

      }
    }
  });

} //end of purple

$("#purplebutton").on("click", purpleSwitch);


//yellow switch
function yellowSwitch() {
  $.ajax({
    type: "PUT",
    url: lifxStateUrl,
    headers: { "Authorization": bearer + lifxToken },
    data: {
      "power": "on",
      "color": "yellow",

      "kelvin": 2700,
      "brightness": 0.1,
      "fast": false,
      "defaults":
      {
        "duration": 6.0 // all states will be applied over 5 seconds

      }
    }
  });

} //end of yellow

$("#yellowbutton").on("click", yellowSwitch);




$(document).ready(function () {
  $(".input-error").hide();
});
