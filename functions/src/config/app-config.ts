import * as admin from 'firebase-admin';
import { EnvironmentTypes, PRODUCTION_APPS, SANDBOX_APPS } from '../../../shared-models/environments/env-vars.model';
import { currentEnvironmentType } from './environments-config';
import * as functions from 'firebase-functions';


// Access to public app requires admin service account to be added to public IAM
const getExplearningAdminApp = () => {
  let app: admin.app.App;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      app = admin.initializeApp(
        PRODUCTION_APPS.explearningAdminApp,
        'explearningAdminApp'
      );
      break;
    case EnvironmentTypes.SANDBOX:
      app = admin.initializeApp(
        SANDBOX_APPS.explearningAdminApp,
        'explearningAdminApp'
      );
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when creating admin app`);
  }
  return app;
};
export const explearningAdminApp = getExplearningAdminApp();

// Access to public app requires admin service account to be added to public IAM
const getExplearningPublicApp = () => {
  let app: admin.app.App;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      app = admin.initializeApp(
        PRODUCTION_APPS.explearningPublicApp,
        'explearningPublicApp'
      );
      break;
    case EnvironmentTypes.SANDBOX:
      app = admin.initializeApp(
        SANDBOX_APPS.explearningPublicApp,
        'explearningPublicApp'
      );
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when creating public app`);
  }
  return app;
};
export const explearningPublicApp = getExplearningPublicApp();

const getAltEnvironmentExplearningAdminApp = () => {

  let app: admin.app.App;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      app = admin.initializeApp(
        SANDBOX_APPS.explearningAdminApp,
        'altExplearningAdminApp'
      );
      break;
    case EnvironmentTypes.SANDBOX:
      app = admin.initializeApp(
        PRODUCTION_APPS.explearningAdminApp,
        'altExplearningAdminApp'
      );
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when creating alt admin app`);
  }
  return app;
}

export const altEnvironmentExplearningAdminApp = getAltEnvironmentExplearningAdminApp();

const getAltEnvironmentExplearningPublicApp = () => {

  let app: admin.app.App;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      app = admin.initializeApp(
        SANDBOX_APPS.explearningPublicApp,
        'altExplearningPublicApp'
      );
      break;
    case EnvironmentTypes.SANDBOX:
      app = admin.initializeApp(
        PRODUCTION_APPS.explearningPublicApp,
        'altExplearningPublicApp'
      );
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when creating alt public app`);
  }
  return app;
}

export const altEnvironmentExplearningPublicApp = getAltEnvironmentExplearningPublicApp();
