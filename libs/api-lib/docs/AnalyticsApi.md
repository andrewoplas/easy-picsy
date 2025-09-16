# AnalyticsApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**analyticsControllerGetEventAnalytics**](#analyticscontrollergeteventanalytics) | **GET** /api/analytics/events | Get per-event analytics|
|[**analyticsControllerGetTotalAnalytics**](#analyticscontrollergettotalanalytics) | **GET** /api/analytics/total | Get total analytics|

# **analyticsControllerGetEventAnalytics**
> Array<EventAnalyticsDto> analyticsControllerGetEventAnalytics()

Get analytics data for each event including earnings, session times, and print counts

### Example

```typescript
import {
    AnalyticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalyticsApi(configuration);

let startDate: string; //Start date for analytics range (ISO string) (optional) (default to undefined)
let endDate: string; //End date for analytics range (ISO string) (optional) (default to undefined)

const { status, data } = await apiInstance.analyticsControllerGetEventAnalytics(
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **startDate** | [**string**] | Start date for analytics range (ISO string) | (optional) defaults to undefined|
| **endDate** | [**string**] | End date for analytics range (ISO string) | (optional) defaults to undefined|


### Return type

**Array<EventAnalyticsDto>**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Event analytics retrieved successfully |  -  |
|**400** | Invalid date range provided |  -  |
|**401** | Unauthorized - invalid or missing JWT token |  -  |
|**500** | Internal server error while calculating analytics |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **analyticsControllerGetTotalAnalytics**
> TotalAnalyticsDto analyticsControllerGetTotalAnalytics()

Get aggregated analytics across all events including revenue, session times, and print statistics

### Example

```typescript
import {
    AnalyticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalyticsApi(configuration);

let startDate: string; //Start date for analytics range (ISO string) (optional) (default to undefined)
let endDate: string; //End date for analytics range (ISO string) (optional) (default to undefined)

const { status, data } = await apiInstance.analyticsControllerGetTotalAnalytics(
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **startDate** | [**string**] | Start date for analytics range (ISO string) | (optional) defaults to undefined|
| **endDate** | [**string**] | End date for analytics range (ISO string) | (optional) defaults to undefined|


### Return type

**TotalAnalyticsDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Total analytics retrieved successfully |  -  |
|**400** | Invalid date range provided |  -  |
|**401** | Unauthorized - invalid or missing JWT token |  -  |
|**500** | Internal server error while calculating analytics |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

