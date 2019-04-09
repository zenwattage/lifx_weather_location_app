var weatherAPIKey = "b0162c0944ec2d5f987eb39c7b914117";
var cityInput = "Seattle";
var idInput = "2172797"
var zipCodeInput;
var units = "imperial";

var cityQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=" + units + "&appid=" + weatherAPIKey;

var idQueryURL = "https://api.openweathermap.org/data/2.5/weather?id=" + idInput + "&appid=" + weatherAPIKey;





$.ajax({
      url: cityQueryURL,
      method: "GET"
    })
      
      .then(function(response) {

        console.log(cityQueryURL);

        console.log(response.id);

});
