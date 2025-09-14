# AuthenticationApi

All URIs are relative to *http://localhost:3000*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authControllerGetProfile**](#authcontrollergetprofile) | **GET** /api/auth/profile | Get user profile|
|[**authControllerLogin**](#authcontrollerlogin) | **POST** /api/auth/login | User login|
|[**authControllerLogout**](#authcontrollerlogout) | **POST** /api/auth/logout | User logout|
|[**authControllerRefreshToken**](#authcontrollerrefreshtoken) | **POST** /api/auth/refresh | Refresh access token|
|[**authControllerRegister**](#authcontrollerregister) | **POST** /api/auth/register | User registration|
|[**authControllerVerifyToken**](#authcontrollerverifytoken) | **GET** /api/auth/verify | Verify JWT token|

# **authControllerGetProfile**
> UserResponseDto authControllerGetProfile()

Retrieve current user profile information

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerGetProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User profile retrieved successfully |  -  |
|**401** | Invalid or missing token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLogin**
> AuthResponseDto authControllerLogin(loginDto)

Authenticate user with email and password using Supabase

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    LoginDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let loginDto: LoginDto; //

const { status, data } = await apiInstance.authControllerLogin(
    loginDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginDto** | **LoginDto**|  | |


### Return type

**AuthResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Login successful |  -  |
|**400** | Invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerLogout**
> LogoutResponseDto authControllerLogout()

Logout user and invalidate JWT token

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerLogout();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**LogoutResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Logout successful |  -  |
|**401** | Invalid or missing token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRefreshToken**
> RefreshTokenResponseDto authControllerRefreshToken(refreshTokenRequestDto)

Generate new access token using refresh token

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    RefreshTokenRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let refreshTokenRequestDto: RefreshTokenRequestDto; //

const { status, data } = await apiInstance.authControllerRefreshToken(
    refreshTokenRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refreshTokenRequestDto** | **RefreshTokenRequestDto**|  | |


### Return type

**RefreshTokenResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Token refresh successful |  -  |
|**400** | Invalid refresh token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerRegister**
> AuthResponseDto authControllerRegister(registerDto)

Register new user with email and password using Supabase

### Example

```typescript
import {
    AuthenticationApi,
    Configuration,
    RegisterDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

let registerDto: RegisterDto; //

const { status, data } = await apiInstance.authControllerRegister(
    registerDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerDto** | **RegisterDto**|  | |


### Return type

**AuthResponseDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Registration successful |  -  |
|**400** | Invalid input or email already exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerVerifyToken**
> VerifyTokenResponseDto authControllerVerifyToken()

Validate current JWT token and return user information

### Example

```typescript
import {
    AuthenticationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationApi(configuration);

const { status, data } = await apiInstance.authControllerVerifyToken();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**VerifyTokenResponseDto**

### Authorization

[JWT-auth](../README.md#JWT-auth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Token is valid |  -  |
|**401** | Invalid or missing token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

