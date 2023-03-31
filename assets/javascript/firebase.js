import firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
    // your firebase config object here
};
firebase.initializeApp(firebaseConfig);

const DB = firebase.database();
const auth = firebase.auth();

export function SetToken(newToken, uid) {
    DB.ref("users/" + uid + "/lifx").set({ headers: { "Authorization": "Bearer " + newToken } });
}

export function SetBulb(newBulb, uid) {
    DB.ref("users/" + uid + "/lifx").update({ bulb: newBulb });
}

export default auth;
