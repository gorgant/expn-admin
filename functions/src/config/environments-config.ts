import * as functions from 'firebase-functions';
import { EnvironmentTypes, PRODUCTION_APPS, SANDBOX_APPS } from '../../../shared-models/environments/env-vars.model';
import { ProductReferenceList } from '../../../shared-models/products/product-id-list.model';
import { PublicAppRoutes } from '../../../shared-models/routes-and-paths/app-routes.model';

export const currentEnvironmentType = functions.config().environment.type;

const getAdminProjectId = (): string => {
  let projectId: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      projectId = PRODUCTION_APPS.explearningAdminApp.projectId
      break;
    case EnvironmentTypes.SANDBOX:
      projectId = SANDBOX_APPS.explearningAdminApp.projectId
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when getting admin project ID`);
  }
  return projectId;
}
export const adminProjectId = getAdminProjectId();

const getPublicProjectId = (): string => {
  let projectId: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      projectId = PRODUCTION_APPS.explearningPublicApp.projectId;
      break;
    case EnvironmentTypes.SANDBOX:
      projectId = SANDBOX_APPS.explearningPublicApp.projectId;
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when getting public project ID`);
  }
  return projectId;
}

export const publicProjectId = getPublicProjectId();

const getPublicAppUrl = (): string => {
  let appUrl: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      appUrl = PRODUCTION_APPS.explearningPublicApp.websiteDomain;
      break;
    case EnvironmentTypes.SANDBOX:
      appUrl = SANDBOX_APPS.explearningPublicApp.websiteDomain;
      break;
    default:
      throw new functions.https.HttpsError('failed-precondition', `No environment type detected when getting public project ID`);
  }
  return appUrl
}
export const publicAppUrl = getPublicAppUrl();

export const getProductUrlById = (productId: string): string => {
  const productSlug = ProductReferenceList[productId].productUrlSlug;
  const url = `https://${publicAppUrl}${PublicAppRoutes.PRODUCTS}/${productId}/${productSlug}`;
  return url;
};
