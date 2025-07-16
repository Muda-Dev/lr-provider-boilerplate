import { v4 as uuidv4 } from 'uuid';
import {
  GenerateQuoteRequest,
  ConfirmQuoteRequest,
  RefreshQuoteRequest,
  GetTransactionRequest,
  GetTransactionsRequest,
  QuoteData,
  TransactionData,
  ConfirmQuoteData,
  ApiResponse
} from '../helpers/interfaces';

// Mock data storage (replace with real database in production)
const quotes = new Map<string, QuoteData>();
const transactions = new Map<string, TransactionData>();

export class TransactionModel {
  // Generate a quote for a transaction request
  static generateQuote(request: GenerateQuoteRequest): ApiResponse<QuoteData> {
    try {
      const quoteId = `q${uuidv4().replace(/-/g, '')}`;
      const rate = this.calculateRate(request.currency, request.asset_code);
      const fee = this.calculateFee(request.amount, rate);
      const totalAmount = request.amount * rate + fee;
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

      const quoteData: QuoteData = {
        quote_id: quoteId,
        rate,
        fee,
        total_amount: totalAmount,
        expires_at: expiresAt,
      };

      quotes.set(quoteId, quoteData);

      return {
        status: 200,
        message: 'Quote generated successfully',
        data: quoteData,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error generating quote',
        data: null as any,
      };
    }
  }

  // Confirm a previously generated quote
  static confirmQuote(request: ConfirmQuoteRequest): ApiResponse<ConfirmQuoteData> {
    try {
      const quote = quotes.get(request.quote_id);
      if (!quote) {
        return {
          status: 404,
          message: 'Quote not found',
          data: null as any,
        };
      }

      const transactionId = `tx${uuidv4().replace(/-/g, '')}`;
      const providerAddress = this.generateProviderAddress();
      const providerMemo = this.generateProviderMemo();

      const confirmData: ConfirmQuoteData = {
        transaction_id: transactionId,
        status: 'PENDING',
        provider_address: providerAddress,
        provider_memo: providerMemo,
      };

      // Store transaction
      const transactionData: TransactionData = {
        transaction_id: transactionId,
        quote_id: request.quote_id,
        provider_id: parseInt(request.company_id),
        company_id: parseInt(request.company_id),
        send_asset: 'CUSD',
        send_amount: '10',
        receive_currency: 'UGX',
        receive_amount: 35576,
        ex_rate: '3557.6205',
        account_number: '+256774343545',
        service_id: 1000,
        status: 'PENDING',
        created_on: new Date().toISOString(),
      };

      transactions.set(transactionId, transactionData);

      return {
        status: 200,
        message: 'Quote confirmed successfully',
        data: confirmData,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error confirming quote',
        data: null as any,
      };
    }
  }

  // Refresh an existing quote with updated rates
  static refreshQuote(request: RefreshQuoteRequest): ApiResponse<any> {
    try {
      const quote = quotes.get(request.quote_id);
      if (!quote) {
        return {
          status: 404,
          message: 'Quote not found',
          data: null as any,
        };
      }

      // Calculate new rate (perform your logic here)
      const newRate = quote.rate * (1 + (Math.random() - 0.5) * 0.02); // ±1% variation
      const newFee = this.calculateFee(quote.total_amount / quote.rate, newRate);
      const newTotalAmount = (quote.total_amount / quote.rate) * newRate + newFee;
      const newExpiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      const refreshData = {
        quote_id: request.quote_id,
        new_rate: newRate,
        fee: newFee,
        total_amount: newTotalAmount,
        expires_at: newExpiresAt,
      };

      // Update stored quote
      quotes.set(request.quote_id, {
        ...quote,
        rate: newRate,
        fee: newFee,
        total_amount: newTotalAmount,
        expires_at: newExpiresAt,
      });

      return {
        status: 200,
        message: 'Quote refreshed successfully',
        data: refreshData,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error refreshing quote',
        data: null as any,
      };
    }
  }

  // Get details of a specific transaction
  static getTransaction(request: GetTransactionRequest): ApiResponse<TransactionData> {
    try {
      const transaction = transactions.get(request.transaction_id);
      
      if (!transaction) {
        return {
          status: 404,
          message: 'Transaction not found',
          data: null as any,
        };
      }

      return {
        status: 200,
        message: 'Transaction found',
        data: transaction,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error getting transaction',
        data: null as any,
      };
    }
  }

  // Get all transactions for a provider
  static getTransactions(request: GetTransactionsRequest): ApiResponse<TransactionData[]> {
    try {
      let filteredTransactions = Array.from(transactions.values())
        .filter(t => t.provider_id === request.provider_id);

      if (request.status) {
        filteredTransactions = filteredTransactions.filter(t => t.status === request.status);
      }

      // Apply pagination
      const offset = request.offset || 0;
      const limit = request.limit || 10;
      const paginatedTransactions = filteredTransactions.slice(offset, offset + limit);

      return {
        status: 200,
        message: 'Transactions retrieved successfully',
        data: paginatedTransactions,
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Error getting transactions',
        data: null as any,
      };
    }
  }

  // Helper methods (perform your business logic here)
  private static calculateRate(currency: string, assetCode: string): number {
    // Perform your rate calculation logic here
    const baseRates: Record<string, number> = {
      'USDT': 1.0,
      'USDC': 1.0,
      'CUSD': 1.0,
    };

    const currencyRates: Record<string, number> = {
      'ZAR': 15.5,
      'UGX': 3557.62,
      'NGN': 1500.0,
    };

    return (baseRates[assetCode] || 1.0) * (currencyRates[currency] || 1.0);
  }

  private static calculateFee(amount: number, rate: number): number {
    // Perform your fee calculation logic here
    return amount * rate * 0.005; // 0.5% fee
  }

  private static generateProviderAddress(): string {
    // Perform your address generation logic here
    return `0x${Math.random().toString(16).substring(2, 42)}`;
  }

  private static generateProviderMemo(): string {
    // Perform your memo generation logic here
    return `memo${Math.random().toString(36).substring(2, 8)}`;
  }
} 