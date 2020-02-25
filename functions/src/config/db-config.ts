import { explearningAdminApp, explearningPublicApp } from "./app-config";

export const adminFirestore = explearningAdminApp.firestore();
export const publicFirestore = explearningPublicApp.firestore();
