import Item from './Item';
import Organiser from './Organiser';
export default interface OrganisedEvent {
  id: number;
  name: string;
  description: string;
  date: Date;
  address: string;
  items: Item[];
  organiser: Organiser;
  organiserId: number;
}