# BoothLogDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Log entry ID | [default to undefined]
**sessionId** | **string** | Session ID (client-generated identifier) | [default to undefined]
**boothEventType** | **string** | Booth event type | [default to undefined]
**timestamp** | **string** | Original booth timestamp | [default to undefined]
**param1** | **object** | Event parameter 1 | [optional] [default to undefined]
**param2** | **object** | Event parameter 2 | [optional] [default to undefined]
**param3** | **object** | Event parameter 3 | [optional] [default to undefined]
**param4** | **object** | Event parameter 4 | [optional] [default to undefined]
**eventId** | **string** | Associated event ID | [optional] [default to undefined]
**qrCodeId** | **string** | Associated QR code ID | [optional] [default to undefined]
**boothIdentifier** | **string** | Booth identifier | [optional] [default to undefined]
**status** | **string** | Event status | [default to undefined]
**message** | **string** | Human-readable message | [optional] [default to undefined]
**errorDetails** | **string** | Error details if applicable | [optional] [default to undefined]
**createdAt** | **string** | When this log was created | [default to undefined]
**event** | [**EventInfoDto**](EventInfoDto.md) | Associated event information | [optional] [default to undefined]

## Example

```typescript
import { BoothLogDto } from './api';

const instance: BoothLogDto = {
    id,
    sessionId,
    boothEventType,
    timestamp,
    param1,
    param2,
    param3,
    param4,
    eventId,
    qrCodeId,
    boothIdentifier,
    status,
    message,
    errorDetails,
    createdAt,
    event,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
