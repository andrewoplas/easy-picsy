# UserResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | Unique identifier for the user | [default to undefined]
**supabaseId** | **string** | Supabase user identifier | [default to undefined]
**email** | **string** | User email address | [default to undefined]
**fullName** | **object** | User full name | [optional] [default to undefined]
**avatarUrl** | **object** | User avatar URL | [optional] [default to undefined]
**role** | **string** | User role | [default to undefined]
**permissions** | **Array&lt;string&gt;** | User permissions array | [optional] [default to undefined]
**createdAt** | **string** | User creation timestamp | [default to undefined]
**updatedAt** | **string** | User last update timestamp | [default to undefined]
**lastLoginAt** | **object** | User last login timestamp | [optional] [default to undefined]
**metadata** | **object** | Additional user metadata | [optional] [default to undefined]

## Example

```typescript
import { UserResponseDto } from './api';

const instance: UserResponseDto = {
    id,
    supabaseId,
    email,
    fullName,
    avatarUrl,
    role,
    permissions,
    createdAt,
    updatedAt,
    lastLoginAt,
    metadata,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
