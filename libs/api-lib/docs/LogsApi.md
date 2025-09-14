# LogsApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**loggingControllerGetEventLogs**](#loggingcontrollergeteventlogs) | **GET** /api/logs/events | Get event logs|
|[**loggingControllerGetLogsSummary**](#loggingcontrollergetlogssummary) | **GET** /api/logs/summary | Get logs summary|
|[**loggingControllerGetWebhookLogs**](#loggingcontrollergetwebhooklogs) | **GET** /api/logs/webhooks | Get webhook logs|

# **loggingControllerGetEventLogs**
> Array<LoggingControllerGetEventLogs200ResponseInner> loggingControllerGetEventLogs()

Retrieve application event logs with optional filtering

### Example

```typescript
import {
    LogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LogsApi(configuration);

let eventType: string; //Filter by event type (optional) (default to undefined)
let source: string; //Filter by event source (optional) (default to undefined)
let status: string; //Filter by event status (optional) (default to undefined)
let qrCodeId: string; //Filter by QR code ID (optional) (default to undefined)
let eventId: string; //Filter by event ID (optional) (default to undefined)
let userId: string; //Filter by user ID (optional) (default to undefined)
let limit: number; //Limit results (default: 50) (optional) (default to undefined)
let offset: number; //Offset for pagination (optional) (default to undefined)

const { status, data } = await apiInstance.loggingControllerGetEventLogs(
    eventType,
    source,
    status,
    qrCodeId,
    eventId,
    userId,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventType** | [**string**] | Filter by event type | (optional) defaults to undefined|
| **source** | [**string**] | Filter by event source | (optional) defaults to undefined|
| **status** | [**string**] | Filter by event status | (optional) defaults to undefined|
| **qrCodeId** | [**string**] | Filter by QR code ID | (optional) defaults to undefined|
| **eventId** | [**string**] | Filter by event ID | (optional) defaults to undefined|
| **userId** | [**string**] | Filter by user ID | (optional) defaults to undefined|
| **limit** | [**number**] | Limit results (default: 50) | (optional) defaults to undefined|
| **offset** | [**number**] | Offset for pagination | (optional) defaults to undefined|


### Return type

**Array<LoggingControllerGetEventLogs200ResponseInner>**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Event logs retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **loggingControllerGetLogsSummary**
> LoggingControllerGetLogsSummary200Response loggingControllerGetLogsSummary()

Get summary statistics of webhook and event logs

### Example

```typescript
import {
    LogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LogsApi(configuration);

const { status, data } = await apiInstance.loggingControllerGetLogsSummary();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**LoggingControllerGetLogsSummary200Response**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Logs summary retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **loggingControllerGetWebhookLogs**
> Array<LoggingControllerGetWebhookLogs200ResponseInner> loggingControllerGetWebhookLogs()

Retrieve PayMongo webhook logs with optional filtering

### Example

```typescript
import {
    LogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LogsApi(configuration);

let eventType: string; //Filter by event type (optional) (default to undefined)
let status: string; //Filter by processing status (optional) (default to undefined)
let qrCodeId: string; //Filter by QR code ID (optional) (default to undefined)
let eventId: string; //Filter by event ID (optional) (default to undefined)
let limit: number; //Limit results (default: 50) (optional) (default to undefined)
let offset: number; //Offset for pagination (optional) (default to undefined)

const { status, data } = await apiInstance.loggingControllerGetWebhookLogs(
    eventType,
    status,
    qrCodeId,
    eventId,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventType** | [**string**] | Filter by event type | (optional) defaults to undefined|
| **status** | [**string**] | Filter by processing status | (optional) defaults to undefined|
| **qrCodeId** | [**string**] | Filter by QR code ID | (optional) defaults to undefined|
| **eventId** | [**string**] | Filter by event ID | (optional) defaults to undefined|
| **limit** | [**number**] | Limit results (default: 50) | (optional) defaults to undefined|
| **offset** | [**number**] | Offset for pagination | (optional) defaults to undefined|


### Return type

**Array<LoggingControllerGetWebhookLogs200ResponseInner>**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Webhook logs retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

