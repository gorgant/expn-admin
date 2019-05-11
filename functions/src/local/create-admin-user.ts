import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { AppUser } from '../../../shared-models/user/app-user.model';
import { FbCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { adminFirestore } from '../db';

const addUserToDb = async (authUser: admin.auth.UserRecord) => {
  
  const appUser: AppUser = {
    displayName: authUser.displayName as string,
    email: authUser.email as string,
    avatarUrl: authUser.photoURL,
    id: authUser.uid,
  }

  await adminFirestore.collection(FbCollectionPaths.USERS).doc(authUser.uid).set(appUser);
  console.log('Admin user created', appUser);
}

/////// DEPLOYABLE FUNCTIONS ///////

export const createAdminUser = functions.auth.user()
  .onCreate( async (user) => {
    await addUserToDb(user);
    return true;
});

