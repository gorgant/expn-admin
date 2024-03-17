import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { AdminUser, AdminUserKeys } from '../../../shared-models/user/admin-user.model';
import { adminFirestore } from '../config/db-config';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths.model';
import { Timestamp } from '@google-cloud/firestore';
import { logger } from 'firebase-functions/v2';
import { HttpsError } from 'firebase-functions/v2/https';

const addUserToDb = async (authUser: admin.auth.UserRecord) => {

  const currentTimestamp = Timestamp.now() as any;
  
  const adminUser: AdminUser = {
    [AdminUserKeys.CREATED_TIMESTAMP]:  currentTimestamp,
    [AdminUserKeys.DISPLAY_NAME]: authUser.displayName as string,
    [AdminUserKeys.EMAIL]: authUser.email as string,
    [AdminUserKeys.ID]: authUser.uid, 
    [AdminUserKeys.IS_SUPER_ADMIN]: false,
    [AdminUserKeys.LAST_AUTHENTICATED_TIMESTAMP]: currentTimestamp,
    [AdminUserKeys.LAST_MODIFIED_TIMESTAMP]: currentTimestamp,
  }

  await adminFirestore.collection(AdminCollectionPaths.ADMIN_USERS).doc(authUser.uid).set(adminUser)
    .catch(err => {logger.log(`Failed to create adminUser in admin database:`, err); throw new HttpsError('internal', err);});
  logger.log('Admin user created', adminUser);
}

/////// DEPLOYABLE FUNCTIONS ///////

export const onAuthCreateAdminUser = functions.auth.user().onCreate( async (user) => {
    
  return addUserToDb(user);
});