import { currentEnvironmentType } from "./environments-config";
import { EnvironmentTypes, PRODUCTION_APPS, SANDBOX_APPS } from "../../../shared-models/environments/env-vars.model";
import { Storage } from '@google-cloud/storage';
import * as functions from 'firebase-functions';


// Access to public app requires admin service account to be added to public IAM
const getExplearningAdminStorage = (): Storage => {
  let storageConstructor: Storage;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      storageConstructor = new Storage({
        projectId: PRODUCTION_APPS.explearningAdminApp.projectId
      });
      break;
    case EnvironmentTypes.SANDBOX:
      storageConstructor = new Storage({
        projectId: SANDBOX_APPS.explearningAdminApp.projectId
      });
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when creating storage object`);
  }
  return storageConstructor;
};
export const explearningAdminStorage = getExplearningAdminStorage();

// Access to public app requires admin service account to be added to public IAM
const getExplearningPublicStorage = (): Storage => {
  let storageConstructor: Storage;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      storageConstructor = new Storage({
        projectId: PRODUCTION_APPS.explearningPublicApp.projectId
      });
      break;
    case EnvironmentTypes.SANDBOX:
      storageConstructor = new Storage({
        projectId: SANDBOX_APPS.explearningPublicApp.projectId
      });
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when creating storage object`);
  }
  return storageConstructor;
};
export const explearningPublicStorage = getExplearningPublicStorage();