export interface ActivityResponseI {
  ID: string,
  name: string,
  speaker: string,
  description: string,
  location: string,
  has_fee: boolean,
  event_id: string,
  has_unlimited_capacity: boolean,
  max_capacity: number,
}