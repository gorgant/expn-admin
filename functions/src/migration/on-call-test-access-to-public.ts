import { logger } from "firebase-functions/v2";
import { CallableOptions, CallableRequest, onCall } from "firebase-functions/v2/https";
import { publicFirestore } from "../config/db-config";
import { SharedCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths.model";

const testAccess = async () => {
  const publicPostCollection = publicFirestore.collection(SharedCollectionPaths.POSTS);
  const publicPostCountQuery = await publicPostCollection.count().get()
  const publicPostCount = publicPostCountQuery.data().count;
  logger.log('Public post count', publicPostCount);
}


/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true
};

export const onCallTestAccessToPublic = onCall(callableOptions, async (request: CallableRequest<void>): Promise<void> => {
  const exportParams = request.data;
  logger.log('onCallTestAccessToPublic requested with this data:', exportParams);

  await testAccess();
});