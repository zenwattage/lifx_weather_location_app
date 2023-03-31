
import { uid, SetToken, SetBulb } from './auth.js';
import { DB } from './firebaseInit.js';

// Database access stuff
var lifxBulb = "Waiting for bulb info";
var lifxHeaders = "Waiting for header info";
var lifxStateUrl = "Also waiting for bulb info";

firebase.auth().onAuthStateChanged(function (user) {
    DB.ref("users/" + user.uid).on("value", function (snap) {
        if (snap.child("lifx/bulb").exists() && snap.child("lifx/headers").exists()) {
            lifxBulb = snap.child("lifx/bulb").val();
            lifxHeaders = snap.child("lifx/headers").val();
            lifxStateUrl = "https://api.lifx.com/v1/lights/" + lifxBulb + "/state";
            // console.log(lifxBulb);
            // console.log(lifxHeaders);
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
// COLOR FUNCTIONS
//onOff switch
function onOffSwitch() {
    $.ajax({
        type: "POST",
        url: "https://api.lifx.com/v1/lights/" + lifxBulb + "/toggle",
        headers: lifxHeaders,
        contentType: "application/json",
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
            "brightness": 0.7,
            // "kelvin": 2700,
            "fast": false,
            // "defaults":
            // {
            //   "duration": 5.0 // all states will be applied over 5 seconds

            // }
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
            "brightness": 0.7,
            "fast": false,
            "defaults":
            {
                "duration": 6.0 // all states will be applied over 5 seconds

            }
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
            "brightness": 0.7,
            "kelvin": 5000,
            "fast": false,
            "defaults":
            {
                "duration": 5.0 // all states will be applied over 5 seconds

            }
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
            "brightness": 0.7,
            "fast": false,
            "defaults":
            {
                "duration": 6.0 // all states will be applied over 5 seconds

            }
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
            "brightness": 0.7,
            "fast": false,
            "defaults":
            {
                "duration": 6.0 // all states will be applied over 5 seconds

            }
        })
    });

} //end of yellow

$("#yellowbutton").on("click", yellowSwitch);






// ----- end of LIFX ----