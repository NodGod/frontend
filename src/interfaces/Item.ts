import OrganisedEvent from "./Event";

export default interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
  event: OrganisedEvent;
  eventId: number;
}