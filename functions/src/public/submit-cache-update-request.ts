import { publicProjectId } from "../environments/config";
import { PublicTopicNames } from "../../../shared-models/routes-and-paths/fb-function-names";
import { PubSub } from "@google-cloud/pubsub";
import { WebpageUrl } from "../../../shared-models/ssr/webpage-url.model";

const pubSub = new PubSub();

export const submitCacheUpdateRequest = async (urlObject: WebpageUrl) => {

  console.log('Submitting cache update request with this data', urlObject);
  const publicProject = publicProjectId;
  const topicName = PublicTopicNames.SAVE_WEBPAGE_TO_CACHE_TOPIC;
  console.log('Publishing to this project topic', publicProject);

  // Target topic in the PubSub (must add this project's service account to target project)
  const topic = pubSub.topic(`projects/${publicProject}/topics/${topicName}`);

  const topicPublishRes = await topic.publishJSON(urlObject)
    .catch((error: any) => {throw new Error(`Error publishing to topic ${topicName}: ${error}`)});
  console.log('Res from topic publish', topicPublishRes);

  return topicPublishRes;
}