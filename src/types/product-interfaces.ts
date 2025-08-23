export interface ProductBuyCredentialsI {
  product_id: string,
  quantity: number,
  payment_method_id?: string, // visa | master | etc...
  payment_method_type?: string, // pix
  payment_method_token?: string, // token
  payment_method_installments?: number, // installments
  is_gift: boolean,
  gifted_to_email: string,
}

export interface ProductResponseI {
  ID: string,
  name: string,
  description: string,
  price_int: number,
  quantity: number,
  token_quantity?: number;
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

export interface ProductPixPurchaseResponseI {
  id: string,
  payment_method: PaymentMeyhodI,
  status: string,
  callback_url?: string;
}

export type PaymentResult = ProductPixPurchaseResponseI | ProductPurchasesResponseI;

export interface ProductPurchasesResourceResponseI {
  id: string,
  transactions: TransactionResponseI,
}

export interface TransactionResponseI {
  payments: PaymentResponseI[],
}

export interface PaymentResponseI {
  id: string,
  payment_method: PaymentMeyhodI
}

export interface PaymentMeyhodI {
  id: string,
  ticket_url: string,
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