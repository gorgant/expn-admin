import { PublicUser } from './public-user.model';

export interface ContactForm {
  name: string;
  email: string;
  message: string;
  publicUser: PublicUser;
}
