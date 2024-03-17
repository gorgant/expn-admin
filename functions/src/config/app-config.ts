import { App, initializeApp } from "firebase-admin/app";
import { EnvironmentTypes, PRODUCTION_APPS, SANDBOX_APPS } from '../../../shared-models/environments/env-vars.model';
import { currentEnvironmentType } from './environments-config';
import { HttpsError } from 'firebase-functions/v2/https';
import { logger } from "firebase-functions/v1";

// Access to public app requires admin service account to be added to public IAM
const getAdminApp = () => {
  let adminAppFirebaseInstance: App;
  let adminAppProjectId: string;
  let adminAppUrl: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      logger.log(`Detected ${currentEnvironmentType} environment, initializing PRODUCTION admin app`);
      adminAppFirebaseInstance = initializeApp(
        PRODUCTION_APPS.expnAdminApp,
        'expnAdminApp'
      );
      adminAppProjectId = PRODUCTION_APPS.expnAdminApp.projectId;
      adminAppUrl = PRODUCTION_APPS.expnAdminApp.websiteDomain;
      break;
    case EnvironmentTypes.SANDBOX:
      logger.log(`Detected ${currentEnvironmentType} environment, initializing SANDBOX admin app`);
      adminAppFirebaseInstance = initializeApp(
        SANDBOX_APPS.expnAdminApp,
        'expnAdminApp'
      );
      adminAppProjectId = SANDBOX_APPS.expnAdminApp.projectId;
      adminAppUrl = SANDBOX_APPS.expnAdminApp.websiteDomain;
      break;
    default:
      throw new HttpsError('failed-precondition', `No environment type detected when creating admin app`);
  }
  return {adminAppFirebaseInstance, adminAppProjectId, adminAppUrl};
};
export const {adminAppFirebaseInstance, adminAppProjectId, adminAppUrl} = getAdminApp();

// Access to public app requires admin service account to be added to public IAM
const getPublicApp = () => {
  let publicAppFirebaseInstance: App;
  let publicAppProjectId: string;
  let publicAppUrl: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      logger.log(`Detected ${currentEnvironmentType} environment, initializing PRODUCTION public app`);
      publicAppFirebaseInstance = initializeApp(
        PRODUCTION_APPS.expnPublicApp,
        'expnPublicApp'
      );
      publicAppProjectId = PRODUCTION_APPS.expnPublicApp.projectId;
      publicAppUrl = PRODUCTION_APPS.expnPublicApp.websiteDomain;
      break;
    case EnvironmentTypes.SANDBOX:
      logger.log(`Detected ${currentEnvironmentType} environment, initializing SANDBOX public app`);
      publicAppFirebaseInstance = initializeApp(
        SANDBOX_APPS.expnPublicApp,
        'expnPublicApp'
      );
      publicAppProjectId = SANDBOX_APPS.expnPublicApp.projectId;
      publicAppUrl = SANDBOX_APPS.expnPublicApp.websiteDomain;
      break;
    default:
      throw new HttpsError('failed-precondition', `No environment type detected when creating public app`);
  }
  return {publicAppFirebaseInstance, publicAppProjectId, publicAppUrl};
};
export const {publicAppFirebaseInstance, publicAppProjectId, publicAppUrl} = getPublicApp();
