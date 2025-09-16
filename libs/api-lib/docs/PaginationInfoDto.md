# PaginationInfoDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**currentPage** | **number** | Current page number | [default to undefined]
**pageSize** | **number** | Number of items per page | [default to undefined]
**totalSessions** | **number** | Total number of sessions | [default to undefined]
**totalPages** | **number** | Total number of pages | [default to undefined]
**hasNext** | **boolean** | Whether there is a next page | [default to undefined]
**hasPrevious** | **boolean** | Whether there is a previous page | [default to undefined]

## Example

```typescript
import { PaginationInfoDto } from './api';

const instance: PaginationInfoDto = {
    currentPage,
    pageSize,
    totalSessions,
    totalPages,
    hasNext,
    hasPrevious,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
