import * as admin from 'firebase-admin';

export const adminApp = admin.initializeApp();

// Requires admin service account to be added to public IAM
export const publicApp = admin.initializeApp(
    {
      databaseURL: 'https://explearning-76d93.firebaseio.com',
      projectId: 'explearning-76d93',
      storageBucket: 'explearning-76d93.appspot.com',
    }, 
    'public'
  );
