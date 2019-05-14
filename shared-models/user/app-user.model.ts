export interface AppUser {
  displayName: string;
  email: string;
  isAdmin: boolean;
  avatarUrl?: string;
  id?: string;
  isNewUser?: boolean;
}
