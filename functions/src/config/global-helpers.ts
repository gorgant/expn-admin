import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import axios, { AxiosRequestConfig } from 'axios';
import { PublicUser, PublicUserKeys } from '../../../shared-models/user/public-user.model';
import { UserRecord, getAuth } from 'firebase-admin/auth';
import { adminAppFirebaseInstance, publicAppFirebaseInstance } from './app-config';
import { EmailUserData } from '../../../shared-models/email/email-user-data.model';
import { adminFirestore } from './db-config';
import { AdminCollectionPaths, SharedCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths.model';
import { AdminUser } from '../../../shared-models/user/admin-user.model';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { Timestamp } from '@google-cloud/firestore';
import { Timestamp as FirebaseTimestamp } from 'firebase-admin/firestore';
import { EmailSenderAddresses } from '../../../shared-models/email/email-vars.model';
import { EmailOptInSource } from '../../../shared-models/email/email-opt-in-source.model';
import { BlogIndexRef, Post, PostKeys } from '../../../shared-models/posts/post.model';

// Firebase can't handle back slashes
export const createOrReverseFirebaseSafeUrl = (url: string, reverse?: boolean): string => {
  if (reverse) {
    const urlWithSlashes = url.replace(/~1/g,'/') // Revert to normal url
    return urlWithSlashes;
  }
  const removedProtocol = url.split('//').pop() as string;
  const replacedSlashes = removedProtocol.replace(/\//g,'~1');
  return replacedSlashes;
}

// Replace spaces with dashes and set lower case
export const convertToFriendlyUrlFormat = (stringWithSpaces: string): string => {
  return stringWithSpaces.split(' ').join('-').toLowerCase();
}

// Convert Hrs:Min:Sec string to milliseconds
export const convertHoursMinSecToMill = (hrsMinSecStamp: string): number => {
  
  const hrs: number = Number(hrsMinSecStamp.split(':')[0]);
  const min: number = Number(hrsMinSecStamp.split(':')[1]);
  const sec: number = Number(hrsMinSecStamp.split(':')[2]);

  return ((hrs*60*60 + min*60 + sec) * 1000);
}

/**
 * Rounds a number to the nearest digits desired
 * @param number Number to round
 * @param digitsToRoundTo Number of digits desired
 */

// Courtesy of: https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
export const generateRoundedNumber = (number: number, digitsToRoundTo: number) => {
  let n = number;
  let digits = digitsToRoundTo; 
  let negative = false;
    if (digits === undefined) {
        digits = 0;
    }
        if( n < 0) {
        negative = true;
      n = n * -1;
    }
    const multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = parseFloat((Math.round(n) / multiplicator).toFixed(2));
    if( negative ) {    
        n = parseFloat((n * -1).toFixed(2));
    }
    return n;
}

/**
 * Submits an HTTP request
 * @param requestOptions Request options to include
 */

export const submitHttpRequest = async (config: AxiosRequestConfig): Promise<{}>  => {

  // const axios = Axios(.default);

  const response = await axios(config)
    .catch(err => {
      if (axios.isAxiosError(err)) {
        logger.log(`Error with request: ${err.code} ${err.message}`, err);
        throw new HttpsError('internal', `Error with request: ${err.code} ${err.message}`);
      } else {
        logger.log('unexpected error: ', err);
        throw new HttpsError('unknown', err);
      }
    }
  );

  const reponseData = response.data;

  logger.log('Body from response', reponseData);

  let parsedBody = reponseData;
      
  // Convert body to JSON object if it is a string
  if (parsedBody && typeof parsedBody === 'string' || parsedBody instanceof String) {
    parsedBody = JSON.parse(parsedBody as string);
  }



  return parsedBody;
}

export const fetchPublicUserByEmail = async (email: string, userCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>): Promise<PublicUser | undefined> => {

  const userCollectionRef = await userCollection
    .where(PublicUserKeys.EMAIL, '==', email)
    .get()
    .catch(err => {logger.log(`Failed to fetch publicUser in public database:`, err); throw new HttpsError('internal', err);});

  // Return empty if user doesn't exist
  if (userCollectionRef.empty) {
    logger.log(`publicUser with email '${email}' doesn't exist in database`);
    return undefined;
  }

  const existingUser = userCollectionRef.docs[0].data() as PublicUser;
  logger.log(`Found user with this data`, existingUser);

  return existingUser;
}

export const fetchPublicDbUserById = async (id: string, userCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>): Promise<PublicUser> => {
  const userDoc = await userCollection.doc(id).get()
    .catch(err => {logger.log(`Failed to fetch publicUser in public database:`, err); throw new HttpsError('internal', err);});
  return userDoc.data() as PublicUser; // Will return undefined if doesn't exist
}

export const fetchAdminDbUserById = async (id: string, userCollection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>): Promise<AdminUser> => {
  const userDoc = await userCollection.doc(id).get()
    .catch(err => {logger.log(`Failed to fetch publicUser in public database:`, err); throw new HttpsError('internal', err);});
  return userDoc.data() as AdminUser; // Will return undefined if doesn't exist
}

export const fetchPublicAuthUserById = async (userId: string): Promise<UserRecord> => {
  const userAuthData: UserRecord = await getAuth(publicAppFirebaseInstance).getUser(userId)
    .catch(err => {logger.log(`Error fetching user from Auth database:`, err); throw new HttpsError('internal', err);});
  return userAuthData;
}

export const fetchAdminAuthUserById = async (userId: string): Promise<UserRecord> => {
  const userAuthData: UserRecord = await getAuth(adminAppFirebaseInstance).getUser(userId)
    .catch(err => {logger.log(`Error fetching user from Auth database:`, err); throw new HttpsError('internal', err);});
  return userAuthData;
}

export const convertPublicUserDataToEmailUserData = (userData: PublicUser): EmailUserData => {
  const emailUserData: EmailUserData = {
    [PublicUserKeys.CREATED_TIMESTAMP]: userData[PublicUserKeys.CREATED_TIMESTAMP],
    [PublicUserKeys.EMAIL]: userData[PublicUserKeys.EMAIL], 
    [PublicUserKeys.EMAIL_GROUP_UNSUBSCRIBES]: userData[PublicUserKeys.EMAIL_GROUP_UNSUBSCRIBES],
    [PublicUserKeys.EMAIL_GLOBAL_UNSUBSCRIBE]: userData[PublicUserKeys.EMAIL_GLOBAL_UNSUBSCRIBE],
    [PublicUserKeys.EMAIL_OPT_IN_SOURCE]: userData[PublicUserKeys.EMAIL_OPT_IN_SOURCE],
    [PublicUserKeys.EMAIL_OPT_IN_CONFIRMED]: userData[PublicUserKeys.EMAIL_OPT_IN_CONFIRMED],
    [PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP]: userData[PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP], 
    [PublicUserKeys.EMAIL_OPT_OUT_TIMESTAMP]: userData[PublicUserKeys.EMAIL_OPT_OUT_TIMESTAMP], 
    [PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP]: userData[PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP],
    [PublicUserKeys.EMAIL_SENDGRID_CONTACT_ID]: userData[PublicUserKeys.EMAIL_SENDGRID_CONTACT_ID],
    [PublicUserKeys.EMAIL_SENDGRID_CONTACT_LIST_ARRAY]: userData[PublicUserKeys.EMAIL_SENDGRID_CONTACT_LIST_ARRAY],
    [PublicUserKeys.EMAIL_VERIFIED]: userData[PublicUserKeys.EMAIL_VERIFIED],
    [PublicUserKeys.FIRST_NAME]: userData[PublicUserKeys.FIRST_NAME],
    [PublicUserKeys.ID]: userData[PublicUserKeys.ID],
    [PublicUserKeys.LAST_MODIFIED_TIMESTAMP]: userData[PublicUserKeys.LAST_MODIFIED_TIMESTAMP],
    [PublicUserKeys.ONBOARDING_WELCOME_EMAIL_SENT]: userData[PublicUserKeys.ONBOARDING_WELCOME_EMAIL_SENT],
  };
  return emailUserData;
}

export const verifyAdminAuthUidMatchesDocumentUserIdOrIsSuperAdmin = async (request: CallableRequest, documentUserId: string): Promise<boolean> => {
  const authId = request.auth?.uid;

  if (!authId) {
    logger.log(`no authId found, permission to proceed denied`);
    throw new HttpsError('permission-denied', 'Caller does not have permission to modify this document');
  }

  if (authId === documentUserId) {
    logger.log(`authId matches documentUserId, permission to proceed granted.`);
    return true;
  }

  const adminUsersCollection = adminFirestore.collection(AdminCollectionPaths.ADMIN_USERS);
  const userData = await fetchAdminDbUserById(authId, adminUsersCollection);
  const isAdmin = userData.isSuperAdmin;

  if (isAdmin) {
    logger.log(`User is admin, permission to proceed granted.`);
    return true;
  }

  throw new HttpsError('permission-denied', 'Caller does not have permission to modify this document');
}

// Sourced from here: https://chat.openai.com/share/e/5348be84-2a32-4887-9f3e-a4571615d1da

/**
 * Validates the authenticity of a request based on an OIDC token.
 * 
 * This function extracts the OIDC token from the Authorization header of the request,
 * verifies it against Google's OAuth2 client, and checks if the token's audience
 * matches the expected audience. This is used to ensure that the request is 
 * authenticated and authorized to access the respective Cloud Function.
 * 
 * If function originates from Cloud Scheduler, be sure to create a Service Account with 
 * the Cloud Functions Invoker role and assign it to the cloud scheduler function, including
 * the email of the service account for the audience. Store the email in the secret manager
 * and configure the function it calls to retrieve the secret.
 *
 * @param {Request} req - The HTTP request object from Express.
 * @param {Response} res - The HTTP response object from Express.
 * @param {string} expectedAudience - The expected audience string (aud) that the OIDC token should contain.
 *                                    This is generally the service account email though it can be any unique id.
 * 
 * @returns {Promise<boolean | void>} - Returns `true` if the request is authenticated and authorized,
 *                                      otherwise, it sends a 401 Unauthorized response and does not return.
 */
export const validateRequestToken = async (req: Request, res: Response, expectedAudience: string): Promise<boolean | void> => {
    const token = req.get('Authorization')?.split(' ')[1];
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
        return;
    }

    const client = new OAuth2Client();

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: expectedAudience, // Specify the expected audience value
        });
        const payload = ticket.getPayload();

        // Check the audience field
        if (payload && payload.aud === expectedAudience) {
            // Request is verified, proceed with the function logic
            logger.log('Request verification succeeded.');
            return true;
        } else {
            res.status(401).send('Unauthorized: Invalid audience');
            return;
        }
    } catch (error: any) {
        res.status(401).send(`Unauthorized: Invalid token - ${error.message}`);
    }
};

