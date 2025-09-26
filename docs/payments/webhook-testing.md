# Webhook Testing Guide

This document provides curl commands to test PayMongo webhook events without relying on actual PayMongo webhook delivery. These commands use the exact payload structures from PayMongo's QR Ph API documentation.

## Prerequisites

- Backend server running on `localhost:3000` (or update the URL in commands)
- Webhook endpoint configured at `/api/webhook` (note the `/api` prefix)
- Optional: Webhook secret configured for signature verification

## Webhook Event Types

### 1. Payment Success (payment.paid)

This webhook is triggered when a QR Ph payment is successfully completed.

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "paymongo-signature: t=1721812322,te=test_signature_abc123,li=live_signature_def456" \
  -d '{
    "data": {
      "id": "evt_123", // <-- replace with unique event ID
      "type": "event",
      "attributes": {
        "type": "payment.paid",
        "livemode": true,
        "data": {
          "id": "code_GCNyg4SqQSNeDBAwHHNLcrhM", // <-- replace with actual QR code ID
          "type": "qrph",
          "attributes": {
            "code_id": "code_GCNyg4SqQSNeDBAwHHNLcrhM", // <-- replace with actual QR code ID
            "livemode": false,
            "organization_id": "org_test_123",
            "created_at": "2024-08-07T15:59:11.179+08:00",
            "source_id": "src_test_123",
            "source_status": "paid",
            "payment_intent_id": "pi_bt8fiwgLDZX1gYBKsKtDHqhS", // <-- replace with actual payment intent ID
            "amount": 2000,
            "currency": "PHP"
          }
        }
      }
    }
  }'
```

### 2. Payment Failed (payment.failed)

This webhook is triggered when a QR Ph payment fails.

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "paymongo-signature: t=1721814834,te=test_signature_xyz789,li=live_signature_ghi012" \
  -d '{
    "data": {
      "id": "evt_456", // <-- replace with unique event ID
      "type": "event",
      "attributes": {
        "type": "payment.failed",
        "livemode": true,
        "data": {
          "id": "code_GCNyg4SqQSNeDBAwHHNLcrhM", // <-- replace with actual QR code ID
          "type": "qrph",
          "attributes": {
            "code_id": "code_GCNyg4SqQSNeDBAwHHNLcrhM", // <-- replace with actual QR code ID
            "livemode": false,
            "organization_id": "org_test_123",
            "created_at": "2024-08-07T15:59:11.179+08:00",
            "source_id": "src_test_123",
            "source_status": "failed",
            "payment_intent_id": "pi_bt8fiwgLDZX1gYBKsKtDHqhS", // <-- replace with actual payment intent ID
            "failed_message": "Unknown processing error.",
            "failed_code": "RJCT",
            "amount": 2000,
            "currency": "PHP"
          }
        }
      }
    }
  }'
```

### 3. QR Ph Expired (qrph.expired)

This webhook is triggered when a QR Ph code expires.

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "paymongo-signature: t=1723019372,te=test_signature_mno345,li=live_signature_pqr678" \
  -d '{
    "data": {
      "id": "evt_789", // <-- replace with unique event ID
      "type": "event",
      "attributes": {
        "type": "qrph.expired",
        "livemode": true,
        "data": {
          "id": "code_GCNyg4SqQSNeDBAwHHNLcrhM", // <-- replace with actual QR code ID
          "type": "qrph",
          "attributes": {
            "code_id": "code_GCNyg4SqQSNeDBAwHHNLcrhM", // <-- replace with actual QR code ID
            "livemode": false,
            "organization_id": "org_test_123",
            "created_at": "2024-08-07T15:59:11.179+08:00",
            "source_id": "src_test_123",
            "source_status": "expired",
            "payment_intent_id": "pi_bt8fiwgLDZX1gYBKsKtDHqhS" // <-- replace with actual payment intent ID
          }
        },
        "previous_data": {},
        "created_at": 1723019372,
        "updated_at": 1723019372
      }
    }
  }'
```

## Testing Without Signature Verification

If you want to test webhook processing without signature verification, you can remove the `paymongo-signature` header:

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "id": "evt_test_no_signature",
      "type": "event",
      "attributes": {
        "type": "payment.paid",
        "livemode": false,
        "data": {
          "id": "code_GCNyg4SqQSNeDBAwHHNLcrhM",
          "type": "qrph",
          "attributes": {
            "code_id": "code_GCNyg4SqQSNeDBAwHHNLcrhM",
            "livemode": false,
            "organization_id": "org_test_123",
            "created_at": "2024-08-07T15:59:11.179+08:00",
            "source_id": "src_test_123",
            "source_status": "paid",
            "payment_intent_id": "pi_bt8fiwgLDZX1gYBKsKtDHqhS",
            "amount": 2000,
            "currency": "PHP"
          }
        }
      }
    }
  }'
```

## Testing with Invalid Signature

To test error handling with invalid signatures:

