import * as admin from 'firebase-admin';
import { Storage } from '@google-cloud/storage';
const gcs = new Storage();
const bucketName = 'explearning-admin-creds';

interface ServiceAccountRaw {
  type: string,
  project_id: string,
  private_key_id: string,
  private_key: string,
  client_email: string,
  client_id: string,
  auth_uri: string,
  token_uri: string,
  auth_provider_x509_cert_url: string,
  client_x509_cert_url: string
}

// Get the public app keys from Cloud Storage
async function fetchKeyData(): Promise<ServiceAccountRaw> {
  const bucket = gcs.bucket(bucketName); // The Storage bucket that contains the file.
  const filePath = 'public-site-creds/publicServiceAccountKey.json'; // File path in the bucket.
  const fileData: Buffer[] = await bucket.file(filePath).download(); // Get the file data
  const fileAsString = fileData.toString(); // Convert the file to a string
  const jsonObj: ServiceAccountRaw = JSON.parse(fileAsString); // Convert the string to JSON
  return jsonObj;
}

// Publish post to public database
// See: https://stackoverflow.com/questions/43939932/firebase-cloud-function-config-to-access-other-project-db
// See: https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app

export async function getPublicApp(): Promise<admin.app.App> {
  const serviceAccountRaw = await fetchKeyData();
  const serviceAccountFB: admin.ServiceAccount = {
    projectId: serviceAccountRaw.project_id,
    clientEmail: serviceAccountRaw.client_email,
    privateKey: serviceAccountRaw.private_key
  }
  const publicProjectId = serviceAccountFB.projectId;

  const publicApp = admin.initializeApp({
    databaseURL: `https://${publicProjectId}.firebaseio.com`,
    credential: admin.credential.cert(serviceAccountFB)
  }, 'public');

  return await publicApp;
}