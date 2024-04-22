import { HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { PubSub } from '@google-cloud/pubsub';
import { PublicTopicNames } from '../../../shared-models/routes-and-paths/fb-function-names.model';
import { EmailPubMessage } from '../../../shared-models/email/email-pub-message.model';
import { publicAppProjectId } from '../config/app-config';
const pubSub = new PubSub();

// Trigger email send
export const dispatchEmail = async(emailPubMessage: EmailPubMessage) => {
  const topicName = PublicTopicNames.DISPATCH_EMAIL_TOPIC;
  const projectId = publicAppProjectId;
  const topic = pubSub.topic(`projects/${projectId}/topics/${topicName}`);
  const pubsubMsg: EmailPubMessage = {
    ...emailPubMessage
  };
  const bufferedMsg = Buffer.from(JSON.stringify(pubsubMsg));
  const publishedMsgId = await topic.publishMessage({data: bufferedMsg})
    .catch(err => {logger.log(`Failed to publish to topic "${topicName}" on project "${projectId}":`, err); throw new HttpsError('internal', err);});
  logger.log(`Publish to topic "${topicName}" on project "${projectId}" succeeded:`, publishedMsgId);
  return publishedMsgId;
}