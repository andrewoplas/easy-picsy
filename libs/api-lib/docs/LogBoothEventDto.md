# LogBoothEventDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sessionId** | **string** | Client-generated session identifier (any unique string format) | [default to undefined]
**boothEvent** | [**BoothEventDataDto**](BoothEventDataDto.md) | Booth event data | [default to undefined]
**eventId** | **string** | Event ID (photo booth package/event) | [optional] [default to undefined]
**qrCodeId** | **string** | QR code ID associated with this session | [optional] [default to undefined]
**boothIdentifier** | **string** | Physical booth identifier | [optional] [default to undefined]
**status** | **string** | Event status | [optional] [default to undefined]
**message** | **string** | Custom message for this event | [optional] [default to undefined]
**errorDetails** | **string** | Error details if status is error | [optional] [default to undefined]

## Example

```typescript
import { LogBoothEventDto } from './api';

const instance: LogBoothEventDto = {
    sessionId,
    boothEvent,
    eventId,
    qrCodeId,
    boothIdentifier,
    status,
    message,
    errorDetails,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
