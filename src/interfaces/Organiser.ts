import OrganisedEvent from './Event';
export default interface Organiser {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  events: OrganisedEvent[];
}