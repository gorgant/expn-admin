import { Invoice } from '../billing/invoice.model';

export interface AnonymousUser {
  id: string;
  lastAuthenticated: number;
  invoice?: Invoice;
}
