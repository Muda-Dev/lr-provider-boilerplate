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

interface PayInTransaction {
  status: string;
  amount: string;
  chain: string;
  hash: string;
  from_address: string;
  to_address: string;
  asset_code: string;
  fee: string;
}

interface PayoutTransaction {
  status: string;
  amount: string;
  amount_delivered: number;
  currency: string;
  reference_id: string;
  fee: string;
  account: BankPayment | MobileMoneyPayment;
}

interface BankPayment {
  type: 'bank';
  bank_name: string;
  bank_code: string;
  currency: string;
  account_number: string;
  account_name: string;
  swift_code: string;
  bank_country: string;
}

interface MobileMoneyPayment {
  type: 'mobile_money';
  currency: string;
  phone_number: string;
  country_code: string;
  network: string;
  account_name: string;
}

### Account Verification
```typescript
interface VerifyAccountRequest {
  provider_type: string;
  bank_code: string;
  account_number: string;
  currency: string;
}

interface VerifyAccountResponse {
  status: number;
  message: string;
  data: {
    accountName: string;
    bank_code: string;
    isValid: boolean;
  };
}
```

**Endpoint**: `POST /v1/rail/accounts/verifyAccount`

**Request**:
```json
{
  "provider_type": "bank",
  "bank_code": "100",
  "account_number": "10291090",
  "currency": "NGN"
}
```

**Response**:
```json
{
  "status": 200,
  "message": "success",
  "data": {
    "accountName": "JOHN DOE",
    "bank_code": "2345",
    "isValid": true
  }
}
```

## Detailed Specification

For the complete API specification, data models, and implementation details, see the **[MUDA Liquidity Rail Provider Specification 1.0.1](https://payments-doc.muda.tech/liquidity/muda-rl-specification)**.

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