import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { AdminUser } from '../../../shared-models/user/admin-user.model';
import { FbCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { adminFirestore } from '../db';
import { now } from 'moment';

const addUserToDb = async (authUser: admin.auth.UserRecord) => {
  
  const publicUser: AdminUser = {
    displayName: authUser.displayName as string,
    email: authUser.email as string,
    avatarUrl: authUser.photoURL,
    id: authUser.uid, 
    isAdmin: false, // For now, set this manually via the console for security reasons (could use an approved email list)
    lastAuthenticated: now(),
    createdDate: now()
  }

  await adminFirestore.collection(FbCollectionPaths.ADMIN_USERS).doc(authUser.uid).set(publicUser);
  console.log('Admin user created', publicUser);
}

/////// DEPLOYABLE FUNCTIONS ///////

export const createAdminUser = functions.auth.user()
  .onCreate( async (user) => {
    await addUserToDb(user);
    return true;
});

