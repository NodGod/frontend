import Organiser from './Organiser';
export enum UserType {
    Member,
    Admin
}
export default interface User {
  type: number;
  organisation: any;
  id: number;
  name: string;
  surname: string;
  email: string;
  role: UserType;
  organiser: Organiser;
  approved: Boolean;
}