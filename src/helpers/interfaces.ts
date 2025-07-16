// Request Types
export interface GenerateQuoteRequest {
  amount: number;
  currency: string;
  asset_code: string;
  service_code: string;
}

export interface ConfirmQuoteRequest {
  quote_id: string;
  reference_id: string;
  payment_method_id: string;
  sending_address: string;
  source: string;
  company_id: string;
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
  expires_at: string;
}

export interface TransactionData {
  transaction_id: string;
  quote_id: string;
  provider_id: number;
  company_id: number;
  send_asset: string;
  send_amount: string;
  receive_currency: string;
  receive_amount: number;
  ex_rate: string;
  account_number: string;
  service_id: number;
  status: string;
  created_on: string;
}

export interface ConfirmQuoteData {
  transaction_id: string;
  status: string;
  provider_address: string;
  provider_memo: string;
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