export interface EventCredentialsI {
  description: string;
  end_date: Date;
  is_blocked: false;
  is_hidden: true;
  location: string;
  max_tokens_per_user: 1;
  name: string;
  slug: string;
  start_date: Date;
}

export interface EventResponseI {
  activities: unknown[];
}
