import { MessagePublishedData, PubSubOptions, onMessagePublished } from "firebase-functions/v2/pubsub";
import { AdminTopicNames } from "../../../shared-models/routes-and-paths/fb-function-names.model";
import { SecretsManagerKeyNames } from "../../../shared-models/environments/env-vars.model";
import { CloudEvent, logger } from "firebase-functions/v2";
import { SubscriberData } from "../../../shared-models/email/subscriber-data.model";
import { getPublicFirestoreWithAdminCreds } from "../config/db-config";
import { PublicCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";
import { PublicUser, PublicUserKeys } from "../../../shared-models/user/public-user.model";
import { Timestamp } from '@google-cloud/firestore';
import { EmailIdentifiers, SendgridContactListId } from "../../../shared-models/email/email-vars.model";
import { EmailUserData } from "../../../shared-models/email/email-user-data.model";
import { convertPublicUserDataToEmailUserData, fetchPublicUserByEmail } from "../config/global-helpers";
import { EmailPubMessage } from "../../../shared-models/email/email-pub-message.model";
import { dispatchEmail } from "../email/dispatch-email";
import { HttpsError } from "firebase-functions/v2/https";

const importPublicUserToDb = async (subscriberData: SubscriberData, publicUsersCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>) => {
  const newUserId = publicUsersCollection.doc().id;
  const newUser: PublicUser = {
    ...subscriberData,
    [PublicUserKeys.CREATED_TIMESTAMP]: Timestamp.now() as any,
    [PublicUserKeys.EMAIL_GROUP_UNSUBSCRIBES]: null,
    [PublicUserKeys.EMAIL_GLOBAL_UNSUBSCRIBE]: null,
    [PublicUserKeys.EMAIL_OPT_IN_CONFIRMED]: false,
    [PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP]: null,
    [PublicUserKeys.EMAIL_OPT_OUT_TIMESTAMP]: null,
    [PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP]: null,
    [PublicUserKeys.EMAIL_SENDGRID_CONTACT_ID]: null,
    [PublicUserKeys.EMAIL_SENDGRID_CONTACT_LIST_ARRAY]: [SendgridContactListId.EXPN_PRIMARY_NEWSLETTER], // Add user to the newsletter contact list
    [PublicUserKeys.EMAIL_VERIFIED]: false,
    [PublicUserKeys.ID]: newUserId,
    [PublicUserKeys.LAST_MODIFIED_TIMESTAMP]: Timestamp.now() as any,
    [PublicUserKeys.ONBOARDING_WELCOME_EMAIL_SENT]: false,
  };

  logger.log('Creating publicUser', newUser);

  await publicUsersCollection.doc(newUserId).create(newUser) // Explicitly using create here to ensure it doesn't overwrite any existing subscribers
    .catch(err => {logger.log(`Failed to create user in public database:`, err); throw new HttpsError('internal', err);});
  
  return newUser;
}

const dispatchEmailVerificationEmail = async(publicUser: PublicUser) => {
  const emailUserData: EmailUserData = convertPublicUserDataToEmailUserData(publicUser);
  const emailIdentifier = EmailIdentifiers.EMAIL_VERIFICATION;
  const emailPubMessage: EmailPubMessage = {
    emailIdentifier,
    emailUserData
  };
  await dispatchEmail(emailPubMessage);
}

const executeActions = async (subscriberDataArray: SubscriberData[]) => {
  const credentialedPublicFirestore = getPublicFirestoreWithAdminCreds();
  const publicUsersCollection = credentialedPublicFirestore.collection(PublicCollectionPaths.PUBLIC_USERS);
  
  let importCount = 0;

  for (const subscriberData of subscriberDataArray) {
    const isExistingUser = await fetchPublicUserByEmail(subscriberData[PublicUserKeys.EMAIL], publicUsersCollection);
    if (isExistingUser) {
      continue; // This skips any further actions for this user (i.e., prevents it from being added to the db)
    }
    const newUser = await importPublicUserToDb(subscriberData, publicUsersCollection);
    await dispatchEmailVerificationEmail(newUser);
    importCount++;
  }

  logger.log(`Imported ${importCount} publicUsers to the public database`);
}

/////// DEPLOYABLE FUNCTIONS ///////
const pubSubOptions: PubSubOptions = {
  topic: AdminTopicNames.IMPORT_PUBLIC_USERS_TO_DB_TOPIC,
  secrets: [SecretsManagerKeyNames.ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS]
};
// Listen for pubsub message
export const onPubImportPublicUsersToDb = onMessagePublished(pubSubOptions, async (event: CloudEvent<MessagePublishedData<SubscriberData[]>>) => {
  const subscriberDataArray = event.data.message.json;
  logger.log(`${AdminTopicNames.IMPORT_PUBLIC_USERS_TO_DB_TOPIC} requested with this data:`, subscriberDataArray);

  await executeActions(subscriberDataArray);
});