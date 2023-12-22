import Organiser from './Organiser';
export enum UserType {
    Member,
    Admin
}
export default interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  type: UserType;
  organiser: Organiser;
  approved: Boolean;
}