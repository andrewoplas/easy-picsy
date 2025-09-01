# Events Management API Documentation

This document provides comprehensive information on how to integrate your desktop application with the Easy Picsy backend events management system.

## Base URL

```
http://localhost:3000/api/events
```

## Authentication Required

All endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Endpoints

### 1. Create Event

**Endpoint:** `POST /events`

**Request Body:**
```json
{
  "name": "Wedding Photography Session",
  "description": "Professional wedding photography package",
  "price": 15000.00,
  "currency": "PHP",
  "isActive": true
}
```

**Validation Requirements:**
- `name`: Required string, 1-255 characters
- `description`: Optional string
- `price`: Required number, minimum 0, max 2 decimal places
- `currency`: Optional string, exactly 3 characters (defaults to "PHP")
- `isActive`: Optional boolean (defaults to true)

**Response (Success - 201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Wedding Photography Session",
  "description": "Professional wedding photography package",
  "price": "15000.00",
  "currency": "PHP",
  "isActive": true,
  "createdBy": "user-uuid-here",
  "createdAt": "2024-09-01T14:30:00Z",
  "updatedAt": "2024-09-01T14:30:00Z",
  "qrCode": {
    "id": "qr-uuid-here",
    "qrCodeData": "paymongo-payment-link-here",
    "paymentLinkId": "pl_xxxxx",
    "isActive": true
  }
}
```

---

### 2. Get All Events

**Endpoint:** `GET /events`

**Response (Success - 200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Wedding Photography Session",
    "description": "Professional wedding photography package",
    "price": "15000.00",
    "currency": "PHP",
    "isActive": true,
    "createdBy": "user-uuid-here",
    "createdAt": "2024-09-01T14:30:00Z",
    "updatedAt": "2024-09-01T14:30:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Portrait Session",
    "description": "Individual portrait photography",
    "price": "5000.00",
    "currency": "PHP",
    "isActive": true,
    "createdBy": "user-uuid-here",
    "createdAt": "2024-09-01T15:00:00Z",
    "updatedAt": "2024-09-01T15:00:00Z"
  }
]
```

---

### 3. Get Single Event

**Endpoint:** `GET /events/:id`

