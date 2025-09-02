export interface EventResponseI {
  ID: string;
  Name: string;
  Slug: string;
  description: string;
  location: string;
  is_blocked: boolean;
  is_hidden: boolean;
  is_public: boolean;
  max_tokens_per_user: number;
  start_date: Date;
  end_date: Date;
  created_by: string;
  created_at: string;
  updated_at: Date;
  deleted_at: {
    time: string;
    valid: boolean;
  };
  activities: string[];
  attendees: string[];
  products: string[];
  participant_count: number;
}

export interface EventSubscriptionResponseI {
  data: string;
  message: string;
  success: boolean
}

export interface EventCoffeeBreakResponseI {
  id: string;
  event_id: string;
  start_date: string;
  end_date: string;
  registrations?: EventCoffeeRegistrationsI[]
  created_at: string;
  updated_at: string;
}

export interface EventCoffeeRegistrationsI {
  coffee_id: string;
  user_id: string;
  attended_at: string | null;
}

// UnregisterFromCoffeeRequest
// user_id
// coffee_id