import * as functions from 'firebase-functions';
import { adminFirestore } from '../config/db-config';
import * as sendGridMail from '@sendgrid/mail';
import { publicAppUrl } from '../config/environments-config';
import { PublicAppRoutes } from '../../../shared-models/routes-and-paths/app-routes.model';
import { ProductIdList } from '../../../shared-models/products/product-id-list.model';
import { AcademyUrls } from '../../../shared-models/routes-and-paths/academy-urls.model';

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


// Useful links for emails
const appUrl = publicAppUrl;
const blogSlugWithSlashPrefix = PublicAppRoutes.BLOG;
const blogUrl = `https://${appUrl}${blogSlugWithSlashPrefix}`;
const productListSlugWithSlashPrefix = PublicAppRoutes.PRODUCTS;
const remoteCoachProductId = ProductIdList.EXPN_REMOTE_COACH;
const remoteCoachProductSlug = ProductIdList.EXPN_REMOTE_COACH;
const remoteCoachUrl = `https://${appUrl}${productListSlugWithSlashPrefix}/${remoteCoachProductId}/${remoteCoachProductSlug}`;
const confirmationSlugWithSlahPrefeix = PublicAppRoutes.SUB_CONFIRMATION;
const optInConfirmationUrlNoParams = `https://${appUrl}${confirmationSlugWithSlahPrefeix}`;
const webCoursesSlugWithSlashPrefix = PublicAppRoutes.WEBCOURSES;
const webcoursesUrl = `https://${appUrl}${webCoursesSlugWithSlashPrefix}`;
const academyUrl = AcademyUrls.ACADEMY_SIGNUP;


export const EmailWebsiteLinks = {
  BLOG_URL: blogUrl,
  REMOTE_COACH_URL: remoteCoachUrl,
  OPT_IN_CONFIRMATION_URL_NO_PARAMS: optInConfirmationUrlNoParams,
  WEBCOURSES_URL: webcoursesUrl,
  ACADEMY_URL: academyUrl
};

export const sendgridContactsApiUrl = 'https://api.sendgrid.com/v3/marketing/contacts';
export const sendgridSuppressionsApiUrl = 'https://api.sendgrid.com/v3/suppression';
