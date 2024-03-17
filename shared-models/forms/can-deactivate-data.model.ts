import { ActionConfData } from "./action-conf-data.model";

export interface CanDeactivateData {
  deactivationPermitted: boolean,
  warningMessage: ActionConfData
}