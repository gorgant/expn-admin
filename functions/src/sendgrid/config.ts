import * as functions from 'firebase-functions';
import { adminFirestore } from '../db';
import * as sendGridMail from '@sendgrid/mail';

// Iniitialize Cloud Firestore Database
export const db = adminFirestore;
const settings = { timestampsInSnapshots: true };
db.settings(settings);

// ENV Variables
export const sendgridSecret: string = functions.config().sendgrid.secret;

// Initialize SG and export
export const getSgMail = () => {
  const sendgrid = sendGridMail;
  sendGridMail.setApiKey(sendgridSecret);
  return sendgrid;
}
