// See reference: https://sendgrid.com/docs/for-developers/tracking-events/event/#timestamp

export interface EmailEvent {
  email: string;
  timestamp: number;
  event: string;
  'smtp-id': string;
  useragent?: string;
  ip?: string;
  sg_event_id: string;
  sg_message_id: string;
  reason?: string;
  status?: string;
  response?: string;
  tls?: any;
  url?: string;
  category: string | [];
  asm_group_id?: number;
  marketing_campaign_id?: string;
  marketing_campaign_name?: string;
  attempt?: string;
  pool?: any;
}
