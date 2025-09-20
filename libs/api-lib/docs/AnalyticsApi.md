# AnalyticsApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**analyticsControllerGetEventAnalytics**](#analyticscontrollergeteventanalytics) | **GET** /api/analytics/events | Get per-event analytics|
|[**analyticsControllerGetSingleEventAnalytics**](#analyticscontrollergetsingleeventanalytics) | **GET** /api/analytics/events/{eventId} | Get analytics for a specific event|
|[**analyticsControllerGetTotalAnalytics**](#analyticscontrollergettotalanalytics) | **GET** /api/analytics/total | Get total analytics|

# **analyticsControllerGetEventAnalytics**
> Array<EventAnalyticsDto> analyticsControllerGetEventAnalytics()

Get analytics data for each event including earnings, session times, and print counts. Use eventId to filter for a specific event.

### Example

```typescript
import {
    AnalyticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalyticsApi(configuration);

let eventId: string; //Event ID to filter analytics for a specific event (optional) (default to undefined)
let startDate: string; //Start date for analytics range (ISO string) (optional) (default to undefined)
let endDate: string; //End date for analytics range (ISO string) (optional) (default to undefined)

const { status, data } = await apiInstance.analyticsControllerGetEventAnalytics(
    eventId,
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] | Event ID to filter analytics for a specific event | (optional) defaults to undefined|
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
|**400** | Invalid date range or event ID provided |  -  |
|**401** | Unauthorized - invalid or missing JWT token |  -  |
|**404** | Event not found (when eventId is provided) |  -  |
|**500** | Internal server error while calculating analytics |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **analyticsControllerGetSingleEventAnalytics**
> EventAnalyticsDto analyticsControllerGetSingleEventAnalytics()

Get detailed analytics data for a specific event including earnings, session times, and print counts

### Example

```typescript
import {
    AnalyticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalyticsApi(configuration);

let eventId: string; // (default to undefined)
let endDate: string; //End date for analytics range (ISO string) (optional) (default to undefined)
let startDate: string; //Start date for analytics range (ISO string) (optional) (default to undefined)

const { status, data } = await apiInstance.analyticsControllerGetSingleEventAnalytics(
    eventId,
    endDate,
    startDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] |  | defaults to undefined|
| **endDate** | [**string**] | End date for analytics range (ISO string) | (optional) defaults to undefined|
| **startDate** | [**string**] | Start date for analytics range (ISO string) | (optional) defaults to undefined|


### Return type

**EventAnalyticsDto**

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
|**404** | Event not found or inactive |  -  |
|**500** | Internal server error while calculating analytics |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **analyticsControllerGetTotalAnalytics**
> TotalAnalyticsDto analyticsControllerGetTotalAnalytics()

Get aggregated analytics across all events or a specific event including revenue, session times, and print statistics

### Example

```typescript
import {
    AnalyticsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AnalyticsApi(configuration);

let eventId: string; //Event ID to filter analytics for a specific event (optional) (default to undefined)
let startDate: string; //Start date for analytics range (ISO string) (optional) (default to undefined)
let endDate: string; //End date for analytics range (ISO string) (optional) (default to undefined)

const { status, data } = await apiInstance.analyticsControllerGetTotalAnalytics(
    eventId,
    startDate,
    endDate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] | Event ID to filter analytics for a specific event | (optional) defaults to undefined|
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
|**400** | Invalid date range or event ID provided |  -  |
|**401** | Unauthorized - invalid or missing JWT token |  -  |
|**404** | Event not found (when eventId is provided) |  -  |
|**500** | Internal server error while calculating analytics |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