**Response (Success - 200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Wedding Photography Session",
  "description": "Professional wedding photography package",
  "price": "15000.00",
  "currency": "PHP",
  "isActive": true,
  "createdBy": "user-uuid-here",
  "createdAt": "2024-09-01T14:30:00Z",
  "updatedAt": "2024-09-01T14:30:00Z"
}
```

**Response (Error - 404):**
```json
{
  "statusCode": 404,
  "message": "Event with id 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

---

### 4. Update Event (Partial Update)

**Endpoint:** `PATCH /events/:id`

**Request Body (all fields optional):**
```json
{
  "name": "Updated Wedding Photography Session",
  "price": 18000.00,
  "isActive": false
}
```

**Response (Success - 200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Updated Wedding Photography Session",
  "description": "Professional wedding photography package",
  "price": "18000.00",
  "currency": "PHP",
  "isActive": false,
  "createdBy": "user-uuid-here",
  "createdAt": "2024-09-01T14:30:00Z",
  "updatedAt": "2024-09-01T16:30:00Z"
}
```

---

### 5. Replace Event (Full Update)

**Endpoint:** `PUT /events/:id`

**Request Body (same as PATCH - all fields optional):**
```json
{
  "name": "Completely New Event Name",
  "description": "New description",
  "price": 20000.00,
  "currency": "USD",
  "isActive": true
}
```

**Response:** Same as PATCH endpoint

---

### 6. Delete Event

**Endpoint:** `DELETE /events/:id`

**Response (Success - 200):**
```json
{
  "message": "Event deleted successfully"
}
```

---

## QR Code Management Endpoints

### 7. Get Current QR Code

**Endpoint:** `GET /events/:id/qr/current`

**Response (Success - 200):**
```json
{
  "id": "qr-uuid-here",
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "qrCodeData": "https://checkout.paymongo.com/pay/pl_xxxxx",
  "paymentLinkId": "pl_xxxxx",
  "isActive": true,
  "createdAt": "2024-09-01T14:30:00Z",
  "updatedAt": "2024-09-01T14:30:00Z"
}
```

---

### 8. Regenerate QR Code

**Endpoint:** `POST /events/:id/qr/regenerate`

**Response (Success - 201):**
```json
{
  "id": "new-qr-uuid-here",
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "qrCodeData": "https://checkout.paymongo.com/pay/pl_yyyyy",
  "paymentLinkId": "pl_yyyyy",
  "isActive": true,
  "createdAt": "2024-09-01T16:30:00Z",
  "updatedAt": "2024-09-01T16:30:00Z"
}
```

---

### 9. Get QR Code History

**Endpoint:** `GET /events/:id/qr/history`

**Response (Success - 200):**
```json
[
  {
    "id": "new-qr-uuid-here",
    "eventId": "550e8400-e29b-41d4-a716-446655440000",
    "qrCodeData": "https://checkout.paymongo.com/pay/pl_yyyyy",
    "paymentLinkId": "pl_yyyyy",
    "isActive": true,
    "createdAt": "2024-09-01T16:30:00Z",
    "updatedAt": "2024-09-01T16:30:00Z"
  },
  {
    "id": "old-qr-uuid-here",
    "eventId": "550e8400-e29b-41d4-a716-446655440000",
    "qrCodeData": "https://checkout.paymongo.com/pay/pl_xxxxx",
    "paymentLinkId": "pl_xxxxx",
    "isActive": false,
    "createdAt": "2024-09-01T14:30:00Z",
    "updatedAt": "2024-09-01T16:30:00Z"
  }
]
```

---

## Public Endpoints (No Authentication Required)

### 10. Get Event for Payment

**Endpoint:** `GET /public/events/:id`

This endpoint is used by the payment flow when customers scan QR codes.

**Response (Success - 200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Wedding Photography Session",
  "description": "Professional wedding photography package",
  "price": "15000.00",
  "currency": "PHP",
  "isActive": true,
  "createdBy": "user-uuid-here",
  "createdAt": "2024-09-01T14:30:00Z",
  "updatedAt": "2024-09-01T14:30:00Z"
}
```

---

## Events Management Flow for Desktop Apps

### Setting up Events Management

1. **Initialize Events Service**
   ```javascript
   class EventsService {
     constructor(baseURL = 'http://localhost:3000/api', authToken) {
       this.baseURL = baseURL;
       this.authToken = authToken;
     }

     getHeaders() {
       return {
         'Authorization': `Bearer ${this.authToken}`,
         'Content-Type': 'application/json'
       };
     }
   }
   ```

### Basic CRUD Operations

1. **Create Event**
   ```javascript
   async createEvent(eventData) {
     const response = await fetch(`${this.baseURL}/events`, {
       method: 'POST',
       headers: this.getHeaders(),
       body: JSON.stringify({
         name: eventData.name,
         description: eventData.description,
         price: parseFloat(eventData.price),
         currency: eventData.currency || 'PHP',
         isActive: eventData.isActive !== false
       })
     });

     if (!response.ok) {
       throw new Error(`Failed to create event: ${response.statusText}`);
     }

     return await response.json();
   }
   ```

2. **Get All Events**
   ```javascript
   async getAllEvents() {
     const response = await fetch(`${this.baseURL}/events`, {
       headers: this.getHeaders()
     });

     if (!response.ok) {
       throw new Error(`Failed to fetch events: ${response.statusText}`);
     }

     return await response.json();
   }
   ```

3. **Get Single Event**
   ```javascript
   async getEvent(eventId) {
     const response = await fetch(`${this.baseURL}/events/${eventId}`, {
       headers: this.getHeaders()
     });

     if (!response.ok) {
       throw new Error(`Failed to fetch event: ${response.statusText}`);
     }

     return await response.json();
   }
   ```

4. **Update Event**
   ```javascript
   async updateEvent(eventId, updateData) {
     const response = await fetch(`${this.baseURL}/events/${eventId}`, {
       method: 'PATCH',
       headers: this.getHeaders(),
       body: JSON.stringify(updateData)
     });

     if (!response.ok) {
       throw new Error(`Failed to update event: ${response.statusText}`);
     }

     return await response.json();
   }
   ```

5. **Delete Event**
   ```javascript
   async deleteEvent(eventId) {
     const response = await fetch(`${this.baseURL}/events/${eventId}`, {
       method: 'DELETE',
       headers: this.getHeaders()
     });

     if (!response.ok) {
       throw new Error(`Failed to delete event: ${response.statusText}`);
     }

     return await response.json();
   }
   ```

### QR Code Management

1. **Get Current QR Code**
   ```javascript
   async getCurrentQRCode(eventId) {
     const response = await fetch(`${this.baseURL}/events/${eventId}/qr/current`, {
       headers: this.getHeaders()
     });

     if (!response.ok) {
       throw new Error(`Failed to fetch QR code: ${response.statusText}`);
     }

     return await response.json();
   }
   ```

2. **Regenerate QR Code**
   ```javascript
   async regenerateQRCode(eventId) {
     const response = await fetch(`${this.baseURL}/events/${eventId}/qr/regenerate`, {
       method: 'POST',
       headers: this.getHeaders()
     });

     if (!response.ok) {
       throw new Error(`Failed to regenerate QR code: ${response.statusText}`);
     }

     return await response.json();
   }
   ```

3. **Get QR Code History**
   ```javascript
   async getQRCodeHistory(eventId) {
     const response = await fetch(`${this.baseURL}/events/${eventId}/qr/history`, {
       headers: this.getHeaders()
     });

     if (!response.ok) {
       throw new Error(`Failed to fetch QR code history: ${response.statusText}`);
     }

     return await response.json();
   }
   ```

### Complete Example Implementation

```javascript
class EventsManager {
  constructor(authService) {
    this.authService = authService;
    this.baseURL = 'http://localhost:3000/api';
  }

  async createEventWithQR(eventData) {
    try {
      // Create event (automatically generates QR code)
      const event = await this.createEvent(eventData);
      
      console.log('Event created:', event);
      console.log('QR Code generated:', event.qrCode);
      
      return event;
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }

  async manageEventLifecycle(eventId) {
    try {
      // Get event details
      const event = await this.getEvent(eventId);
      
      // Get current QR code
      const qrCode = await this.getCurrentQRCode(eventId);
      
      // If needed, regenerate QR code
      if (qrCode.createdAt < someThreshold) {
        const newQRCode = await this.regenerateQRCode(eventId);
        console.log('QR Code regenerated:', newQRCode);
      }
      
      // Get QR code history for analytics
      const qrHistory = await this.getQRCodeHistory(eventId);
      
      return { event, qrCode, qrHistory };
    } catch (error) {
      console.error('Event management failed:', error);
      throw error;
    }
  }

  async toggleEventStatus(eventId, isActive) {
    return await this.updateEvent(eventId, { isActive });
  }

  async updateEventPricing(eventId, newPrice, currency = 'PHP') {
    return await this.updateEvent(eventId, { 
      price: parseFloat(newPrice),
      currency
    });
  }
}
```

## Error Handling

Common HTTP status codes and their meanings:

- **200**: Success
- **201**: Created (event or QR code successfully created)
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid or missing token)
- **404**: Not Found (event not found or user doesn't own the event)
- **500**: Internal server error

### Example Error Responses

**400 Validation Error:**
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "price must be a number conforming to the specified constraints"
  ],
  "error": "Bad Request"
}
```

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "statusCode": 404,
  "message": "Event with id 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

## Testing the API

You can test the events endpoints using curl:

```bash
# Get auth token first
TOKEN="your-jwt-token-here"

