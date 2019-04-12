
// Initialize Firebase
firebase.initializeApp(fbConfig);
  

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

  var cityQueryURL = "https://api.openweathermap.org/data/2.5/weather?q="
     + city + "&units=" + owmConfig.units + "&appid=" 
     + owmConfig.weatherAPIKey;

  $.ajax({
      url: cityQueryURL,
      method: "GET"
  })
      
    .then(function(response) {

      console.log(response);

      owmConfig.cityID = response.id;

      console.log(owmConfig.cityID);

      var idQueryURL = "https://api.openweathermap.org/data/2.5/weather?id=" 
        + owmConfig.cityID + "&units=" + owmConfig.units + "&appid=" + owmConfig.weatherAPIKey;

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
