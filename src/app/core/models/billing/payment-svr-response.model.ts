import { PaymentResponseMsg } from './payment-response-msg.model';
import { Invoice } from './invoice.model';

export interface PaymentSvrResponse {
  responseMsg: PaymentResponseMsg;
  invoice: Invoice;
}
