import { publicProjectId } from "../config/environments-config";
import { PublicTopicNames } from "../../../shared-models/routes-and-paths/fb-function-names";
import { PubSub } from "@google-cloud/pubsub";
import { WebpageUrl } from "../../../shared-models/ssr/webpage-url.model";

const pubSub = new PubSub();

export const submitCacheUpdateRequest = async (urlObject: WebpageUrl) => {

  const topicName = PublicTopicNames.SAVE_WEBPAGE_TO_CACHE_TOPIC;
  const projectId = publicProjectId;
  const topic = pubSub.topic(`projects/${projectId}/topics/${topicName}`);
  const pubsubMsg: WebpageUrl = urlObject;

  const topicPublishRes = await topic.publishJSON(pubsubMsg)
    .catch(err => {console.log(`Failed to publish to topic "${topicName}" on project "${projectId}":`, err); return err;});
  console.log(`Publish to topic "${topicName}" on project "${projectId}" succeeded:`, topicPublishRes);

  return topicPublishRes;
}