import { explearningAdminApp, explearningPublicApp, altEnvironmentExplearningAdminApp } from "./app-config";

export const adminFirestore = explearningAdminApp.firestore();
export const publicFirestore = explearningPublicApp.firestore();
export const altEnvAdminFirestore = altEnvironmentExplearningAdminApp.firestore();
export const altEnvPublicFirestore = altEnvironmentExplearningAdminApp.firestore();
