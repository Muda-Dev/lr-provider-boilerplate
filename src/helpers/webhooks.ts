import axios from 'axios';
import { WebhookEvent, CryptoWebhookData, FiatWebhookData, MudaAuthRequest, MudaAuthResponse } from './interfaces';

export class WebhookService {
  private static webhookUrl = process.env.MUDA_WEBHOOK_URL 
  private static authUrl = process.env.MUDA_AUTH_URL 
  private static secretKey = process.env.MUDA_SECRET_KEY 
  private static apiKey = process.env.MUDA_API_KEY 
  
  private static accessToken: string | null = null;
  private static tokenExpiry: number = 0;

  // Get authentication token from MUDA
  private static async getAuthToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const authRequest: MudaAuthRequest = {
      secret_key: this.secretKey,
      api_key: this.apiKey
    };

    const response = await axios.post<MudaAuthResponse>(this.authUrl, authRequest);
    
    if (response.data.status !== 200) {
      throw new Error(`Authentication failed: ${response.data.message}`);
    }

    this.accessToken = response.data.data.access_token;
    this.tokenExpiry = Date.now() + (response.data.data.expires_in * 1000) - 300000;
    
    return this.accessToken;
  }

  // Send webhook with authentication
  private static async sendWebhook(webhookEvent: WebhookEvent): Promise<void> {
    const accessToken = await this.getAuthToken();

    const response = await axios.post(this.webhookUrl, webhookEvent, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      timeout: 10000,
    });

    if (response.status !== 200) {
      throw new Error(`Webhook failed with status: ${response.status}`);
    }
  }

  // Send crypto webhook
  static async sendCryptoWebhook(
    providerId: string,
    quoteId: string,
    eventType: 'crypto_received' | 'crypto_sent' | 'crypto_failed',
    data: CryptoWebhookData
  ): Promise<void> {
    const webhookEvent: WebhookEvent = {
      eventType,
      provider_id: providerId,
      quote_id: quoteId,
      data,
    };

    await this.sendWebhook(webhookEvent);
  }

  // Send fiat webhook
  static async sendFiatWebhook(
    providerId: string,
    quoteId: string,
    eventType: 'fiat_sent' | 'fiat_failed' | 'fiat_pending',
    status: string,
    data: FiatWebhookData
  ): Promise<void> {
    const webhookEvent: WebhookEvent = {
      eventType,
      provider_id: providerId,
      status,
      quote_id: quoteId,
      data,
    };

    await this.sendWebhook(webhookEvent);
  }

  // Send transaction webhook
  static async sendTransactionWebhook(
    providerId: string,
    quoteId: string,
    eventType: 'transaction_created' | 'transaction_updated' | 'transaction_completed' | 'transaction_failed',
    data: any
  ): Promise<void> {
    const webhookEvent: WebhookEvent = {
      eventType,
      provider_id: providerId,
      quote_id: quoteId,
      data,
    };

    await this.sendWebhook(webhookEvent);
  }

  // Helper methods
  static async notifyCryptoReceived(
    providerId: string,
    quoteId: string,
    amount: string,
    chain: string,
    hash: string,
    fromAddress: string,
    toAddress: string,
    assetCode: string,
    fee: string,
    currency: string,
    memo?: string,
    contractAddress?: string
  ): Promise<void> {
    const data: CryptoWebhookData = {
      amount,
      chain,
      hash,
      from_address: fromAddress,
      to_address: toAddress,
      asset_code: assetCode,
      fee,
      currency,
      memo,
      ...(contractAddress && { contract_address: contractAddress }),
    };

    await this.sendCryptoWebhook(providerId, quoteId, 'crypto_received', data);
  }

  static async notifyFiatSent(
    providerId: string,
    quoteId: string,
    amount: string,
    amountDelivered: number,
    currency: string,
    referenceId: string,
    accountNumber: string,
    paymentType: string,
    paymentMethod: string,
    network: string,
    country: string,
    receiverName: string,
    fee: string
  ): Promise<void> {
    const data: FiatWebhookData = {
      amount,
      amount_delivered: amountDelivered,
      currency,
      reference_id: referenceId,
      account_number: accountNumber,
      payment_type: paymentType,
      payment_method: paymentMethod,
      network,
      country,
      receiver_name: receiverName,
      fee,
    };

    await this.sendFiatWebhook(providerId, quoteId, 'fiat_sent', 'SUCCESS', data);
  }
} 