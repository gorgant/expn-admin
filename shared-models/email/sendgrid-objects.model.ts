import { SendgridContactListId, SgContactCustomFieldData } from "./email-vars.model";

export interface SendgridStandardJobResponse {
  job_id: string;
}

export interface SendgridImportStatusResponse {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  results: {
    requested_count: number;
    created_count: number;
    updated_count: number;
    deleted_count: number;
    errored_count: number;
    errors_url: string;
  };
  started_at: string;
  finished_at: string;
}

// See latest interface here: https://sendgrid.com/docs/api-reference/ (marketing/contacts)
export interface SendgridContact {
  email: string;
  address_line_1?: string;
  address_line_2?: string;
  alternate_emails?: string[];
  city?: string;
  country?: string;
  first_name?: string;
  id?: string;
  last_name?: string;
  postal_code?: string;
  state_province_region?: string;
  list_ids?: string[];
  created_at?: string;
  updated_at?: string;
  _metadata?: {
    self?: string;
  };
  custom_fields?: SgContactCustomFieldData;
  phone_number?: string;
  whatsapp?: string;
  line?: string;
  facebook?: string;
  unique_name?: string;
}

export interface SendgridContactUploadData {
  list_ids: SendgridContactListId[],
  contacts: SendgridContact[]
}


export interface SendgridSearchContactsResponse {
  result: SendgridContact[];
  _metadata: {
    self: string;
  };
  contact_count: number;
}

export interface SendgridGetContactCountResponse {
  contact_count: number;
  billable_count: number;
}

export interface SendgridGlobalSupressionsQueryResponseObject {
  email: string;
  created: number;
}

