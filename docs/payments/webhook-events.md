# PayMongo Webhook Events

## Best Practices

1. **Register Once**: Create webhooks during setup, not per resource or in app logic.
2. **Avoid Dynamic Registration**: Don't call create webhook endpoint from code.
3. **Always Respond 2xx**: Return 200-299 status to acknowledge events.
4. **Handle Retries**: PayMongo retries failed deliveries up to 12 times with exponential backoff.
5. **Monitor Health**: Three consecutive failures (36 total retries) disables the webhook.

## Webhook Security

### Signature Verification
PayMongo includes a `Paymongo-Signature` header in every request:
```
t=1496734173,te=1447a89e7ecebeda32sffs62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd,li=
```

Components:
- `t`: Request timestamp
- `te`: Test mode signature
- `li`: Live mode signature

### Verification Steps
1. Parse header into `t`, `te`, `li` components
2. Create signature string: `${timestamp}.${rawJsonPayload}`
3. Generate HMAC-SHA256 using webhook secret
4. Compare with appropriate signature (`te` for test mode, `li` for live)
5. Optional: Verify timestamp is recent (prevent replay attacks)

## Event Types

### 1. Payment Success (`payment.paid`)
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

### 2. Payment Failure (`payment.failed`)
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

### 3. QR Code Expiry (`qrph.expired`)
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

### 4. Payment Refund (`payment.refunded`)
```json
{
  "data": {
    "attributes": {
      "type": "payment.refunded",
      "data": {
        "attributes": {
          "status": "paid",
          "refunds": [{
            "id": "ref_xxx",
            "attributes": {
              "amount": 2000,
              "status": "succeeded",
              "reason": "requested_by_customer"
            }
          }]
        }
      }
    }
  }
}
```

## Implementation Notes

1. **Response Time**: Return 2xx quickly, process asynchronously ✅
2. **Idempotency**: Handle duplicate events (check `id`) ✅
3. **Error Handling**: Log failures for debugging ✅
4. **Monitoring**: Watch for webhook health in PayMongo dashboard ✅
5. **Testing**: Use test mode webhooks with [ngrok](https://ngrok.com/) ✅

## Implementation Status ✅

**All webhook events are fully implemented and tested:**

### Payment Success (`payment.paid`)
- ✅ Creates payment record in database
- ✅ Updates QR code status to `paid`
- ✅ Links payment ID to QR code
- ✅ Sets usage timestamp
- ✅ Broadcasts real-time notification

### Payment Failure (`payment.failed`)
- ✅ Updates QR code status to `failed`
- ✅ Logs failure reason and code
- ✅ Does NOT create payment record (correct behavior)
- ✅ Broadcasts real-time notification

### QR Code Expiry (`qrph.expired`)
- ✅ Updates QR code status to `expired`
- ✅ Sets `is_active` to `false`
- ✅ Does NOT create payment record (correct behavior)
- ✅ Broadcasts real-time notification

### Key Features
- ✅ **Constants Usage**: All magic strings replaced with enums
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Error Handling**: Comprehensive error logging and recovery
- ✅ **Database Consistency**: Proper transaction handling
- ✅ **Real-time Updates**: WebSocket notifications for frontend
- ✅ **Testing**: Complete test suite with curl commands

## Related Files
- [QR Code Flow](qr-code-flow.md) - End-to-end payment flow
- [PayMongo API](paymongo-api.md) - API integration details
- [Database Schema](database-schema.md) - Webhook log structure
