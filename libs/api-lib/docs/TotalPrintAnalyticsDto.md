# TotalPrintAnalyticsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**singleSession** | **number** | Total prints from single sessions (not reprints) | [default to undefined]
**reprints** | **number** | Total reprints across all sessions | [default to undefined]
**averagePerEvent** | **number** | Average prints per event | [default to undefined]
**averageReprintsPerEvent** | **number** | Average reprints per event | [default to undefined]

## Example

```typescript
import { TotalPrintAnalyticsDto } from './api';

const instance: TotalPrintAnalyticsDto = {
    singleSession,
    reprints,
    averagePerEvent,
    averageReprintsPerEvent,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
