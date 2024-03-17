import { defineSecret } from "firebase-functions/params";
import { SecretsManagerKeyNames } from "../../../shared-models/environments/env-vars.model";

// Guide to setting secrets using firebase CLI: https://firebase.google.com/docs/functions/config-env
// Don't forget to add secret to the function config
export const alternateProjectServiceAccountCreds = defineSecret(SecretsManagerKeyNames.ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS);
export const cloudSchedulerServiceAccountSecret = defineSecret(SecretsManagerKeyNames.CLOUD_SCHEDULER_SERVICE_ACCOUNT_EMAIL);
export const sendgridApiSecret = defineSecret(SecretsManagerKeyNames.SENDGRID);