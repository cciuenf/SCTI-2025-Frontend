export interface EventCredentialsI {
  description: string;
  end_date: Date | string;
  is_blocked: boolean;
  is_hidden: boolean;
  location: string;
  max_tokens_per_user: number;
  name: string;
  slug: string;
  start_date: Date | string;
}

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
  end_date: string;
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
}
