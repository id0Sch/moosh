import * as Firebase from 'firebase';

const firebase = Firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DB
});
export const auth = firebase.auth();
export const database = firebase.database();
export const GoogleAuthProvider = Firebase.auth.GoogleAuthProvider;