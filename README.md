# Liquidity Rail Provider Boilerplate

A simple Node.js TypeScript boilerplate for implementing Liquidity Rail provider endpoints.

## Features

- ✅ All required provider endpoints
- ✅ Simple authentication
- ✅ Mock responses
- ✅ Webhook integration with MUDA authentication
- ✅ TypeScript support
- ✅ Minimal dependencies

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd liquidity-rail-provider-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Run in development**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Provider Endpoints

This boilerplate implements all required Liquidity Rail provider endpoints:

### Quote Endpoints
- `POST /api/generate-lr-quote` - Generate transaction quotes
- `POST /api/confirm-lr-quote` - Confirm quotes
- `POST /api/refresh-lr-quote` - Refresh quotes with updated rates

### Transaction Endpoints
- `POST /api/get-lr-transaction` - Get specific transaction details
- `POST /api/get-lr-transactions` - Get all transactions with filtering

## Webhook Integration

The boilerplate includes webhook functionality with automatic MUDA authentication. The webhook service will:

1. **Authenticate with MUDA** using your credentials
2. **Get JWT access token** from MUDA's OAuth endpoint
3. **Include Bearer token** in all webhook requests
4. **Auto-refresh tokens** when they expire

### Import the Webhook Service

```typescript
import { WebhookService } from './src/helpers/webhooks';
```

### Send Crypto Webhooks

```typescript
// Notify when crypto is received
await WebhookService.notifyCryptoReceived(
  'your-provider-id',
  'quote-id-123',
  '100.00',
  'BSC',
  '0x1234567890abcdef...',
  '0xfromaddress...',
  '0xtoaddress...',
  'USDC',
  '0.0001',
  'USDC',
  'memo123',
  '0xcontractaddress...'
);

// Or send custom crypto webhook
await WebhookService.sendCryptoWebhook(
  'your-provider-id',
  'quote-id-123',
  'crypto_received',
  {
    amount: '100.00',
    chain: 'BSC',
    hash: '0x1234567890abcdef...',
    from_address: '0xfromaddress...',
    to_address: '0xtoaddress...',
    asset_code: 'USDC',
    fee: '0.0001',
    currency: 'USDC'
  }
);
```

### Send Fiat Webhooks

```typescript
// Notify when fiat is sent
await WebhookService.notifyFiatSent(
  'your-provider-id',
  'quote-id-123',
  '50000.00',
  50000,
  'UGX',
  'REF-987654321',
  '0772123456',
  'mobile_money',
  'MTN Uganda',
  'MTN',
  'UG',
  'John Doe',
  '1000.00'
);

// Or send custom fiat webhook
await WebhookService.sendFiatWebhook(
  'your-provider-id',
  'quote-id-123',
  'fiat_sent',
  'SUCCESS',
  {
    amount: '50000.00',
    amount_delivered: 50000,
    currency: 'UGX',
    reference_id: 'REF-987654321',
    account_number: '0772123456',
    payment_type: 'mobile_money',
    payment_method: 'MTN Uganda',
    network: 'MTN',
    country: 'UG',
    receiver_name: 'John Doe',
    fee: '1000.00'
  }
);
```

### Send Transaction Webhooks

```typescript
// Notify transaction status changes
await WebhookService.sendTransactionWebhook(
  'your-provider-id',
  'quote-id-123',
  'transaction_completed',
  {
    transaction_id: 'tx123456789',
    status: 'COMPLETED',
    completed_at: new Date().toISOString()
  }
);
```

### Webhook Event Types

- **Crypto Events**: `crypto_received`, `crypto_sent`, `crypto_failed`
- **Fiat Events**: `fiat_sent`, `fiat_failed`, `fiat_pending`
- **Transaction Events**: `transaction_created`, `transaction_updated`, `transaction_completed`, `transaction_failed`

## Project Structure

```
src/
├── routes/
│   └── transaction.ts    # All provider endpoints (quotes + transactions)
├── models/
│   └── transaction.ts    # Business logic and mock responses
├── helpers/
│   ├── interfaces.ts     # TypeScript interfaces
│   └── webhooks.ts      # Webhook service with MUDA authentication
└── index.ts             # Application entry point
```

## Customization

### Business Logic

Edit `src/models/transaction.ts` to implement your business logic:

- `calculateRate()` - Implement your rate calculation
- `calculateFee()` - Implement your fee calculation
- `generateProviderAddress()` - Implement address generation
- `generateProviderMemo()` - Implement memo generation

### Database Integration

Replace the mock data storage in `src/models/transaction.ts` with your database:

```typescript
// Replace this:
const quotes = new Map<string, QuoteData>();

// With your database calls:
const quote = await db.quotes.findByPk(quoteId);
```

### Webhook Integration

Add webhook calls to your business logic in `src/models/transaction.ts`:

```typescript
import { WebhookService } from '../helpers/webhooks';

// After confirming a quote
const confirmData = await db.createTransaction(request.quote_id, request);

// Send webhook notification (automatically authenticated)
await WebhookService.sendTransactionWebhook(
  'your-provider-id',
  request.quote_id,
  'transaction_created',
  confirmData
);
```

## Configuration

Copy `env.example` to `.env` and configure:

- `PORT`: Server port (default: 3000)
- `API_KEY`: Your provider API key
- `API_SECRET`: Your provider API secret
- `MUDA_AUTH_URL`: MUDA's OAuth endpoint (default: https://api.muda.tech/v1/clients/oauth/token)
- `MUDA_SECRET_KEY`: Your MUDA secret key
- `MUDA_API_KEY`: Your MUDA API key
- `MUDA_WEBHOOK_URL`: MUDA's webhook endpoint

## Testing

Test the endpoints using curl or Postman:

```bash
# Generate quote
curl -X POST http://localhost:3000/api/generate-lr-quote \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_key" \
  -H "x-api-secret: your_secret" \
  -d '{
    "amount": 10,
    "currency": "ZAR",
    "asset_code": "USDT",
    "service_code": "BANK_TRANSFER"
  }'
```

## Support

For questions about becoming a provider or implementing these endpoints, please contact the MUDA development team. 