# EventAnalyticsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**eventId** | **string** | Event ID | [default to undefined]
**eventName** | **string** | Event name | [default to undefined]
**runningEarnings** | **number** | Running earnings for this event | [default to undefined]
**sessionAverageTime** | **number** | Session average time for this event in seconds | [default to undefined]
**numberOfPrints** | **number** | Number of prints for this event | [default to undefined]
**numberOfReprints** | **number** | Number of reprints for this event | [default to undefined]

## Example

```typescript
import { EventAnalyticsDto } from './api';

const instance: EventAnalyticsDto = {
    eventId,
    eventName,
    runningEarnings,
    sessionAverageTime,
    numberOfPrints,
    numberOfReprints,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
