import { EmailEvent } from "../../../shared-models/email/email-event.model";
import { EmailRecord, EmailRecordWithClicks } from "../../../shared-models/email/email-record.model";
import { adminFirestore } from "../db";
import { AdminCollectionPaths } from "../../../shared-models/routes-and-paths/fb-collection-paths";
import { EmailEventType } from "../../../shared-models/email/email-event-type.model";

export const updateEmailRecord = async (emailEvents: EmailEvent[]) => {

  if (emailEvents.length < 1) {
    return 'No events in email record';
  }
  
  const subId = emailEvents[0].email;
  const recordId = emailEvents[0].sg_message_id;

  const db = adminFirestore;
  const subDocRef: FirebaseFirestore.DocumentReference = db.collection(AdminCollectionPaths.SUBSCRIBERS).doc(subId);
  const emailRecordDocRef: FirebaseFirestore.DocumentReference = subDocRef.collection(AdminCollectionPaths.EMAIL_RECORDS).doc(recordId);

  const logEvent = emailEvents.map( async rawEventData => {

    let eventKey: EmailEventType | string;
    eventKey = rawEventData.event as EmailEventType;

    
    const updatedEmailEventObject: EmailRecordWithClicks = {};

    // If this is a click, need to retrieve doc to inspect previous click data if it exists
    if (eventKey === EmailEventType.CLICK) {
      
      const emailRecordDoc = await emailRecordDocRef.get();
      const emailRecordData: EmailRecordWithClicks = emailRecordDoc.data() as EmailRecord;
      console.log('Click type detected, fetched this email record data', emailRecordData);

      // If click data exists, add a click count and modify key
      if (emailRecordData.clickCount) {
        console.log(`Click exists with ${emailRecordData.clickCount} click(s), adding new click data`,)
        const updatedClickCount = emailRecordData.clickCount + 1;
        updatedEmailEventObject.clickCount = updatedClickCount;
        eventKey = `click_${updatedClickCount}`;
      } else {
        console.log('No click exists, setting click to 1');
        updatedEmailEventObject.clickCount = 1;
      }
    }

    console.log('Using this event key', eventKey);
    
    updatedEmailEventObject[eventKey as EmailEventType] = rawEventData;

    console.log('Updating email record with this event object', updatedEmailEventObject);
    await emailRecordDocRef.set(updatedEmailEventObject, {merge: true})
      .catch(error => console.log(`Error updating email record with this event object ${updatedEmailEventObject} because`, error));

    return 'Event recorded';
  });

  const res = await Promise.all(logEvent)
    .catch(error => console.log('Error in email record group promise', error));
  console.log('All events logged in email record', res);

  return res;
}