export const PUBLIC_EMAIL_USER_DATA: EmailUserData = {
  [PublicUserKeys.CREATED_TIMESTAMP]: Timestamp.fromDate(new Date('2024-02-07T10:00:00Z')) as any,
  [PublicUserKeys.EMAIL]: EmailSenderAddresses.EXPN_ADMIN, 
  [PublicUserKeys.EMAIL_GROUP_UNSUBSCRIBES]: null,
  [PublicUserKeys.EMAIL_GLOBAL_UNSUBSCRIBE]: null,
  [PublicUserKeys.EMAIL_OPT_IN_CONFIRMED]: true,
  [PublicUserKeys.EMAIL_OPT_IN_SOURCE]: EmailOptInSource.WEBSITE_SUBSCRIBE_BOX,
  [PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP]: Timestamp.fromDate(new Date('2024-02-07T10:00:00Z')) as any, 
  [PublicUserKeys.EMAIL_OPT_OUT_TIMESTAMP]: null, 
  [PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP]: Timestamp.fromDate(new Date('2024-02-07T10:00:00Z')) as any,
  [PublicUserKeys.EMAIL_SENDGRID_CONTACT_ID]: null,
  [PublicUserKeys.EMAIL_SENDGRID_CONTACT_LIST_ARRAY]: null,
  [PublicUserKeys.EMAIL_VERIFIED]: true,
  [PublicUserKeys.FIRST_NAME]: 'ADMIN',
  [PublicUserKeys.ID]: 'ADMIN',
  [PublicUserKeys.LAST_MODIFIED_TIMESTAMP]: Timestamp.fromDate(new Date('2024-02-07T10:00:00Z')) as any,
  [PublicUserKeys.ONBOARDING_WELCOME_EMAIL_SENT]: true,
}

