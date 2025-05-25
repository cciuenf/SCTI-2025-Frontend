export interface ProductCredentialsI {
  name: string,
  description: string;
  price_int: number,
  has_unlimited_quantity: boolean,
  quantity: number,
  max_ownable_quantity: number,
  is_physical_item: boolean,
  is_public: boolean,
  is_blocked: boolean,
  is_hidden: boolean,
  is_ticket_type: boolean,
  access_targets: {is_event: boolean, target_id: string}[]
}


export interface ProductResponseI {
  access_targets: AccessTargets[];
}

interface AccessTargets {
  is_event: boolean;
  product_id: string;
  target_id: string;
}