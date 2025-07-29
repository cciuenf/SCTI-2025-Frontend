export interface ActivityResponseI {
  ID: string,
  name: string,
  speaker: string,
  type: string;
  description: string,
  location: string,
  has_fee: boolean,
  event_id: string,
  has_unlimited_capacity: boolean,
  max_capacity: number,
  is_blocked: boolean,
  is_hidden: boolean,
  is_mandatory: boolean,
  is_standalone: boolean,
  standalone_slug: string,
  start_time: string,
  end_time: string,
}

export interface ActivityRegistrationI {
  activity_id: string,
  user_id: string,
  registered_at: string;
  attended_at: string | null;
  access_method: string;
}