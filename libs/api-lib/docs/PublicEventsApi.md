# PublicEventsApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**publicEventsControllerGetEventForPayment**](#publiceventscontrollergeteventforpayment) | **GET** /api/public/events/{id} | Get event for payment|

# **publicEventsControllerGetEventForPayment**
> PublicEventResponseDto publicEventsControllerGetEventForPayment()

Public endpoint to retrieve event details for QR code payment processing

### Example

```typescript
import {
    PublicEventsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PublicEventsApi(configuration);

let id: string; //Event or QR Code UUID (default to undefined)

const { status, data } = await apiInstance.publicEventsControllerGetEventForPayment(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Event or QR Code UUID | defaults to undefined|


### Return type

**PublicEventResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Event details retrieved successfully |  -  |
|**404** | Event not found or not accessible |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

