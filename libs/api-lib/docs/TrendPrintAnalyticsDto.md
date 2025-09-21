# TrendPrintAnalyticsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**singleSession** | **number** | Current period prints from single sessions | [default to undefined]
**reprints** | **number** | Current period reprints | [default to undefined]
**averagePerEvent** | **number** | Current period average prints per event | [default to undefined]
**averageReprintsPerEvent** | **number** | Current period average reprints per event | [default to undefined]
**singleSessionTrend** | [**TrendDataDto**](TrendDataDto.md) | Trend data for single session prints | [default to undefined]
**reprintsTrend** | [**TrendDataDto**](TrendDataDto.md) | Trend data for reprints | [default to undefined]
**averagePerEventTrend** | [**TrendDataDto**](TrendDataDto.md) | Trend data for average prints per event | [default to undefined]
**averageReprintsPerEventTrend** | [**TrendDataDto**](TrendDataDto.md) | Trend data for average reprints per event | [default to undefined]

## Example

```typescript
import { TrendPrintAnalyticsDto } from './api';

const instance: TrendPrintAnalyticsDto = {
    singleSession,
    reprints,
    averagePerEvent,
    averageReprintsPerEvent,
    singleSessionTrend,
    reprintsTrend,
    averagePerEventTrend,
    averageReprintsPerEventTrend,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