export const convertPostToBlogIndexRef = (post: Post): BlogIndexRef => {
  const blogIndexRef: BlogIndexRef = {
    [PostKeys.AUTHOR_NAME]: post[PostKeys.AUTHOR_NAME],
    [PostKeys.AUTHOR_ID]: post[PostKeys.AUTHOR_ID],
    [PostKeys.CREATED_TIMESTAMP]: post[PostKeys.CREATED_TIMESTAMP],
    [PostKeys.FEATURED]: post[PostKeys.FEATURED],
    [PostKeys.ID]: post[PostKeys.ID],
    [PostKeys.HERO_IMAGES]: post[PostKeys.HERO_IMAGES],
    [PostKeys.LAST_MODIFIED_TIMESTAMP]: post[PostKeys.LAST_MODIFIED_TIMESTAMP],
    [PostKeys.LAST_MODIFIED_USER_ID]: post[PostKeys.LAST_MODIFIED_USER_ID],
    [PostKeys.LAST_MODIFIED_USER_NAME]: post[PostKeys.LAST_MODIFIED_USER_NAME],
    [PostKeys.PUBLISHED]: post[PostKeys.PUBLISHED],
    [PostKeys.PUBLISHED_TIMESTAMP]: post[PostKeys.PUBLISHED_TIMESTAMP],
    [PostKeys.READY_TO_PUBLISH]: post[PostKeys.READY_TO_PUBLISH],
    [PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP]: post[PostKeys.SCHEDULED_AUTOPUBLISH_TIMESTAMP],
    [PostKeys.TITLE]: post[PostKeys.TITLE],
  };
  return blogIndexRef;
}

