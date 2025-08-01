export interface ProductBuyCredentialsI {
  is_gift: boolean,
  gifted_to_email: string,
  product_id: string,
  quantity: number
}

export interface ProductResponseI {
  ID: string,
  name: string,
  description: string,
  price_int: number,
  quantity: number,
  is_physical_item: boolean,
  is_public: boolean,
  is_blocked: boolean,
  is_hidden: boolean,
  has_unlimited_quantity: boolean,
  is_ticket_type: boolean,
  expires_at: string,
  is_event_access: boolean,
  is_activity_access: boolean,
  is_activity_token: boolean,
  access_targets: AccessTargetsI[],
}

export interface ProductPurchasesResponseI {
  id: string,
  product_id: string,
  is_delivered: boolean,
  is_gift: boolean,
  gifted_to_email: string,
  quantity: number,
  purchased_at: string,
}

export interface UserTokensResponseI {
  id: string,
  event_id: string,
  product_id: string,
  is_used: boolean,
  used_for_id: string,
  used_at: string,
  user_product_id: string,
}

interface AccessTargetsI {
  id: string,
  is_event: boolean,
  target_id: string,
}