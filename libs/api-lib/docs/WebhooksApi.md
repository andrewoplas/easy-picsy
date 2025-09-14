# WebhooksApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**webhooksControllerHandleWebhook**](#webhookscontrollerhandlewebhook) | **POST** /api/webhook | PayMongo webhook endpoint|

# **webhooksControllerHandleWebhook**
> webhooksControllerHandleWebhook()

Handle PayMongo webhook events for payment status updates

### Example

```typescript
import {
    WebhooksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new WebhooksApi(configuration);

let paymongoSignature: string; //PayMongo webhook signature for verification (default to undefined)

const { status, data } = await apiInstance.webhooksControllerHandleWebhook(
    paymongoSignature
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **paymongoSignature** | [**string**] | PayMongo webhook signature for verification | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Webhook processed successfully |  -  |
|**400** | Invalid webhook signature or payload |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

