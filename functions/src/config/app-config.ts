import * as admin from 'firebase-admin';
import { EnvironmentTypes, PRODUCTION_APPS, SANDBOX_APPS } from '../../../shared-models/environments/env-vars.model';
import { currentEnvironmentType } from './environments-config';
import * as functions from 'firebase-functions';


// Access to public app requires admin service account to be added to public IAM
const getExpnAdminApp = () => {
  let app: admin.app.App;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      app = admin.initializeApp(
        PRODUCTION_APPS.expnAdminApp,
        'expnAdminApp'
      );
      break;
    case EnvironmentTypes.SANDBOX:
      app = admin.initializeApp(
        SANDBOX_APPS.expnAdminApp,
        'expnAdminApp'
      );
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when creating admin app`);
  }
  return app;
};
export const expnAdminApp = getExpnAdminApp();

// Access to public app requires admin service account to be added to public IAM
const getExpnPublicApp = () => {
  let app: admin.app.App;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      app = admin.initializeApp(
        PRODUCTION_APPS.expnPublicApp,
        'expnPublicApp'
      );
      break;
    case EnvironmentTypes.SANDBOX:
      app = admin.initializeApp(
        SANDBOX_APPS.expnPublicApp,
        'expnPublicApp'
      );
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when creating public app`);
  }
  return app;
};
export const expnPublicApp = getExpnPublicApp();

const getAltEnvironmentExpnAdminApp = () => {

  let app: admin.app.App;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      app = admin.initializeApp(
        SANDBOX_APPS.expnAdminApp,
        'altExpnAdminApp'
      );
      break;
    case EnvironmentTypes.SANDBOX:
      app = admin.initializeApp(
        PRODUCTION_APPS.expnAdminApp,
        'altExpnAdminApp'
      );
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when creating alt admin app`);
  }
  return app;
}

export const altEnvironmentExpnAdminApp = getAltEnvironmentExpnAdminApp();

const getAltEnvironmentExpnPublicApp = () => {

  let app: admin.app.App;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      app = admin.initializeApp(
        SANDBOX_APPS.expnPublicApp,
        'altExpnPublicApp'
      );
      break;
    case EnvironmentTypes.SANDBOX:
      app = admin.initializeApp(
        PRODUCTION_APPS.expnPublicApp,
        'altExpnPublicApp'
      );
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when creating alt public app`);
  }
  return app;
}

export const altEnvironmentExpnPublicApp = getAltEnvironmentExpnPublicApp();
