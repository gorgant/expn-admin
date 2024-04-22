import { logger } from 'firebase-functions/v2';
import { HttpsError } from 'firebase-functions/v2/https';
import { PubSub } from '@google-cloud/pubsub';
import { AdminTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names.model';
import { adminAppProjectId } from '../config/app-config';
import { SubscriberData } from '../../../shared-models/email/subscriber-data.model';
const pubSub = new PubSub();

// Publish request
export const importPublicUsersToDb = async(subscriberData: SubscriberData[]) => {
  const topicName = AdminTopicNames.IMPORT_PUBLIC_USERS_TO_DB_TOPIC;
  const projectId = adminAppProjectId;
  const topic = pubSub.topic(`projects/${projectId}/topics/${topicName}`);
  const pubsubMsg: SubscriberData[] = subscriberData;
  const bufferedMsg = Buffer.from(JSON.stringify(pubsubMsg));
  const publishedMsgId = await topic.publishMessage({data: bufferedMsg})
    .catch(err => {logger.log(`Failed to publish to topic "${topicName}" on project "${projectId}":`, err); throw new HttpsError('internal', err);});
  logger.log(`Publish to topic "${topicName}" on project "${projectId}" succeeded:`, publishedMsgId);

  return publishedMsgId;
}
