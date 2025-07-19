# MUDA Liquidity Rail Provider Boilerplate

A complete Node.js TypeScript implementation of the **MUDA Liquidity Rail Provider Specification 1.0.1**.

## Overview

This boilerplate provides a complete implementation of the MUDA Liquidity Rail Provider API, enabling external service providers to integrate with the MUDA platform for crypto-to-fiat and fiat-to-crypto transactions.

## Specification Compliance

This implementation follows the **MUDA Liquidity Rail Provider Specification 1.0.1** which defines:

- Standardized API endpoints for quote generation and transaction management
- Comprehensive transaction tracking with both crypto and fiat sides
- Webhook integration for real-time status updates
- Authentication and security requirements
- Error handling and response formats

## Quick Start

### Prerequisites

- Node.js 18+ 
- TypeScript 5+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Muda-Dev/lr-provider-boilerplate.git
cd lr-provider-boilerplate

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file with your provider configuration:

```env
# Server Configuration
PORT=8001
NODE_ENV=development

# Provider Configuration
PROVIDER_ID=your-provider-id
PROVIDER_NAME=Your Provider Name
API_KEY=your-api-key
API_SECRET=your-api-secret

# Database Configuration (optional)
DATABASE_URL=your-database-url

# MUDA Platform Configuration
MUDA_WEBHOOK_URL=https://api.muda.tech/v1/rail/accounts/events
```

## API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/generate-lr-quote` | Generate transaction quotes |
| `POST` | `/confirm-lr-quote` | Confirm quotes |
| `POST` | `/refresh-lr-quote` | Refresh quotes with updated rates |
| `POST` | `/get-lr-transaction` | Get transaction details |
| `POST` | `/get-lr-transactions` | Get all transactions |
| `POST` | `/auto-transaction-status` | Auto update transaction status |

### Authentication

All endpoints require API key authentication:

```http
X-API-Key: your-provider-api-key
X-API-Secret: your-provider-api-secret
```

## Implementation Features

### ✅ Complete API Implementation
- All required endpoints from the specification
- Proper request/response handling
- TypeScript interfaces for type safety

### ✅ Transaction Management
- Comprehensive transaction tracking
- Both crypto and fiat transaction sides
- Status updates and history

### ✅ Webhook Integration
- Send status updates to MUDA platform
- Handle crypto received events
- Handle fiat sent events

### ✅ Security & Validation
- API key authentication
- Input validation
- Error handling
- Rate limiting (configurable)

### ✅ Development Tools
- TypeScript for type safety
- ESLint for code quality
- Hot reload for development
- Comprehensive logging

## Project Structure

```
src/
├── helpers/
│   └── interfaces.ts          # TypeScript interfaces
├── models/
│   └── transaction.ts         # Transaction business logic
├── routes/
│   └── transaction.ts         # API route handlers
├── utils/
│   └── helpers.ts            # Utility functions
└── index.ts                  # Application entry point
```

## Data Models

### Quote Generation
```typescript
interface GenerateQuoteRequest {
  asset_code: string;
  amount: number;
  currency: string;
  service_id: string;
}
```

### Transaction Data
```typescript
interface TransactionData {
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
```

## Customization Guide

### 1. Business Logic Implementation

Update the `TransactionModel` class in `src/models/transaction.ts`:

```typescript
// Implement your rate calculation logic
private static calculateRate(currency: string, assetCode: string): number {
  // Add your rate calculation logic here
  return yourRateCalculation(currency, assetCode);
}

// Implement your fee calculation logic
private static calculateFee(amount: number, rate: number): number {
  // Add your fee calculation logic here
  return yourFeeCalculation(amount, rate);
}
```

### 2. Database Integration

Replace the mock data storage with your database:

```typescript
// Replace Map storage with database calls
const quotes = new Map<string, QuoteData>(); // Replace with database
const transactions = new Map<string, TransactionData>(); // Replace with database
```

### 3. Authentication

Implement your authentication logic in `src/routes/transaction.ts`:

```typescript
const authenticate = (req: Request, res: Response, next: Function): void => {
  const apiKey = req.headers['x-api-key'] as string;
  const apiSecret = req.headers['x-api-secret'] as string;

  // Add your authentication logic here
  if (!isValidApiKey(apiKey, apiSecret)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
};
```

### 4. Webhook Integration

Implement webhook sending in your business logic:

```typescript
// Send webhook to MUDA platform
await sendWebhook({
  eventType: 'crypto_received',
  provider_id: 'your-provider-id',
  quote_id: quoteId,
  data: cryptoData
});
```

## Testing

### Local Development
```bash
# Start development server
npm run dev

# Test endpoints
curl -X POST http://localhost:8001/generate-lr-quote \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -H "X-API-Secret: your-api-secret" \
  -d '{
    "asset_code": "USDC_BSC",
    "amount": 3,
    "currency": "UGX",
    "service_id": "1000"
  }'
```

### Integration Testing
Use MUDA's sandbox environment to test your implementation before going live.

## Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure your database
3. Set up proper logging
4. Configure rate limiting
5. Set up monitoring

### Docker Deployment
```bash
# Build image
docker build -t muda-lr-provider .

# Run container
docker run -p 8001:8001 muda-lr-provider
```

## Security Considerations

- Use HTTPS in production
- Implement proper rate limiting
- Validate all input data
- Log security events
- Use environment variables for secrets
- Implement proper error handling

## Support

For questions about:
- **Specification**: Refer to the MUDA Liquidity Rail Provider Specification 1.0.1
- **Implementation**: Check the code comments and TypeScript interfaces
- **Integration**: Contact the MUDA development team

## License

This boilerplate is provided under the MIT License. See LICENSE file for details.

---

**Version**: 1.0.1  
**Specification**: MUDA Liquidity Rail Provider Specification 1.0.1  
**Last Updated**: March 2025 