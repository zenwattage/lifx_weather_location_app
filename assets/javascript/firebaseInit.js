function initializeFirebase() {
    // Initialize Firebase// Initialize Firebase
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
        // console.log(token);
        // The signed-in user info.
        var user = result.user;
        uid = user.uid;
        // console.log("user id: " + uid);
    });

    return firebase.database();
}
