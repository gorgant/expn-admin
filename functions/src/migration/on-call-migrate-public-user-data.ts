import { logger } from "firebase-functions/v2";
import { CallableOptions, CallableRequest, HttpsError, onCall } from "firebase-functions/v2/https";
import { adminFirestore, getPublicFirestoreWithAdminCreds } from "../config/db-config";
import { MigrationCollectionPaths, PublicCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";
import { SecretsManagerKeyNames } from "../../../shared-models/environments/env-vars.model";
import { OldBillingKeys, OldEmailSubscriber, OldEmailSubscriberKeys, OldSubscriptionSource, PublicUser, PublicUserKeys } from "../../../shared-models/user/public-user.model";
import { convertMillisToTimestamp } from "../config/global-helpers";
import { EmailOptInSource } from "../../../shared-models/email/email-opt-in-source.model";
import { Timestamp } from '@google-cloud/firestore';

const convertOldEmailSubscriberToNewPublicUser = (oldEmailSubscriber: OldEmailSubscriber, newPublicUserId: string): PublicUser => {

  const optInSource = oldEmailSubscriber?.lastSubSource === OldSubscriptionSource.POPUP_SMALLTALK ? EmailOptInSource.WEBSITE_POPUP : 
                      oldEmailSubscriber?.lastSubSource === OldSubscriptionSource.WEBSITE_BOX ? EmailOptInSource.WEBSITE_SUBSCRIBE_BOX :
                      EmailOptInSource.UNKNOWN_MIGRATION;

  const publicUser: PublicUser = {
    [PublicUserKeys.CREATED_TIMESTAMP]: oldEmailSubscriber[OldEmailSubscriberKeys.CREATED_DATE] ? convertMillisToTimestamp(oldEmailSubscriber[OldEmailSubscriberKeys.CREATED_DATE]) as any : Timestamp.fromMillis(1577836800000), // Hardcode 1/1/2020 UTC if blank
    [PublicUserKeys.EMAIL]: oldEmailSubscriber.id,
    [PublicUserKeys.EMAIL_GROUP_UNSUBSCRIBES]: oldEmailSubscriber.groupUnsubscribes ? oldEmailSubscriber.groupUnsubscribes : null,
    [PublicUserKeys.EMAIL_GLOBAL_UNSUBSCRIBE]: oldEmailSubscriber.globalUnsubscribe ? oldEmailSubscriber.globalUnsubscribe : null,
    [PublicUserKeys.EMAIL_OPT_IN_SOURCE]: optInSource,
    [PublicUserKeys.EMAIL_OPT_IN_CONFIRMED]: true, // Hardcoded because we filtered for this when fetching the collection
    [PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP]: oldEmailSubscriber[OldEmailSubscriberKeys.OPT_IN_TIMESTAMP] ? convertMillisToTimestamp(oldEmailSubscriber[OldEmailSubscriberKeys.OPT_IN_TIMESTAMP]) as any : Timestamp.fromMillis(1577836800000), // Hardcode 1/1/2020 UTC if blank,
    [PublicUserKeys.EMAIL_OPT_OUT_TIMESTAMP]: null,
    [PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP]: (oldEmailSubscriber.sendgridContactId && oldEmailSubscriber[OldEmailSubscriberKeys.OPT_IN_TIMESTAMP]) ? convertMillisToTimestamp(oldEmailSubscriber[OldEmailSubscriberKeys.OPT_IN_TIMESTAMP]) as any : null,
    [PublicUserKeys.EMAIL_SENDGRID_CONTACT_ID]: oldEmailSubscriber.sendgridContactId ? oldEmailSubscriber.sendgridContactId : null,
    [PublicUserKeys.EMAIL_SENDGRID_CONTACT_LIST_ARRAY]: null,
    [PublicUserKeys.EMAIL_VERIFIED]: true,
    [PublicUserKeys.FIRST_NAME]: oldEmailSubscriber.publicUserData.billingDetails && oldEmailSubscriber.publicUserData.billingDetails[OldBillingKeys.FIRST_NAME] ? oldEmailSubscriber.publicUserData.billingDetails[OldBillingKeys.FIRST_NAME]  : '',
    [PublicUserKeys.ID]: newPublicUserId,
    [PublicUserKeys.LAST_MODIFIED_TIMESTAMP]: oldEmailSubscriber[OldEmailSubscriberKeys.CREATED_DATE] ? convertMillisToTimestamp(oldEmailSubscriber[OldEmailSubscriberKeys.CREATED_DATE]) as any : null,
    [PublicUserKeys.ONBOARDING_WELCOME_EMAIL_SENT]: oldEmailSubscriber.introEmailSent ? oldEmailSubscriber.introEmailSent : false
  }
  return publicUser;
}

const migratePublicUserData = async () => {
  const publicUsersCollectionRef = getPublicFirestoreWithAdminCreds().collection(PublicCollectionPaths.PUBLIC_USERS);

  
  const oldEmailSubscribersCollectionRef = adminFirestore.collection(MigrationCollectionPaths.BACKUP_SUBSCRIBERS);
  const oldEmailSubscriberCollectionSnapshot = await oldEmailSubscribersCollectionRef.get()
    .catch(err => {logger.log(`Error fetching oldEmailSubscribersCollection:`, err); throw new HttpsError('internal', err);});

  logger.log(`Found ${oldEmailSubscriberCollectionSnapshot.size} oldEmailSubscribers to migrate`);
  
  let publicWriteBatch = getPublicFirestoreWithAdminCreds().batch();
  let operationCount = 0;

  for (const doc of oldEmailSubscriberCollectionSnapshot.docs) {
    const oldEmailSubscriber: OldEmailSubscriber = doc.data() as OldEmailSubscriber;
    const newPublicUserId = publicUsersCollectionRef.doc().id;
    const newPublicUser: PublicUser = convertOldEmailSubscriberToNewPublicUser(oldEmailSubscriber, newPublicUserId);
    
    const newPublicPublicUserRef = publicUsersCollectionRef.doc(newPublicUserId);
    publicWriteBatch.set(newPublicPublicUserRef, newPublicUser);
    operationCount++;
    
    // Firestore batch limit is 500 operations per batch
    // Commit the existing batch and create a new batch instance (the loop will continue with that new batch instance)
    if (operationCount === 490) {
      await publicWriteBatch.commit()
        .catch(err => {logger.log(`Error writing batch to public database:`, err); throw new HttpsError('internal', err);});
      publicWriteBatch = getPublicFirestoreWithAdminCreds().batch();
      operationCount = 0;
    }
  }

  if (operationCount > 0) {
    await publicWriteBatch.commit()
      .catch(err => {logger.log(`Error writing batch to public database:`, err); throw new HttpsError('internal', err);});
  }
}


/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true,
  secrets: [SecretsManagerKeyNames.ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS]
};

export const onCallMigratePublicUserData = onCall(callableOptions, async (request: CallableRequest<void>): Promise<void> => {
  const exportParams = request.data;
  logger.log('onCallMigratePublicUserData requested with this data:', exportParams);

  await migratePublicUserData();
 
});