## Payment System Database Schema

### Entity Relationship Diagram
```mermaid
erDiagram
    users ||--o{ events : "creates"
    events ||--o{ qr_codes : "generates"
    events ||--o{ payments : "receives"
    qr_codes ||--o{ webhook_logs : "triggers"
    payments }o--|| qr_codes : "initiated by"

    users {
        uuid id PK
        uuid supabase_id UK
        varchar255 email UK
        varchar255 full_name
        text avatar_url
        varchar50 role
        jsonb permissions
        timestamp created_at
        timestamp updated_at
        timestamp last_login_at
        jsonb metadata
    }

    events {
        uuid id PK
        varchar255 name
        text description
        decimal price
        varchar3 currency
        boolean is_active
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }

    qr_codes {
        uuid id PK
        uuid event_id FK
        uuid session_id "Future Module 6"
        text qr_data
        text paymongo_link_id
        text paymongo_link_url
        text paymongo_qrph_id
        varchar20 status "active|expired|used|invalidated|paid|failed"
        timestamp expires_at
        integer usage_count
        integer max_usage
        boolean is_active
        timestamp created_at
        timestamp used_at
        timestamp invalidated_at
    }

    payments {
        uuid id PK
        uuid event_id FK
        uuid qr_code_id FK
        decimal amount
        varchar3 currency
        varchar50 status "pending|completed|failed|refunded"
        text paymongo_payment_id
        text paymongo_link_id
        varchar50 payment_method
        timestamp paid_at
        timestamp created_at
        timestamp updated_at
    }

    webhook_logs {
        uuid id PK
        text event_type "payment.paid|payment.failed|qrph.expired"
        text paymongo_event_id
        text paymongo_signature
        jsonb request_payload
        jsonb request_headers
        text status "received|processing|completed|failed"
        timestamp processed_at
        text error_message
        text error_stack
        uuid qr_code_id FK
        uuid event_id FK
        text payment_intent_id
        boolean signature_verified
        timestamp created_at
        timestamp updated_at
    }
```

### Table Relationships

1. **users → events**
   - One-to-many: A user can create multiple events
   - Foreign key: `events.created_by` → `users.id`

2. **events → qr_codes**
   - One-to-many: An event can have multiple QR codes
   - Foreign key: `qr_codes.event_id` → `events.id`
   - Cascade delete: QR codes are deleted when event is deleted

3. **events → payments**
   - One-to-many: An event can receive multiple payments
   - Foreign key: `payments.event_id` → `events.id`
   - Cascade delete: Payments are deleted when event is deleted

4. **qr_codes → webhook_logs**
   - One-to-many: A QR code can trigger multiple webhook events
   - Foreign key: `webhook_logs.qr_code_id` → `qr_codes.id`
   - Nullable: Webhook might not always reference a QR code

5. **payments → qr_codes**
   - Many-to-one: A payment is initiated by one QR code
   - Foreign key: `payments.qr_code_id` → `qr_codes.id`
   - Required: Every payment must reference a QR code

### Status Flows

1. **QR Code Status**
   ```
   active → paid/failed/expired/invalidated
   ```
   - `active`: Initial state, QR is valid and can be used
   - `paid`: Payment completed successfully
   - `failed`: Payment attempt failed
   - `expired`: Past `expiresAt` timestamp
   - `invalidated`: Manually cancelled or new QR generated
   - `used`: Set by reconciliation (consider standardizing on `paid`)

2. **Payment Status**
   ```
   pending → completed/failed → refunded (optional)
   ```
   - `pending`: Payment initiated but not completed
   - `completed`: Payment successfully processed
   - `failed`: Payment processing failed
   - `refunded`: Payment was refunded (post-completion)

3. **Webhook Log Status**
   ```
   received → processing → completed/failed
   ```
   - `received`: Webhook event received, signature verified
   - `processing`: Event being handled
   - `completed`: Successfully processed
   - `failed`: Processing failed with error