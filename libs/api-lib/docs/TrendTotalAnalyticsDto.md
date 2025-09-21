# TrendTotalAnalyticsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalNetRevenue** | **number** | Current period total net revenue | [default to undefined]
**totalWithdrawableRevenue** | **number** | Current period total withdrawable revenue | [default to undefined]
**averageSessionTime** | **number** | Current period average session time in seconds | [default to undefined]
**totalPrints** | [**TrendPrintAnalyticsDto**](TrendPrintAnalyticsDto.md) | Current period print statistics with trends | [default to undefined]
**totalNetRevenueTrend** | [**TrendDataDto**](TrendDataDto.md) | Trend data for total net revenue | [default to undefined]
**averageSessionTimeTrend** | [**TrendDataDto**](TrendDataDto.md) | Trend data for average session time | [default to undefined]

## Example

```typescript
import { TrendTotalAnalyticsDto } from './api';

const instance: TrendTotalAnalyticsDto = {
    totalNetRevenue,
    totalWithdrawableRevenue,
    averageSessionTime,
    totalPrints,
    totalNetRevenueTrend,
    averageSessionTimeTrend,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
