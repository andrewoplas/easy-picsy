# BoothLogsApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**boothLoggingControllerGetBoothEvents**](#boothloggingcontrollergetboothevents) | **GET** /api/logs/booth/events | Get booth event logs|
|[**boothLoggingControllerGetBoothSessions**](#boothloggingcontrollergetboothsessions) | **GET** /api/logs/booth/sessions | Get paginated booth sessions|
|[**boothLoggingControllerGetBoothStats**](#boothloggingcontrollergetboothstats) | **GET** /api/logs/booth/stats | Get booth event statistics|
|[**boothLoggingControllerGetSessionEvents**](#boothloggingcontrollergetsessionevents) | **GET** /api/logs/booth/session/{sessionId}/events | Get all events for a specific session|
|[**boothLoggingControllerLogBoothEvent**](#boothloggingcontrollerlogboothevent) | **POST** /api/logs/booth/event | Log DSLR booth event|

# **boothLoggingControllerGetBoothEvents**
> Array<BoothLogDto> boothLoggingControllerGetBoothEvents()

Retrieve booth event logs with optional filtering. Admin access required.

### Example

```typescript
import {
    BoothLogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoothLogsApi(configuration);

let boothEventType: string; //Filter by booth event type (optional) (default to undefined)
let sessionId: string; //Filter by session ID (optional) (default to undefined)
let eventId: string; //Filter by event ID (optional) (default to undefined)
let qrCodeId: string; //Filter by QR code ID (optional) (default to undefined)
let boothIdentifier: string; //Filter by booth identifier (optional) (default to undefined)
let status: string; //Filter by status (optional) (default to undefined)
let limit: number; //Limit results (default: 50) (optional) (default to undefined)
let offset: number; //Offset for pagination (optional) (default to undefined)

const { status, data } = await apiInstance.boothLoggingControllerGetBoothEvents(
    boothEventType,
    sessionId,
    eventId,
    qrCodeId,
    boothIdentifier,
    status,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **boothEventType** | [**string**] | Filter by booth event type | (optional) defaults to undefined|
| **sessionId** | [**string**] | Filter by session ID | (optional) defaults to undefined|
| **eventId** | [**string**] | Filter by event ID | (optional) defaults to undefined|
| **qrCodeId** | [**string**] | Filter by QR code ID | (optional) defaults to undefined|
| **boothIdentifier** | [**string**] | Filter by booth identifier | (optional) defaults to undefined|
| **status** | [**string**] | Filter by status | (optional) defaults to undefined|
| **limit** | [**number**] | Limit results (default: 50) | (optional) defaults to undefined|
| **offset** | [**number**] | Offset for pagination | (optional) defaults to undefined|


### Return type

**Array<BoothLogDto>**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Booth events retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **boothLoggingControllerGetBoothSessions**
> BoothSessionsResponseDto boothLoggingControllerGetBoothSessions()

Retrieve booth sessions with pagination. Admin access required.

### Example

```typescript
import {
    BoothLogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoothLogsApi(configuration);

let eventId: string; //Filter by event ID (optional) (default to undefined)
let boothIdentifier: string; //Filter by booth identifier (optional) (default to undefined)
let page: number; //Page number (default: 1) (optional) (default to undefined)
let pageSize: number; //Items per page (default: 10) (optional) (default to undefined)

const { status, data } = await apiInstance.boothLoggingControllerGetBoothSessions(
    eventId,
    boothIdentifier,
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] | Filter by event ID | (optional) defaults to undefined|
| **boothIdentifier** | [**string**] | Filter by booth identifier | (optional) defaults to undefined|
| **page** | [**number**] | Page number (default: 1) | (optional) defaults to undefined|
| **pageSize** | [**number**] | Items per page (default: 10) | (optional) defaults to undefined|


### Return type

**BoothSessionsResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Sessions retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **boothLoggingControllerGetBoothStats**
> Array<BoothEventStatsDto> boothLoggingControllerGetBoothStats()

Get statistical overview of booth events. Admin access required.

### Example

```typescript
import {
    BoothLogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoothLogsApi(configuration);

let eventId: string; //Filter stats by event ID (optional) (default to undefined)
let boothIdentifier: string; //Filter stats by booth identifier (optional) (default to undefined)
let sessionId: string; //Filter stats by session ID (optional) (default to undefined)

const { status, data } = await apiInstance.boothLoggingControllerGetBoothStats(
    eventId,
    boothIdentifier,
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] | Filter stats by event ID | (optional) defaults to undefined|
| **boothIdentifier** | [**string**] | Filter stats by booth identifier | (optional) defaults to undefined|
| **sessionId** | [**string**] | Filter stats by session ID | (optional) defaults to undefined|


### Return type

**Array<BoothEventStatsDto>**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Booth statistics retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **boothLoggingControllerGetSessionEvents**
> Array<BoothLogDto> boothLoggingControllerGetSessionEvents()

Retrieve all booth events for a specific session in chronological order. Admin access required.

### Example

```typescript
import {
    BoothLogsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoothLogsApi(configuration);

let sessionId: string; //Session ID (default to undefined)

const { status, data } = await apiInstance.boothLoggingControllerGetSessionEvents(
    sessionId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sessionId** | [**string**] | Session ID | defaults to undefined|


### Return type

**Array<BoothLogDto>**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Session events retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **boothLoggingControllerLogBoothEvent**
> LogBoothEventResponseDto boothLoggingControllerLogBoothEvent(logBoothEventDto)

Log a single DSLR booth event with structured data. Public endpoint for booth integration.

### Example

```typescript
import {
    BoothLogsApi,
    Configuration,
    LogBoothEventDto
} from './api';

const configuration = new Configuration();
const apiInstance = new BoothLogsApi(configuration);

let logBoothEventDto: LogBoothEventDto; //Booth event data to log

const { status, data } = await apiInstance.boothLoggingControllerLogBoothEvent(
    logBoothEventDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **logBoothEventDto** | **LogBoothEventDto**| Booth event data to log | |


### Return type

**LogBoothEventResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Booth event logged successfully |  -  |
|**400** | Bad request - invalid event data |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

