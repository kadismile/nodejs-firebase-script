const admin = require('firebase-admin');
const firestoreConfig =require("./firestoreConfig");
module.exports = admin.initializeApp({
  credential: admin.credential.cert(firestoreConfig),
  databaseURL: "https://estate-managers.firebaseio.com"
});