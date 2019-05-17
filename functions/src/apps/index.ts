import * as admin from 'firebase-admin';
import { EnvironmentTypes, PRODUCTION_APPS, SANDBOX_APPS } from '../../../shared-models/environments/env-vars.model';
import { currentEnvironmentType } from '../environments/config';

export const adminApp = admin.initializeApp();

// Access to public app requires admin service account to be added to public IAM
export const getPublicApp = () => {
  let app: admin.app.App;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      app = admin.initializeApp(
        PRODUCTION_APPS.publicApp,
        'public'
      );
      break;
    case EnvironmentTypes.SANDBOX:
      app = admin.initializeApp(
        SANDBOX_APPS.publicApp,
        'public'
      );
      break;
    default:
      app = admin.initializeApp(
        SANDBOX_APPS.publicApp,
        'public'
      );
      break;
  }
  return app;
};