import { logger } from 'firebase-functions/v2';
import { CallableOptions, CallableRequest, HttpsError, onCall } from 'firebase-functions/v2/https';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths.model';
import { AdminUser, AdminUserKeys } from '../../../shared-models/user/admin-user.model';
import { AdminUserUpdateData, UserUpdateType } from '../../../shared-models/user/user-update.model';
import { adminFirestore } from '../config/db-config';
import { Timestamp } from '@google-cloud/firestore';
import { fetchAdminDbUserById, verifyAdminAuthUidMatchesDocumentUserIdOrIsSuperAdmin } from '../config/global-helpers';

const adminUsersCollection = adminFirestore.collection(AdminCollectionPaths.ADMIN_USERS);

const updateUser = async (userUpdateData: AdminUserUpdateData): Promise<AdminUser> => {
  const currentTimestamp = Timestamp.now() as any;

  const existingUser = await fetchAdminDbUserById(userUpdateData.userData.id as string, adminUsersCollection) as AdminUser;
  const newDataFromClient = userUpdateData.userData;
  const updateType = userUpdateData.updateType;

  let updatedUser: AdminUser = {
    ...existingUser,
  }

  // If bio update, update all aspects of user
  if (updateType === UserUpdateType.BIO_UPDATE) {
    logger.log(`Bio update detected`);
    updatedUser = {
      ...updatedUser,
      ...newDataFromClient,
    };
  }

  // If email update, just update that field
  if (updateType === UserUpdateType.EMAIL_UPDATE) {
    logger.log(`Email update detected`);
    updatedUser.email = newDataFromClient.email as string;
  }

  // If password update, just update that field
  if (updateType === UserUpdateType.PASSWORD_UPDATE) {
    logger.log(`Password update detected`);
    // No specific actions for this
  }

  // If authentication update, just update auth specific fields
  if (updateType === UserUpdateType.AUTHENTICATION) {
    logger.log(`Auth update detected`);
    updatedUser[AdminUserKeys.LAST_AUTHENTICATED_TIMESTAMP] = currentTimestamp;
  }

  updatedUser[AdminUserKeys.LAST_MODIFIED_TIMESTAMP] = currentTimestamp; // All user updates trigger this

  await adminUsersCollection.doc(updatedUser.id).update(updatedUser as {}) // Temp typecast to object to bypass typescript type error bug
    .catch(err => {logger.log(`Failed to update adminUser in admin database:`, err); throw new HttpsError('internal', err);});
  
  logger.log('Updated existing admin user', updatedUser);
  
  return updatedUser;
}

const executeActions = async (userUpateData: AdminUserUpdateData): Promise<Partial<AdminUser>> => {

  const updatedUser = await updateUser(userUpateData);

  return updatedUser;

}

/////// DEPLOYABLE FUNCTIONS ///////
const callableOptions: CallableOptions = {
  enforceAppCheck: true
};

export const onCallUpdateAdminUser = onCall(callableOptions, async (request: CallableRequest<AdminUserUpdateData>) => {
  const userUpdateData = request.data;
  logger.log('onCallUpdateAdminUser requested with this data:', userUpdateData);

  const documentUserId = userUpdateData.userData[AdminUserKeys.ID]!;
  await verifyAdminAuthUidMatchesDocumentUserIdOrIsSuperAdmin(request, documentUserId);

  const updatedUser = await executeActions(userUpdateData);
 
  return updatedUser;
});