# TotalAnalyticsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalNetRevenue** | **number** | Total net revenue from all completed payments | [default to undefined]
**totalWithdrawableRevenue** | **number** | Total withdrawable/cashout-able revenue | [default to undefined]
**averageSessionTime** | **number** | Average session time in seconds | [default to undefined]
**totalPrints** | [**TotalPrintAnalyticsDto**](TotalPrintAnalyticsDto.md) | Print statistics breakdown | [default to undefined]

## Example

```typescript
import { TotalAnalyticsDto } from './api';

const instance: TotalAnalyticsDto = {
    totalNetRevenue,
    totalWithdrawableRevenue,
    averageSessionTime,
    totalPrints,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
