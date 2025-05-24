export interface ProductCredentialsI {
  // Produto só vai ter is_event e target_id
  // access_targets: AccessTargets[];
  description: string;
  // event_id: string;
  has_unlimited_quantity: boolean,
  // is_activity_access: boolean,
  // is_activity_token: boolean,
  // is_blocked: boolean,
  // is_event_access: boolean,
  // is_hidden: boolean,
  // is_physical_item: boolean,
  // is_public: boolean,
  // is_ticket_type: boolean,
  // max_ownable_quantity: number,
  name: string,
  price_int: number,
  quantity: number,
  // token_quantity: number
}


export interface ProductResponseI {
  access_targets: AccessTargets[];
}

interface AccessTargets {
  is_event: boolean;
  product_id: string;
  target_id: string;
}

// O form será por slug, preciso criar uma página para os slugs/events
// /events/slug pega todos os eventoss
// /events/slug/activities - pega todas as atividades do do evento