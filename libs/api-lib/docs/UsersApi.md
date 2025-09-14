# UsersApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**usersControllerGetProfile**](#userscontrollergetprofile) | **GET** /api/users/profile | |
|[**usersControllerUpdateProfile**](#userscontrollerupdateprofile) | **PUT** /api/users/profile | |

# **usersControllerGetProfile**
> UserResponseDto usersControllerGetProfile()


### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.usersControllerGetProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **usersControllerUpdateProfile**
> UserResponseDto usersControllerUpdateProfile(updateUserDto)


### Example

```typescript
import {
    UsersApi,
    Configuration,
    UpdateUserDto
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let updateUserDto: UpdateUserDto; //

const { status, data } = await apiInstance.usersControllerUpdateProfile(
    updateUserDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserDto** | **UpdateUserDto**|  | |


### Return type

**UserResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

