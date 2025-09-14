# QRCodesApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**qrCodesControllerGetCurrentQRCode**](#qrcodescontrollergetcurrentqrcode) | **GET** /api/qr-codes/event/{eventId}/current | Get current active QR code|
|[**qrCodesControllerGetPaymentLink**](#qrcodescontrollergetpaymentlink) | **GET** /api/qr-codes/{qrCodeId}/payment-link | Get payment link URL for testing|
|[**qrCodesControllerGetQRCodeHistory**](#qrcodescontrollergetqrcodehistory) | **GET** /api/qr-codes/event/{eventId}/history | Get QR code history|
|[**qrCodesControllerGetQRCodeImage**](#qrcodescontrollergetqrcodeimage) | **GET** /api/qr-codes/{qrCodeId}/image | Get QR code image|
|[**qrCodesControllerGetQRCodeStatus**](#qrcodescontrollergetqrcodestatus) | **GET** /api/qr-codes/{qrCodeId}/status | Get QR code status|
|[**qrCodesControllerRegenerateQRCode**](#qrcodescontrollerregenerateqrcode) | **POST** /api/qr-codes/event/{eventId}/regenerate | Regenerate QR code|

# **qrCodesControllerGetCurrentQRCode**
> QrCodesControllerGetCurrentQRCode200Response qrCodesControllerGetCurrentQRCode()

Retrieve the currently active QR code for a specific event (if any)

### Example

```typescript
import {
    QRCodesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QRCodesApi(configuration);

let eventId: string; //Event UUID (default to undefined)

const { status, data } = await apiInstance.qrCodesControllerGetCurrentQRCode(
    eventId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] | Event UUID | defaults to undefined|


### Return type

**QrCodesControllerGetCurrentQRCode200Response**

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

# **qrCodesControllerGetPaymentLink**
> QrCodesControllerGetPaymentLink200Response qrCodesControllerGetPaymentLink()

Get the PayMongo checkout URL for web-based payment testing

### Example

```typescript
import {
    QRCodesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QRCodesApi(configuration);

let qrCodeId: string; //QR Code UUID (default to undefined)

const { status, data } = await apiInstance.qrCodesControllerGetPaymentLink(
    qrCodeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **qrCodeId** | [**string**] | QR Code UUID | defaults to undefined|


### Return type

**QrCodesControllerGetPaymentLink200Response**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Payment link URL retrieved successfully |  -  |
|**404** | QR code not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qrCodesControllerGetQRCodeHistory**
> Array<QrCodesControllerGetQRCodeHistory200ResponseInner> qrCodesControllerGetQRCodeHistory()

Retrieve complete QR code generation history for a specific event

### Example

```typescript
import {
    QRCodesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QRCodesApi(configuration);

let eventId: string; //Event UUID (default to undefined)

const { status, data } = await apiInstance.qrCodesControllerGetQRCodeHistory(
    eventId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] | Event UUID | defaults to undefined|


### Return type

**Array<QrCodesControllerGetQRCodeHistory200ResponseInner>**

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

# **qrCodesControllerGetQRCodeImage**
> File qrCodesControllerGetQRCodeImage()

Retrieve the QR code image as PNG. Returns base64-encoded QR code image for display in frontend.

### Example

```typescript
import {
    QRCodesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QRCodesApi(configuration);

let qrCodeId: string; //QR Code UUID (default to undefined)

const { status, data } = await apiInstance.qrCodesControllerGetQRCodeImage(
    qrCodeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **qrCodeId** | [**string**] | QR Code UUID | defaults to undefined|


### Return type

**File**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: image/png, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | QR code image retrieved successfully |  -  |
|**404** | QR code not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qrCodesControllerGetQRCodeStatus**
> QrCodesControllerGetQRCodeStatus200Response qrCodesControllerGetQRCodeStatus()

Check the current status of a specific QR code by its ID

### Example

```typescript
import {
    QRCodesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QRCodesApi(configuration);

let qrCodeId: string; //QR Code UUID (default to undefined)

const { status, data } = await apiInstance.qrCodesControllerGetQRCodeStatus(
    qrCodeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **qrCodeId** | [**string**] | QR Code UUID | defaults to undefined|


### Return type

**QrCodesControllerGetQRCodeStatus200Response**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | QR code status retrieved successfully |  -  |
|**404** | QR code not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **qrCodesControllerRegenerateQRCode**
> QrCodesControllerRegenerateQRCode201Response qrCodesControllerRegenerateQRCode()

Generate new QR code for an event (manual regeneration). Invalidates current QR code if active.

### Example

```typescript
import {
    QRCodesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new QRCodesApi(configuration);

let eventId: string; //Event UUID (default to undefined)

const { status, data } = await apiInstance.qrCodesControllerRegenerateQRCode(
    eventId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **eventId** | [**string**] | Event UUID | defaults to undefined|


### Return type

**QrCodesControllerRegenerateQRCode201Response**

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

