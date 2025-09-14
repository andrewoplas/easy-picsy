# PayMongo QR Ph Integration

## Overview

QR Ph is the Philippine's QR code standard supervised by the BSP for accepting payments from multiple banks and e-wallets using a single QR code.

> ⚠️ **Testing Note**: When using test API keys, only test QR code generation. Do not attempt payments as QR Ph codes are live even in test mode.

## Prerequisites

- PayMongo account (new accounts are automatically QR Ph enabled)
- `PAYMONGO_SECRET_KEY` and `PAYMONGO_WEBHOOK_SECRET`
- Webhook endpoint registered for `payment.paid`, `payment.failed`, and `qrph.expired` events

## Implementation Flow

### 1. Create Payment Intent with QR Ph
```json
{
  "data": {
    "attributes": {
      "amount": 10000,
      "payment_method_allowed": ["qrph"],
      "currency": "PHP",
      "description": "Payment for Event Name"
    }
  }
}
```

### 2. Create QR Ph Payment Method
```json
{
  "data": {
    "attributes": {
      "type": "qrph",
      "billing": {
        "name": "Customer Name",
        "email": "customer@email.com",
        "phone": "+639171234567",
        "address": {
          "country": "PH"
        }
      }
    }
  }
}
```

### 3. Attach Payment Method
- Attach to payment intent to get QR code image
- Response includes `next_action.code.image_url` (base64 PNG)
- QR codes expire in 30 minutes
- One-time use only

### 4. Handle Webhook Events

#### Payment Success (`payment.paid`)
```json
{
  "data": {
    "attributes": {
      "type": "payment.paid",
      "data": {
        "attributes": {
          "status": "paid",
          "amount": 10000,
          "source": {
            "id": "qrph_xxx",
            "type": "qrph"
          },
          "payment_intent_id": "pi_xxx"
        }
      }
    }
  }
}
```

#### Payment Failure (`payment.failed`)
```json
{
  "data": {
    "attributes": {
      "type": "payment.failed",
      "data": {
        "attributes": {
          "status": "failed",
          "failed_code": "RJCT",
          "failed_message": "Error details",
          "payment_intent_id": "pi_xxx"
        }
      }
    }
  }
}
```

#### QR Expiry (`qrph.expired`)
```json
{
  "data": {
    "attributes": {
      "type": "qrph.expired",
      "data": {
        "attributes": {
          "code_id": "code_xxx",
          "source_status": "expired",
          "payment_intent_id": "pi_xxx"
        }
      }
    }
  }
}
```

## Error Handling

1. **QR Code Expiry (30 min)**
   - Webhook: `qrph.expired`
   - Payment Intent status: `awaiting_payment_method`
   - Action: Generate new QR code if needed

2. **Payment Failure**
   - Webhook: `payment.failed`
   - Payment Intent status: `awaiting_payment_method`
   - Action: Check `failed_code` and `failed_message`

3. **Missing Webhook**
   - After 30 min: Check payment intent status via API
   - Use reconciliation cron job (see [qr-code-flow.md](qr-code-flow.md))

## Static QR Codes (In-Store)

For point-of-sale displays where customer enters amount after scanning:

```json
POST /codes
{
  "data": {
    "attributes": {
      "kind": "instore",
      "mobile_number": "+639191234567"  // Optional: for SMS notifications
    }
  }
}
```

Response includes:
- `id`: Unique QR code identifier
- `qr_image`: Base64 PNG image
- `name`: Store name shown in banking apps

## API Reference Links
- [Create Payment Intent](https://developers.paymongo.com/reference/create-a-paymentintent)
- [Create Payment Method](https://developers.paymongo.com/reference/create-a-paymentmethod)
- [Attach to Payment Intent](https://developers.paymongo.com/reference/attach-to-paymentintent)
- [Create Static QR](https://developers.paymongo.com/reference/create-a-static-qr-ph-code)
