import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const adminApp = admin.initializeApp(functions.config().firebase);

const adminFirestore = adminApp.firestore();
export default adminFirestore;
