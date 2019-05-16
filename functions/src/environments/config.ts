import * as functions from 'firebase-functions';

export const currentEnvironmentType = functions.config().environment.type;