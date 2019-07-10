import * as functions from 'firebase-functions';
import { EnvironmentTypes, PRODUCTION_APPS, SANDBOX_APPS } from '../../../shared-models/environments/env-vars.model';
import { ProductIdList } from '../../../shared-models/products/product-id-list.model';

export const currentEnvironmentType = functions.config().environment.type;

const getAdminProjectId = (): string => {
  let projectId: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      projectId = PRODUCTION_APPS.adminApp.projectId
      break;
    case EnvironmentTypes.SANDBOX:
      projectId = SANDBOX_APPS.adminApp.projectId
      break;
    default:
      projectId = SANDBOX_APPS.adminApp.projectId
      break;
  }
  return projectId;
}
export const adminProjectId = getAdminProjectId();

const getPublicAppUrl = (): string => {
  let appUrl: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      appUrl = PRODUCTION_APPS.publicApp.websiteDomain;
      break;
    case EnvironmentTypes.SANDBOX:
      appUrl = SANDBOX_APPS.publicApp.websiteDomain;
      break;
    default:
      appUrl = SANDBOX_APPS.publicApp.websiteDomain;
      break;
  }
  return appUrl
}
export const publicAppUrl = getPublicAppUrl();

const getRemoteCoachId = (): string => {
  let remoteCoachId: string;

  switch (currentEnvironmentType) {
    case EnvironmentTypes.PRODUCTION:
      remoteCoachId = ProductIdList.REMOTE_COACH
      break;
    case EnvironmentTypes.SANDBOX:
      remoteCoachId = ProductIdList.SANDBOX_REMOTE_COACH;
      break;
    default:
      remoteCoachId = ProductIdList.SANDBOX_REMOTE_COACH;
      break;
  }
  return remoteCoachId
}
export const remoteCoachProductId = getRemoteCoachId();