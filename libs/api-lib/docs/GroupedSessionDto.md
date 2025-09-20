# GroupedSessionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sessionId** | **string** | Session ID (client-generated identifier) | [default to undefined]
**startTime** | **string** | Session start time | [default to undefined]
**endTime** | **object** | Session end time (null if incomplete) | [optional] [default to undefined]
**boothMode** | **object** | Booth mode from session_start event | [optional] [default to undefined]
**boothIdentifier** | **object** | Booth identifier | [optional] [default to undefined]
**status** | **string** | Session completion status | [default to undefined]
**eventCount** | **number** | Number of events in this session | [default to undefined]
**qrCodeId** | **object** | Associated QR code ID | [optional] [default to undefined]
**eventId** | **object** | Associated event ID | [optional] [default to undefined]
**event** | [**EventInfoDto**](EventInfoDto.md) | Associated event information | [optional] [default to undefined]
**events** | [**Array&lt;BoothLogDto&gt;**](BoothLogDto.md) | All events in this session | [default to undefined]

## Example

```typescript
import { GroupedSessionDto } from './api';

const instance: GroupedSessionDto = {
    sessionId,
    startTime,
    endTime,
    boothMode,
    boothIdentifier,
    status,
    eventCount,
    qrCodeId,
    eventId,
    event,
    events,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
