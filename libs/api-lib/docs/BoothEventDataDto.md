# BoothEventDataDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**event_type** | **string** | Type of booth event | [default to undefined]
**param1** | **string** | First parameter (usage depends on event type) | [optional] [default to undefined]
**param2** | **string** | Second parameter (usage depends on event type) | [optional] [default to undefined]
**param3** | **string** | Third parameter (usage depends on event type) | [optional] [default to undefined]
**param4** | **string** | Fourth parameter (usage depends on event type) | [optional] [default to undefined]
**timestamp** | **string** | Booth event timestamp in HH:MM:SS.mmm format | [default to undefined]

## Example

```typescript
import { BoothEventDataDto } from './api';

const instance: BoothEventDataDto = {
    event_type,
    param1,
    param2,
    param3,
    param4,
    timestamp,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
