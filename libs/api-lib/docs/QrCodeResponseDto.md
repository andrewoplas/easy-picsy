# QrCodeResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | QR code unique identifier | [default to undefined]
**eventId** | **string** | Event ID associated with this QR code | [default to undefined]
**sessionId** | **string** | Session ID (for future use) | [optional] [default to undefined]
**paymentId** | **string** | Payment ID if payment was made | [optional] [default to undefined]
**qrData** | **string** | QR code data/content (PayMongo checkout URL) | [default to undefined]
**paymentIntentId** | **string** | PayMongo payment intent ID | [default to undefined]
**paymongoLinkUrl** | **string** | PayMongo payment link URL | [optional] [default to undefined]
**paymongoQrphId** | **string** | PayMongo QR Ph resource ID | [optional] [default to undefined]
**status** | **string** | QR code status | [default to undefined]
**expiresAt** | **string** | QR code expiration timestamp | [default to undefined]
**usageCount** | **number** | Number of times QR code was scanned | [default to undefined]
**maxUsage** | **number** | Maximum allowed usage count | [default to undefined]
**isActive** | **boolean** | Whether the QR code is active | [default to undefined]
**createdAt** | **string** | QR code creation timestamp | [default to undefined]
**usedAt** | **string** | QR code usage timestamp | [optional] [default to undefined]
**invalidatedAt** | **string** | QR code invalidation timestamp | [optional] [default to undefined]

## Example

```typescript
import { QrCodeResponseDto } from './api';

const instance: QrCodeResponseDto = {
    id,
    eventId,
    sessionId,
    paymentId,
    qrData,
    paymentIntentId,
    paymongoLinkUrl,
    paymongoQrphId,
    status,
    expiresAt,
    usageCount,
    maxUsage,
    isActive,
    createdAt,
    usedAt,
    invalidatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
