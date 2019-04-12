
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

$(document).ready(function () {
  $(".input-error").hide();
});
