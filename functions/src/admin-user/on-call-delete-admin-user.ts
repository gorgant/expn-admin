import { logger } from 'firebase-functions/v2';
import { CallableOptions, CallableRequest, HttpsError, onCall } from 'firebase-functions/v2/https';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths.model';
import { adminFirestore } from '../config/db-config';
import { verifyAdminAuthUidMatchesDocumentUserIdOrIsSuperAdmin } from '../config/global-helpers';

const adminUsersCollection = adminFirestore.collection(AdminCollectionPaths.ADMIN_USERS);

// Recursively delete user and all subcollections for that user in DB
const deleteAdminUserOnDb = async (adminUserId: string): Promise<void> => {
  logger.log('Deleting adminUser and all subcollections on db with id : ', adminUserId);
  await adminFirestore.recursiveDelete(adminUsersCollection.doc(adminUserId))
    .catch(err => {logger.log(`Failed to delete adminUser on db: `, err); throw new HttpsError('internal', err);});
}

const executeActions = async (adminUserId: string): Promise<boolean> => {
  await deleteAdminUserOnDb(adminUserId);
  return true;
}

/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true
};

// Note: When user is deleted from db, a separate function onDeleteRemoveAdminUserData automatically removes user image files and deletes the auth account
// This enables auto-deletion of data when a user is manually deleted from the FB console
export const onCallDeleteAdminUser = onCall(callableOptions, async (request: CallableRequest<string>): Promise<boolean> => {
  const adminUserId = request.data;
  logger.log('onCallDeleteAdminUser requested with these params', adminUserId);

  const documentUserId = adminUserId;
  await verifyAdminAuthUidMatchesDocumentUserIdOrIsSuperAdmin(request, documentUserId);

  const deletionResponse = await executeActions(adminUserId);
 
  return deletionResponse;
});