import { PublicUser } from './public-user.model';

export interface ContactForm {
  id: string;
  createdDate: number;
  firstName: string;
  email: string;
  message: string;
  publicUser: PublicUser;
}