export const fetchAdminPostById = async (postId: string): Promise<Post> => {
  const adminPostSnapshot = await adminFirestore.collection(SharedCollectionPaths.POSTS).doc(postId).get()
    .catch(err => {logger.log(`Error fetching post on admin`, err); throw new HttpsError('internal', err);});

  const post = adminPostSnapshot.data() as Post;
  return post;
}

export const convertMillisToTimestamp = (millis: number): Timestamp => {
  const seconds = Math.floor(millis / 1000);
  const nanoseconds = (millis % 1000) * 1000000;
  return new Timestamp(seconds, nanoseconds);
}

/**
 * Converts a time string in the format "HH:MM:SS" to milliseconds.
 * 
 * @param {string} timeString - The time string to be converted. It must be in the format "HH:MM:SS".
 * @returns {number} The time in milliseconds.
 * @throws {Error} Throws an error if the input string is not in the correct format.
 * 
 * This function first splits the input time string into its constituent parts: hours, minutes, and seconds.
 * It then converts each part into an integer. After that, it calculates the total time in milliseconds
 * by converting hours and minutes to seconds, summing all up, and finally multiplying by 1000 to convert 
 * seconds to milliseconds.
 */
export const convertHHMMSSToMillis = (timeString: string): number => {
  const parts = timeString.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid time format');
  }

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);

  return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

/**
 * Converts a Timestamp object sourced from the Firebase Firestore database using the firebase-admin SDK into 
 * a Google Cloud Timestamp using the \@google-cloud/firestore SDK so that it can be manipulated as needed.
 * 
 * Without this conversion, manipulations on Timestamps retrieved using the firebase-admin SDK will throw an error.
 * 
 * * @param {FirebaseTimestamp} firebaseTimestamp - The Timestamp from Firestore database to be converted.
 * * @returns {Timestamp} The same timestamp in the Google Cloud Timestamp format 
 * 
 */
export const convertFirebaseTimestampToGoogleCloudTimestamp = (firebaseTimestamp: FirebaseTimestamp): Timestamp => {
  const seconds = (firebaseTimestamp as any)['_seconds'];
  const nanoseconds = (firebaseTimestamp as any)['_nanoseconds'];
  return new Timestamp(seconds, nanoseconds);
};
