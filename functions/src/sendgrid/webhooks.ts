import * as functions from 'firebase-functions';
import { EmailEvent } from '../../../shared-models/email/email-event.model';
import { updateEmailRecord } from './handlers';
import { EmailCategories } from '../../../shared-models/email/email-vars.model';


const isSandbox = (events: EmailEvent[], req: functions.Request, res: functions.Response): Promise<boolean> => {
  
  console.log('Opening exitIfSandbox function');

  const sandboxCheck = new Promise<boolean> ((resolve, reject) => {

    if (!events) {
      console.log('No events present');
      resolve(false);
      return;
    }

    events.forEach(event => {
      if (!event.category) {
        console.log('No event category present');
        resolve(false);
        return;
      }

      console.log('Scanning this event category list', event.category)

      // Since category can be a single string, first check for that
      if (typeof event.category === 'string' && event.category === EmailCategories.TEST_SEND) {
        console.log(`Sandbox mode based on this event category: ${event.category}, canceling function, received this data`, req.body);
        res.sendStatus(200);
        resolve(true);
        return;
      }

      // Otherwise must be array, so loop through that
      (event.category as string[]).forEach(category => {
        if (category === EmailCategories.TEST_SEND) {
          console.log(`Sandbox mode based on this event category: ${category}, canceling function, received this data`, req.body);
          resolve(true);
          return;
        }
      });
      resolve(false);
      return;
    })

  });

  return sandboxCheck;
}


/////// DEPLOYABLE FUNCTIONS ///////

// Receives an invoice payload from stripe
export const sgEmailWebhookEndpoint = functions.https.onRequest(

  async (req, res) => {

    const events: EmailEvent[] = req.body;

    const isTestEmail = await isSandbox(events, req, res);

    // Prevents test data from using production webhook
    // Sendgrid only allows one webhook, so be sure to switch Sendgrid webhook setting to the sandbox endpoint before commenting this out: https://app.sendgrid.com/settings/mail_settings
    if (isTestEmail) {
      res.sendStatus(200);
      return;
    }
    console.log('No sandbox found');
    
    try {
      console.log('Sending webhook data to handler', events);
      await updateEmailRecord(events)
        .catch(error => console.log('Error updating email records when contacting handler', error));

      res.sendStatus(200);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);