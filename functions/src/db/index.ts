import { adminApp, publicApp } from "../apps";
import { Storage } from '@google-cloud/storage';

// LOCAL VARIABLES
export const adminFirestore = adminApp.firestore();
export const adminStorage = new Storage();


// PUBLIC VARIABLES
export const publicFirestore = publicApp.then(pubApp => pubApp.firestore());
