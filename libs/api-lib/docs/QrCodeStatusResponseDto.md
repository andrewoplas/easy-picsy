# QrCodeStatusResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**qrCode** | [**QrCodeResponseDto**](QrCodeResponseDto.md) | QR code details | [default to undefined]
**isValid** | **boolean** | Whether the QR code is currently valid and usable | [default to undefined]
**timeUntilExpiry** | **number** | Time until QR code expiry in milliseconds | [optional] [default to undefined]

## Example

```typescript
import { QrCodeStatusResponseDto } from './api';

const instance: QrCodeStatusResponseDto = {
    qrCode,
    isValid,
    timeUntilExpiry,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
