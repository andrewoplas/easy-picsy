# EventsApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**eventsControllerCreate**](#eventscontrollercreate) | **POST** /api/events | Create event|
|[**eventsControllerFindAll**](#eventscontrollerfindall) | **GET** /api/events | Get all events|
|[**eventsControllerFindOne**](#eventscontrollerfindone) | **GET** /api/events/{id} | Get event by ID|
|[**eventsControllerGetCurrentQRCode**](#eventscontrollergetcurrentqrcode) | **GET** /api/events/{id}/qr/current | Get current QR code|
|[**eventsControllerGetQRCodeHistory**](#eventscontrollergetqrcodehistory) | **GET** /api/events/{id}/qr/history | Get QR code history|
|[**eventsControllerRegenerateQRCode**](#eventscontrollerregenerateqrcode) | **POST** /api/events/{id}/qr/regenerate | Regenerate QR code|
|[**eventsControllerRemove**](#eventscontrollerremove) | **DELETE** /api/events/{id} | Delete event|
|[**eventsControllerReplace**](#eventscontrollerreplace) | **PUT** /api/events/{id} | Replace event|
|[**eventsControllerUpdate**](#eventscontrollerupdate) | **PATCH** /api/events/{id} | Partially update event|

# **eventsControllerCreate**
> CreateEventResponseDto eventsControllerCreate(createEventDto)

Create a new photobooth event with pricing information

### Example

```typescript
import {
    EventsApi,
    Configuration,
    CreateEventDto
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let createEventDto: CreateEventDto; //

const { status, data } = await apiInstance.eventsControllerCreate(
    createEventDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createEventDto** | **CreateEventDto**|  | |


### Return type

**CreateEventResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Event created successfully |  -  |
|**400** | Invalid input data |  -  |
|**401** | Invalid or missing token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventsControllerFindAll**
> Array<EventResponseDto> eventsControllerFindAll()

Retrieve all events created by the authenticated user

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

const { status, data } = await apiInstance.eventsControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<EventResponseDto>**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Events retrieved successfully |  -  |
|**401** | Invalid or missing token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventsControllerFindOne**
> EventResponseDto eventsControllerFindOne()

Retrieve a specific event by its UUID

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let id: string; //Event UUID (default to undefined)

const { status, data } = await apiInstance.eventsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Event UUID | defaults to undefined|


### Return type

**EventResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Event retrieved successfully |  -  |
|**401** | Invalid or missing token |  -  |
|**404** | Event not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventsControllerGetCurrentQRCode**
> QrCodeResponseDto eventsControllerGetCurrentQRCode()

Get the currently active QR code for this event

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let id: string; //Event UUID (default to undefined)

const { status, data } = await apiInstance.eventsControllerGetCurrentQRCode(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Event UUID | defaults to undefined|


### Return type

**QrCodeResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Active QR code retrieved successfully |  -  |
|**401** | Invalid or missing token |  -  |
|**404** | Event not found or no active QR code |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventsControllerGetQRCodeHistory**
> Array<QrCodeResponseDto> eventsControllerGetQRCodeHistory()

Get complete QR code generation history for this event

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let id: string; //Event UUID (default to undefined)

const { status, data } = await apiInstance.eventsControllerGetQRCodeHistory(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Event UUID | defaults to undefined|


### Return type

**Array<QrCodeResponseDto>**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | QR code history retrieved successfully |  -  |
|**401** | Invalid or missing token |  -  |
|**404** | Event not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventsControllerRegenerateQRCode**
> QrCodeResponseDto eventsControllerRegenerateQRCode()

Generate new QR code for this event (invalidates current one)

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let id: string; //Event UUID (default to undefined)

const { status, data } = await apiInstance.eventsControllerRegenerateQRCode(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Event UUID | defaults to undefined|


### Return type

**QrCodeResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | New QR code generated successfully |  -  |
|**401** | Invalid or missing token |  -  |
|**404** | Event not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventsControllerRemove**
> EventDeleteResponseDto eventsControllerRemove()

Permanently delete an event and all associated data

### Example

```typescript
import {
    EventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let id: string; //Event UUID (default to undefined)

const { status, data } = await apiInstance.eventsControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Event UUID | defaults to undefined|


### Return type

**EventDeleteResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Event deleted successfully |  -  |
|**401** | Invalid or missing token |  -  |
|**404** | Event not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventsControllerReplace**
> EventResponseDto eventsControllerReplace(updateEventDto)

Completely replace an event with new data

### Example

```typescript
import {
    EventsApi,
    Configuration,
    UpdateEventDto
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let id: string; //Event UUID (default to undefined)
let updateEventDto: UpdateEventDto; //

const { status, data } = await apiInstance.eventsControllerReplace(
    id,
    updateEventDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateEventDto** | **UpdateEventDto**|  | |
| **id** | [**string**] | Event UUID | defaults to undefined|


### Return type

**EventResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Event replaced successfully |  -  |
|**400** | Invalid input data |  -  |
|**401** | Invalid or missing token |  -  |
|**404** | Event not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventsControllerUpdate**
> EventResponseDto eventsControllerUpdate(updateEventDto)

Update specific fields of an event

### Example

```typescript
import {
    EventsApi,
    Configuration,
    UpdateEventDto
} from './api';

const configuration = new Configuration();
const apiInstance = new EventsApi(configuration);

let id: string; //Event UUID (default to undefined)
let updateEventDto: UpdateEventDto; //

const { status, data } = await apiInstance.eventsControllerUpdate(
    id,
    updateEventDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateEventDto** | **UpdateEventDto**|  | |
| **id** | [**string**] | Event UUID | defaults to undefined|


### Return type

**EventResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Event updated successfully |  -  |
|**400** | Invalid input data |  -  |
|**401** | Invalid or missing token |  -  |
|**404** | Event not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

