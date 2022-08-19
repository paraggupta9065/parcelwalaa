var admin = require("firebase-admin");


const firebaseConfig = {
    apiKey: "AIzaSyCYGD3DwuQcWklpa3ABh49F7KcEr4C2FAU",
    authDomain: "parcelwalaa-47f46.firebaseapp.com",
    projectId: "parcelwalaa-47f46",
    storageBucket: "parcelwalaa-47f46.appspot.com",
    messagingSenderId: "237544535660",
    appId: "1:237544535660:web:ee2ad304e162321928ca49",
    measurementId: "G-QCH44D2HMZ"
};
// Initialize Firebase
admin.initializeApp(firebaseConfig);

module.exports.admin = admin