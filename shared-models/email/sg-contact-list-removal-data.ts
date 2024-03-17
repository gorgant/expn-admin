import { EmailUserData } from "./email-user-data.model";
import { SendgridContactListId } from "./email-vars.model";

export interface SgContactListRemovalData  {
  emailUserData: EmailUserData;
  listsToUpdate: SendgridContactListId[]
}