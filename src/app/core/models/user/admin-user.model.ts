export interface AdminUser {
  displayName: string;
  email: string;
  lastAuthenticated: number;
  createdDate?: number;
  isAdmin?: boolean;
  avatarUrl?: string;
  id?: string;
  isNewUser?: boolean;
}
