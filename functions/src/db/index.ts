import { adminApp, getExplearningApp, getMaryDaphneApp } from "../apps";
import { Storage } from '@google-cloud/storage';

// LOCAL VARIABLES
export const adminFirestore = adminApp.firestore();
export const adminStorage = new Storage();


// PUBLIC VARIABLES
export const explearningPublicFirestore = getExplearningApp().firestore();
export const maryDaphnePublicFirestore = getMaryDaphneApp().firestore();
