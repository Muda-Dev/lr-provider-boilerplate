// Request Types
export interface GenerateQuoteRequest {
  amount: number;
  currency: string;
  asset_code: string;
  service_id: string;
}

// Payment method interfaces
export interface BankPayment {
  type: 'bank';
  bank_name: string;
  bank_code: string;
  currency: string;
  account_number: string;
  account_name: string;
  swift_code: string;
  bank_country: string;
}

export interface MobileMoneyPayment {
  type: 'mobile_money';
  currency: string;
  phone_number: string;
  country_code: string;
  network: string;
  account_name: string;
}

export interface ConfirmQuoteRequest {
  quote_id: string;
  reference_id: string;
  payment_method_id: string;
  sending_address: string;
  source: string;
}

export interface RefreshQuoteRequest {
  quote_id: string;
}

export interface GetTransactionRequest {
  transaction_id: string;
}

export interface GetTransactionsRequest {
  provider_id: number;
  status?: string;
  limit?: number;
  offset?: number;
}

// Response Types
export interface QuoteData {
  quote_id: string;
  rate: number;
  fee: number;
  total_amount: number;
  service_id: string;
  expires_at: string;
}

export interface PayInTransaction {
  status: string;
  amount: string;
  chain: string;
  hash: string;
  from_address: string;
  to_address: string;
  asset_code: string;
  fee: string;
}

export interface PayoutTransaction {
  status: string;
  amount: string;
  amount_delivered: number;
  currency: string;
  reference_id: string;
  fee: string;
  account: BankPayment | MobileMoneyPayment;
}

export interface TransactionData {
  transaction_id: string;
  quote_id: string;
  provider_id: string;
  status: string;
  created_on: string;
  from_currency: string;
  to_currency: string;
  from_amount: string;
  to_amount: string;
  transaction_type: string;
  coinTransaction?: PayInTransaction;
  fiatTransaction?: PayoutTransaction;
}

export interface ConfirmQuoteData {
  transaction_id: string;
  status: string;
  pay_in_address: string;
  memo: string;
  send_amount: string;
}

// API Response Format
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

// Webhook Types
export interface WebhookEvent {
  eventType: string;
  provider_id: string;
  quote_id: string;
  status?: string;
  data: any;
}

export interface CryptoWebhookData {
  amount: string;
  chain: string;
  hash: string;
  from_address: string;
  to_address: string;
  asset_code: string;
  contract_address?: string;
  fee: string;
  currency: string;
  memo?: string;
}

export interface FiatWebhookData {
  amount: string;
  amount_delivered: number;
  currency: string;
  reference_id: string;
  account_number: string;
  payment_type: string;
  payment_method: string;
  network: string;
  country: string;
  receiver_name: string;
  fee: string;
}

// Event Types
export type CryptoEventType = 'crypto_received' | 'crypto_sent' | 'crypto_failed';
export type FiatEventType = 'fiat_sent' | 'fiat_failed' | 'fiat_pending';
export type TransactionEventType = 'transaction_created' | 'transaction_updated' | 'transaction_completed' | 'transaction_failed';
export type WebhookEventType = CryptoEventType | FiatEventType | TransactionEventType;

// MUDA Authentication types
export interface MudaAuthRequest {
  secret_key: string;
  api_key: string;
}

export interface MudaAuthResponse {
  status: number;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
} 