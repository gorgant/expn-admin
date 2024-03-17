import { EmailIdentifiers } from "./email-vars.model";
import { Timestamp } from '@angular/fire/firestore';


export interface EmailLogEntry {
  emailCategory: EmailIdentifiers;
  recipientEmail: string;
  recipientId: string;
  sentTimestamp: number | Timestamp;
}