```bash
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "paymongo-signature: t=1721812322,te=invalid_signature,li=invalid_live_signature" \
  -d '{
    "data": {
      "id": "evt_invalid_signature",
      "type": "event",
      "attributes": {
        "type": "payment.paid",
        "livemode": false,
        "data": {
          "id": "code_GCNyg4SqQSNeDBAwHHNLcrhM",
          "type": "qrph",
          "attributes": {
            "code_id": "code_GCNyg4SqQSNeDBAwHHNLcrhM",
            "livemode": false,
            "organization_id": "org_test_123",
            "created_at": "2024-08-07T15:59:11.179+08:00",
            "source_id": "src_test_123",
            "source_status": "paid",
            "payment_intent_id": "pi_bt8fiwgLDZX1gYBKsKtDHqhS",
            "amount": 2000,
            "currency": "PHP"
          }
        }
      }
    }
  }'
```

## Payload Customization Guide

### Critical Fields to Replace

When testing with your actual data, replace these fields in the payloads:

1. **Event ID** (`data.id`): Unique identifier for the webhook event
2. **QR Code ID** (`data.attributes.data.id` and `data.attributes.data.attributes.code_id`): Your QR code identifier
3. **Payment Intent ID** (`data.attributes.data.attributes.payment_intent_id`): The payment intent from PayMongo
4. **Payment ID** (`data.attributes.data.attributes.payment.id`): The payment transaction ID

### Database Location

To find the actual IDs in your database:

#### QR Code ID
```sql
SELECT id, paymongo_qrph_id FROM qr_codes WHERE event_id = 'your-event-id';
```

#### Payment Intent ID
```sql
SELECT payment_intent_id FROM qr_codes WHERE id = 'your-qr-code-id';
```

#### Payment ID
```sql
SELECT id FROM payments WHERE qr_code_id = 'your-qr-code-id';
```

#### Event ID
```sql
SELECT id FROM events WHERE id = 'your-event-id';
```

### How to Find These IDs

1. **QR Code ID**: Look in the `qr_codes` table, column `id`
2. **PayMongo QR Ph ID**: Look in the `qr_codes` table, column `paymongo_qrph_id`
3. **Payment Intent ID**: Look in the `qr_codes` table, column `payment_intent_id`
4. **Payment ID**: Look in the `payments` table, column `id`
5. **Event ID**: Look in the `events` table, column `id`

## Database Schema Reference

| Webhook Field | Database Table | Database Column | Description |
|---------------|----------------|-----------------|-------------|
| `data.id` | `webhook_logs` | `paymongo_event_id` | Event ID from PayMongo |
| `data.attributes.data.id` | `qr_codes` | `paymongo_qrph_id` | QR Ph code ID from PayMongo |
| `data.attributes.data.attributes.payment_intent_id` | `qr_codes` | `payment_intent_id` | Payment intent ID |
| `data.attributes.data.attributes.payment.id` | `payments` | `id` | Payment transaction ID |

## Expected Responses

### Success Response
```json
{
  "status": "accepted",
  "message": "Webhook received and queued for processing",
  "webhookId": "wh_1234567890_abcdef"
}
```

### Error Response (Invalid Signature)
```json
{
  "status": "error",
  "message": "Invalid webhook signature",
  "code": "INVALID_SIGNATURE"
}
```

### Error Response (Invalid Payload)
```json
{
  "status": "error",
  "message": "Invalid webhook payload",
  "code": "INVALID_PAYLOAD"
}
```

## Testing Checklist

- [x] Backend server is running on `localhost:3000`
- [x] Webhook endpoint is accessible at `/api/webhook`
- [x] Test all three webhook types: `payment.paid`, `payment.failed`, `qrph.expired`
- [x] Verify webhook logs are created in the database
- [x] Check QR code status updates correctly
- [x] Test with and without signature verification
- [x] Test with invalid signatures for error handling

## Implementation Status ✅

**All webhook types have been successfully implemented and tested:**

1. **`payment.paid`** - ✅ Working
   - Creates payment record in `payments` table
   - Updates QR code status to `paid`
   - Links payment ID to QR code
   - Sets `used_at` timestamp

2. **`payment.failed`** - ✅ Working
   - Updates QR code status to `failed`
   - Does NOT create payment record (correct behavior)
   - Logs failure reason

3. **`qrph.expired`** - ✅ Working
   - Updates QR code status to `expired`
   - Sets `is_active` to `false`
   - Does NOT create payment record (correct behavior)

**Key Implementation Details:**
- Uses constants instead of magic strings (`QrCodeStatus`, `PaymentEventType`, etc.)
- Proper error handling and logging
- Database transactions for data consistency
- Real-time notifications via WebSocket

## Troubleshooting

### Common Issues

1. **404 Not Found**: Check that the backend is running and the endpoint URL is correct (`/api/webhook`)
2. **401 Invalid Signature**: Either configure the webhook secret or test without signature verification
3. **500 Internal Server Error**: Check backend logs for detailed error information
4. **Webhook Not Processing**: Verify the payload structure matches PayMongo's QR Ph API format

### Debug Steps

1. Check backend logs for webhook processing details
2. Verify database connections and table structures
3. Test with simplified payloads first
4. Use database queries to verify data updates

## Notes

- These curl commands are based on PayMongo's QR Ph API documentation
- The payload structure is specific to QR Ph payments, not regular payment webhooks
- Always test in a development environment first
- Consider using webhook testing tools like ngrok for more realistic testing scenarios