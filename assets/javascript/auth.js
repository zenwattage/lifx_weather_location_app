//c57333a0e0ce83e77148a50632b168f05b9cae67d5963ee8432bc349340b12ac

import { DB } from './firebaseInit.js';

export function SetToken(newToken) {
    DB.ref("users/" + uid + "/lifx").set({ headers: { "Authorization": "Bearer " + newToken } });
    $("#token-input-modal").modal("hide");
}

export function SetBulb(newBulb) {
    DB.ref("users/" + uid + "/lifx").update({ bulb: newBulb });
    $("#bulb-input-modal").modal("hide");
}
