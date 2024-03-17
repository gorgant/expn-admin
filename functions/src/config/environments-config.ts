
import { projectID } from 'firebase-functions/params';
import { EnvironmentTypes, SANDBOX_APPS } from '../../../shared-models/environments/env-vars.model';

// This produces a warning when deploying functions but based on research it is okay to ignore for now
const isSandbox = projectID.value() === SANDBOX_APPS.expnPublicApp.projectId || projectID.value() === SANDBOX_APPS.expnAdminApp.projectId; 
export const currentEnvironmentType = isSandbox ? EnvironmentTypes.SANDBOX : EnvironmentTypes.PRODUCTION;
