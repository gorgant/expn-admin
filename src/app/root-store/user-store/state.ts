import { AppUser } from 'src/app/core/models/user/app-user.model';

export interface State {
  user: AppUser | null;
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
