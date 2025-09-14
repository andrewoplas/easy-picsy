# UpdateEventDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Event name | [optional] [default to undefined]
**description** | **string** | Event description | [optional] [default to undefined]
**price** | **number** | Price per photobooth session | [optional] [default to undefined]
**currency** | **string** | Currency code | [optional] [default to 'PHP']
**isActive** | **boolean** | Whether the event is active | [optional] [default to true]

## Example

```typescript
import { UpdateEventDto } from './api';

const instance: UpdateEventDto = {
    name,
    description,
    price,
    currency,
    isActive,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
