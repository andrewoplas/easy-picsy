# EventResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Event unique identifier | [default to undefined]
**name** | **string** | Event name | [default to undefined]
**description** | **object** | Event description | [optional] [default to undefined]
**price** | **string** | Price per photobooth session | [default to undefined]
**currency** | **string** | Currency code | [default to undefined]
**isActive** | **boolean** | Whether the event is active | [default to undefined]
**createdBy** | **string** | User ID who created the event | [default to undefined]
**createdAt** | **string** | Event creation timestamp | [default to undefined]
**updatedAt** | **string** | Event last update timestamp | [default to undefined]

## Example

```typescript
import { EventResponseDto } from './api';

const instance: EventResponseDto = {
    id,
    name,
    description,
    price,
    currency,
    isActive,
    createdBy,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
