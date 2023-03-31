import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import $ from 'jquery';

function FirebaseAccess() {
  // Database access stuff.
  var lifxBulb = 'Waiting for bulb info';
  var lifxHeaders = 'Waiting for header info';
  var lifxStateUrl = 'Also waiting for bulb info';

  firebase.auth().onAuthStateChanged(function (user) {
    DB.ref('users/' + user.uid).on('value', function (snap) {
      if (
        snap.child('lifx/bulb').exists() &&
        snap.child('lifx/headers').exists()
      ) {
        lifxBulb = snap.child('lifx/bulb').val();
        lifxHeaders = snap.child('lifx/headers').val();
        lifxStateUrl = 'https://api.lifx.com/v1/lights/' + lifxBulb + '/state';
        // console.log(lifxBulb);
        // console.log(lifxHeaders);
        //just calling the api to console log some stuff making sure it's working
      } else if (snap.child('lifx/headers').exists()) {
        lifxHeaders = snap.child('lifx/headers').val();
        $.ajax({
          url: 'https://api.lifx.com/v1/lights/all',
          headers: lifxHeaders,
          type: 'GET',
        }).then(function (res) {
          console.log(res);
          for (var i = 0; i < res.length; i++) {
            console.log('id is: ' + res[i].id);
            newOpt = $('<option>').val(res[i].id).text(res[i].id);
            $('#bulb-id').append(newOpt);
            $('#bulb-input-modal').modal('show');
          }
        });
      } else {
        $('#token-input-modal').modal('show');
      }
    });
  });

  function SetToken(newToken) {
    DB.ref('users/' + uid + '/lifx').set({
      headers: { Authorization: 'Bearer ' + newToken },
    });
    $('#token-input-modal').modal('hide');
  }
  function SetBulb(newBulb) {
    DB.ref('users/' + uid + '/lifx').update({ bulb: newBulb });
    $('#bulb-input-modal').modal('hide');
  }

  return null;
}

export default FirebaseAccess;
