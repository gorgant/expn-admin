import * as admin from 'firebase-admin';
import { getPublicApp } from './public-config';

export const adminApp = admin.initializeApp();
export const publicApp = getPublicApp();