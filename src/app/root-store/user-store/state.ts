import { AdminUser } from 'shared-models/user/admin-user.model';
import { EditorSession } from 'shared-models/editor-sessions/editor-session.model';

export interface State {
  user: AdminUser | null;
  serverEditorSession: EditorSession;
  activeEditorSessions: EditorSession[];
  isLoading: boolean;
  isLoadingServerEditorSession: boolean;
  isCreatingEditorSession: boolean;
  isUpdatingEditorSession: boolean;
  isDeletingEditorSession: boolean;
  isLoadingActiveEditorSessions: boolean;
  isDisconnectingActiveEditorSessions: boolean;
  error?: any;
  loadServerEditorSessionError: any;
  createEditorSessionError: any;
  updateEditorSessionError: any;
  deleteEditorSessionError: any;
  loadActiveEditorSessionsError: any;
  disconnectActiveEditorSessionsError: any;
  userLoaded: boolean;
  serverEditorSessionCreated: boolean;
  activeEditorSessionsLoaded: boolean;
}

export const initialState: State = {
  user: null,
  serverEditorSession: null,
  activeEditorSessions: null,
  isLoading: false,
  isLoadingServerEditorSession: false,
  isCreatingEditorSession: false,
  isUpdatingEditorSession: false,
  isDeletingEditorSession: false,
  isLoadingActiveEditorSessions: false,
  isDisconnectingActiveEditorSessions: false,
  error: null,
  loadServerEditorSessionError: null,
  createEditorSessionError: null,
  updateEditorSessionError: null,
  deleteEditorSessionError: null,
  loadActiveEditorSessionsError: null,
  disconnectActiveEditorSessionsError: null,
  userLoaded: false,
  serverEditorSessionCreated: false,
  activeEditorSessionsLoaded: false
};
