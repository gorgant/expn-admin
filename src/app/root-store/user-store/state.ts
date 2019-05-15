import { AdminUser } from 'src/app/core/models/user/admin-user.model';

export interface State {
  user: AdminUser | null;
  isLoading: boolean;
  error?: any;
  userLoaded: boolean;
}

export const initialState: State = {
  user: null,
  isLoading: false,
  error: null,
  userLoaded: false,
};
