# TrendDataDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**value** | **number** | Percentage change from previous period | [default to undefined]
**isPositive** | **boolean** | Whether the trend is positive (increase) or negative (decrease) | [default to undefined]
**previousValue** | **number** | Previous period value for comparison | [default to undefined]
**currentValue** | **number** | Current period value | [default to undefined]

## Example

```typescript
import { TrendDataDto } from './api';

const instance: TrendDataDto = {
    value,
    isPositive,
    previousValue,
    currentValue,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
