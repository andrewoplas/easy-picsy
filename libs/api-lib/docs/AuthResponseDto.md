# AuthResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**access_token** | **string** | JWT access token | [default to undefined]
**refresh_token** | **string** | JWT refresh token | [default to undefined]
**expires_in** | **number** | Token expiration time in seconds | [default to undefined]
**user** | [**AuthUserBasicDto**](AuthUserBasicDto.md) | User information | [default to undefined]

## Example

```typescript
import { AuthResponseDto } from './api';

const instance: AuthResponseDto = {
    access_token,
    refresh_token,
    expires_in,
    user,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
