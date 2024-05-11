import admin from 'firebase-admin';
import configfire from './estamparia-db-firebase-adminsdk-aylf0-c843edc807.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(configfire),
  storageBucket: "gs://estamparia-db.appspot.com"
});

console.log('Firebase connected');

var bucket = admin.storage().bucket();

export default bucket;