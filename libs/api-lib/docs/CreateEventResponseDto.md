# CreateEventResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Event unique identifier | [default to undefined]
**name** | **string** | Event name | [default to undefined]
**description** | **string** | Event description | [optional] [default to undefined]
**price** | **string** | Price per photobooth session | [default to undefined]
**currency** | **string** | Currency code | [default to undefined]
**isActive** | **boolean** | Whether the event is active | [default to undefined]
**createdBy** | **string** | User ID who created the event | [default to undefined]
**createdAt** | **string** | Event creation timestamp | [default to undefined]
**updatedAt** | **string** | Event last update timestamp | [default to undefined]
**lockScreenDesignUrl** | **string** | URL of the lock screen design | [optional] [default to undefined]
**qrCode** | [**CurrentQrCodeResponseDto**](CurrentQrCodeResponseDto.md) | Generated QR code for the event (if successful) | [optional] [default to undefined]

## Example

```typescript
import { CreateEventResponseDto } from './api';

const instance: CreateEventResponseDto = {
    id,
    name,
    description,
    price,
    currency,
    isActive,
    createdBy,
    createdAt,
    updatedAt,
    lockScreenDesignUrl,
    qrCode,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
