import * as functions from 'firebase-functions';
import { adminFirestore } from '../config/db-config';
import { AdminCollectionPaths } from '../../../shared-models/routes-and-paths/fb-collection-paths';
import { now } from 'moment';
import { EditorSession, EditorSessionVars, EditorSessionKeys } from '../../../shared-models/editor-sessions/editor-session.model'

const adminDb = adminFirestore;

const purgeSessions = async () => {
  const batch = adminDb.batch();

  const editorSessionCollection = await adminDb.collection(AdminCollectionPaths.EDITOR_SESSIONS).get()
    .catch(err => {functions.logger.log(`Error fetching editor session collection from admin database:`, err); throw new functions.https.HttpsError('internal', err);});
  
  // Exit function if array is empty
  if (editorSessionCollection.docs.length < 1) {
    functions.logger.log('No editor sessions to purge, exiting function');
    return;
  }

  editorSessionCollection.docs.forEach(sessionSnapshot => {
    const session = sessionSnapshot.data() as EditorSession
    const timeSinceLastUpdate = now() - session.lastModifiedTimestamp;
    const expiredSession = timeSinceLastUpdate > EditorSessionVars.INACTIVE_TIMEOUT_LIMIT;
    const inactiveSession = !session[EditorSessionKeys.ACTIVE];
    if (expiredSession || inactiveSession) {
      batch.delete(sessionSnapshot.ref)
    }
  })

  const batchDelete = await batch.commit()
    .catch(err => {functions.logger.log(`Error with batch delete:`, err); throw new functions.https.HttpsError('internal', err);});
  
  functions.logger.log(`Batch deleted ${batchDelete.length} editor sessions`);
}

/////// DEPLOYABLE FUNCTIONS ///////

// A cron job triggers this function
export const purgeInactiveEditorSessions = functions.https.onRequest( async (req, res ) => {
  functions.logger.log('Purge inactive editor sessions request received with these headers', req.headers);

  if (req.headers['user-agent'] !== 'Google-Cloud-Scheduler') {
    functions.logger.log('Invalid request, ending operation');
    return;
  }

  await purgeSessions();

  functions.logger.log('All inactive editor sessions purged', res);
  res.status(200).send('All inactive editor sessions purged');
})

