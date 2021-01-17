import { expnAdminApp, expnPublicApp, altEnvironmentExpnAdminApp } from "./app-config";

export const adminFirestore = expnAdminApp.firestore();
export const publicFirestore = expnPublicApp.firestore();
export const altEnvAdminFirestore = altEnvironmentExpnAdminApp.firestore();
export const altEnvPublicFirestore = altEnvironmentExpnAdminApp.firestore();
