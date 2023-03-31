import $ from 'jquery';

const rainId = [200, 201, 202, 210, 211, 212, 221, 230, 231, 232,
    300, 301, 302, 310, 311, 312, 313, 314, 321, 500, 501, 502, 503,
    504, 511, 520, 521, 522, 531];

function placetoCoord(place, owmConfig) {
    const queryURL = `https://maps.googleapis.com/maps/api/geocode/json?&address=${place}&key=${gmConfig.apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            const lat = response.results[0].geometry.location.lat;
            const cndLat = lat.toPrecision(5);
            const lng = response.results[0].geometry.location.lng;
            const cndLng = lng.toPrecision(5);
            const coordQueryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${cndLat}&lon=${cndLng}&units=${owmConfig.units}&appid=${owmConfig.weatherAPIKey}`;

            $.ajax({
                url: coordQueryURL,
                method: "GET"
            })
                .then(function (response) {
                    const temp = response.main.temp;
                    const id = response.weather[0].id;

                    if (temp >= 80 && rainId.indexOf(id) < 0) {
                        console.log("it's hot out");
                    }
                    else if (temp < 60 && rainId.indexOf(id) > -1) {
                        console.log("it's chilly outside and raining");
                    }
                    else if (temp < 60 && rainId.indexOf(id) < 0) {
                        console.log("it's chilly outside");
                    }
                    else if ((temp >= 60 && rainId.indexOf(id) < 0) || (temp < 80 && rainId.indexOf(id) < 0)) {
                        console.log("it's nice outside");
                    }
                    else if ((temp >= 60 && rainId.indexOf(id) > -1) || (temp < 80 && rainId.indexOf(id) > -1)) {
                        console.log("it's nice outside and it's raining");
                    }
                });
        });
}

export default placetoCoord;
