import { logger } from 'firebase-functions/v2';
import { CallableOptions, CallableRequest, HttpsError, onCall } from 'firebase-functions/v2/https';
import { PubSub } from '@google-cloud/pubsub';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names.model';
import { PublicUserImportMetadata } from '../../../shared-models/user/public-user-import-data.model';
import { adminAppProjectId } from '../config/app-config';
const pubSub = new PubSub();

// Publish request
const publishProcessPublicUserImportData = async(publicUserImportMetadata: PublicUserImportMetadata) => {
  const topicName = AdminTopicNames.PARSE_PUBLIC_USER_IMPORT_DATA_TOPIC;
  const projectId = adminAppProjectId;
  const topic = pubSub.topic(`projects/${projectId}/topics/${topicName}`);
  const pubsubMsg: PublicUserImportMetadata = {
    ...publicUserImportMetadata
  };
  const bufferedMsg = Buffer.from(JSON.stringify(pubsubMsg));
  const publishedMsgId = await topic.publishMessage({data: bufferedMsg})
    .catch(err => {logger.log(`Failed to publish to topic "${topicName}" on project "${projectId}":`, err); throw new HttpsError('internal', err);});
  logger.log(`Publish to topic "${topicName}" on project "${projectId}" succeeded:`, publishedMsgId);

  return publishedMsgId;
}

/////// DEPLOYABLE FUNCTIONS ///////

const callableOptions: CallableOptions = {
  enforceAppCheck: true
};

export const onCallProcessPublicUserImportData = onCall(callableOptions, async (request: CallableRequest<PublicUserImportMetadata>): Promise<string> => {

  const publicUserImportMetadata = request.data;
  logger.log(`onCallProcessPublicUserImportData requested with this data:`, publicUserImportMetadata);
  
  return publishProcessPublicUserImportData(publicUserImportMetadata);
});