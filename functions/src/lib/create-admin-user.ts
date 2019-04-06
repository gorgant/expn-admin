import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import firestore from './../db';

interface AppUser {
  displayName: string;
  email: string;
  avatarUrl?: string;
  id?: string;
  isNewUser?: boolean;
}

export const createAdminUser = functions.auth.user()
  .onCreate( async (user) => {
    await addUserToDb(user);
    return true;
});

async function addUserToDb(authUser: admin.auth.UserRecord) {
  
  const appUser: AppUser = {
    displayName: authUser.displayName as string,
    email: authUser.email as string,
    avatarUrl: authUser.photoURL,
    id: authUser.uid,
  }

  await firestore.collection('users').doc(authUser.uid).set(appUser);
  console.log('Admin user created', appUser);
}