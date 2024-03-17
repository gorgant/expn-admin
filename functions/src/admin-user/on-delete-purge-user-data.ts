import { logger } from 'firebase-functions/v2';
import { HttpsError } from 'firebase-functions/v2/https';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths.model';
import { adminAppFirebaseInstance } from '../config/app-config';
import { getAuth } from 'firebase-admin/auth';
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { AdminUser, AdminUserKeys } from '../../../shared-models/user/admin-user.model';

const deleteAuthUser = async(adminUserId: string): Promise<void> => {
  logger.log('Deleting adminUser in Auth with id: ', adminUserId);
  await getAuth(adminAppFirebaseInstance).deleteUser(adminUserId)
    .catch(err => {logger.log(`Failed to delete adminUser on db: `, err); throw new HttpsError('internal', err);});
};

const executeActions = async(deletedUser: AdminUser) => {
  const deletedUserId = deletedUser[AdminUserKeys.ID];
  await deleteAuthUser(deletedUserId);
  return true
};

/////// DEPLOYABLE FUNCTIONS ///////

const watchedDocumentPath = `${AdminCollectionPaths.ADMIN_USERS}/{wildcardUserId}`;

export const onDeletePurgeAdminUserData = onDocumentDeleted(watchedDocumentPath, async (event) => {
  const deletedUser = event.data?.data() as AdminUser;
  logger.log('Detected deleteAdminUser in database, processing removal of user data and account', deletedUser);

  const deletionResponse = await executeActions(deletedUser);
 
  return deletionResponse;

})