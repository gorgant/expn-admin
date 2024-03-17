import { getFirestore } from "firebase-admin/firestore";
import { adminAppFirebaseInstance, publicAppFirebaseInstance } from "./app-config";
import { App, cert, initializeApp, getApp } from "firebase-admin/app";
import { alternateProjectServiceAccountCreds } from "./api-key-config";
import { currentEnvironmentType } from "./environments-config";
import { EnvironmentTypes, PRODUCTION_APPS, SANDBOX_APPS } from "../../../shared-models/environments/env-vars.model";
import { logger } from "firebase-functions/v2";
import { HttpsError } from "firebase-functions/v2/https";

export const adminFirestore = getFirestore(adminAppFirebaseInstance);
export const publicFirestore = getFirestore(publicAppFirebaseInstance);

let publicFirestoreWithAdminCredInitialized = false;
/**
 * Access the public app via admin with permissioned service account. The calling function must have the ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS secret instantiated for this to work.
 * Must be called at runtime. Cannot be instantiated at deployment because the secret is only available at runtime.
 * @returns A public app that is able to be accessed from the Admin Service Account
 */
export const getPublicFirestoreWithAdminCreds = (): FirebaseFirestore.Firestore => {
  let publicAppWithAdminCreds: App;
  const adminToPublicAppName = 'adminToPublicApp';
  const serviceAccountCredObject = JSON.parse(alternateProjectServiceAccountCreds.value());
  const credential = cert(serviceAccountCredObject);

  // First check if the app has already been initialized by a function (prevents multiple instances from being initialized)
  
  if (publicFirestoreWithAdminCredInitialized) {
    const existingApp = getApp(adminToPublicAppName);
    return getFirestore(existingApp);
  }

  // Otherwise, initialize the appropriate app
  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      logger.log(`Detected ${currentEnvironmentType} environment, initializing PRODUCTION public app`);
      publicAppWithAdminCreds = initializeApp(
        {
          ...PRODUCTION_APPS.expnPublicApp,
          credential
        },
        adminToPublicAppName
      );
      break;
    case EnvironmentTypes.SANDBOX:
      logger.log(`Detected ${currentEnvironmentType} environment, initializing SANDBOX public app`);
      publicAppWithAdminCreds = initializeApp(
        {
          ...SANDBOX_APPS.expnPublicApp,
          credential
        },
        adminToPublicAppName
      );
      break;
    default:
      throw new HttpsError('failed-precondition', `No environment type detected when creating public app`);
  }
  publicFirestoreWithAdminCredInitialized = true;
  return getFirestore(publicAppWithAdminCreds);
};

let adminFirestoreWithPublicCredInitialized = false;
/**
 * Access the admin app via public with permissioned service account. The calling function must have the ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS secret instantiated for this to work.
 * Must be called at runtime. Cannot be instantiated at deployment because the secret is only available at runtime.
 * @returns An admin app that is able to be accessed from the Public Service Account
 */
export const getAdminFirestoreWithPublicCreds = (): FirebaseFirestore.Firestore => {
  let adminAppWithPublicCreds: App;
  const publicToAdminAppName = 'publicToAdminApp';
  const serviceAccountCredObject = JSON.parse(alternateProjectServiceAccountCreds.value());
  const credential = cert(serviceAccountCredObject);

  // First check if the app has already been initialized by a function (prevents multiple instances from being initialized)
  
  if (adminFirestoreWithPublicCredInitialized) {
    const existingApp = getApp(publicToAdminAppName);
    return getFirestore(existingApp);
  }

  // Otherwise, initialize the appropriate app
  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      logger.log(`Detected ${currentEnvironmentType} environment, initializing PRODUCTION public app`);
      adminAppWithPublicCreds = initializeApp(
        {
          ...PRODUCTION_APPS.expnAdminApp,
          credential
        },
        publicToAdminAppName
      );
      break;
    case EnvironmentTypes.SANDBOX:
      logger.log(`Detected ${currentEnvironmentType} environment, initializing SANDBOX public app`);
      adminAppWithPublicCreds = initializeApp(
        {
          ...SANDBOX_APPS.expnAdminApp,
          credential
        },
        publicToAdminAppName
      );
      break;
    default:
      throw new HttpsError('failed-precondition', `No environment type detected when creating public app`);
  }
  adminFirestoreWithPublicCredInitialized = true;
  return getFirestore(adminAppWithPublicCreds);
};