# Create an event
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Event",
    "description": "Test event description",
    "price": 1000.00,
    "currency": "PHP"
  }'

# Get all events
curl -X GET http://localhost:3000/api/events \
  -H "Authorization: Bearer $TOKEN"

# Get specific event
curl -X GET http://localhost:3000/api/events/EVENT_ID \
  -H "Authorization: Bearer $TOKEN"

# Update event
curl -X PATCH http://localhost:3000/api/events/EVENT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Event Name"}'

# Get current QR code
curl -X GET http://localhost:3000/api/events/EVENT_ID/qr/current \
  -H "Authorization: Bearer $TOKEN"

# Regenerate QR code
curl -X POST http://localhost:3000/api/events/EVENT_ID/qr/regenerate \
  -H "Authorization: Bearer $TOKEN"

# Delete event
curl -X DELETE http://localhost:3000/api/events/EVENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

## Important Notes

1. **User Ownership**: Users can only access, modify, or delete events they created
2. **Automatic QR Generation**: QR codes are automatically generated when creating events
3. **Payment Integration**: QR codes contain Paymongo payment links
4. **Currency**: Defaults to PHP but supports other currencies
5. **Active Status**: Events can be activated/deactivated, affecting public visibility
6. **Price Format**: Prices are stored as decimal strings but should be sent as numbers