# QR Ph Payment Feature Overview

## Introduction

QR Ph is the Philippine's QR code standard supervised by BSP (Bangko Sentral ng Pilipinas) for accepting payments from multiple banks and e-wallets using a single QR code. It's available through PayMongo's API, Shopify integration, Links, and Pages.

## QR Code Types

### 1. Online QR Ph (Dynamic)
- Generated per transaction with embedded amount
- Available via:
  - Payment Intent Workflow (API)
  - Checkout API
  - Shopify plugin
  - PayMongo Links/Pages
- One-time use
- 30-minute expiry
- Used in our implementation

### 2. In-store QR Ph (Static)
- Reusable QR code for physical displays
- Customer enters amount after scanning
- Available via:
  - Dashboard In-store module
  - Static QR Ph API endpoint
- Multiple payments accepted
- No expiry
- Not used in our implementation

## Supported Payment Methods

### Banks
- Asia United Bank (AUB)
- BDO Unibank
- BPI
- China Banking Corporation
- Land Bank
- MetroBank
- PNB
- RCBC
- Robinsons Bank
- Security Bank
- Union Bank
- And more...

### E-Wallets & Partners
- GCash
- Maya
- ShopeePay
- GrabPay
- BillEase
- Home Credit
- Salmon
- ShopeePayLater
- And more...

## Key Features

1. **Wide Acceptance**
   - 30+ banks and e-wallets
   - BNPL providers via bank/e-wallet connections
   - InstaPay network integration

2. **Security**
   - Cashless transaction safety
   - QR code tampering prevention
   - Signature verification system

3. **Real-time Updates**
   - SMS notifications
   - Dashboard monitoring
   - Webhook events
   - WebSocket updates

4. **Cost-Effective**
   - 1.5% per transaction
   - No setup fees
   - No monthly fees
   - Custom pricing available

## Integration Points

1. **API Integration**
   - [Payment Intent Workflow](paymongo-api.md)
   - [Webhook Events](webhook-events.md)
   - [Database Schema](database-schema.md)

2. **Real-time Updates**
   - [WebSocket Events](qr-code-flow.md#realtime-socketio)
   - SMS notifications (optional)
   - Dashboard updates

3. **Error Handling**
   - Payment failures
   - QR expiration
   - Webhook retries
   - Reconciliation

## Prerequisites
- PayMongo account (auto-configured for QR Ph)
- API keys and webhook secret
- Webhook endpoint for notifications
- WebSocket server for real-time updates

## Customer Flow
1. Scan QR code with banking/e-wallet app
2. Verify merchant and amount
3. Authorize payment
4. Receive confirmation
5. Merchant receives real-time notification

## Implementation References
- [End-to-end Flow](qr-code-flow.md)
- [PayMongo API](paymongo-api.md)
- [Webhook Events](webhook-events.md)
- [Database Schema](database-schema.md)
