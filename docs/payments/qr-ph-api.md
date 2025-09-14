

> ❗️ Testing QR Ph with Test API keys
>
> During testing with your test API keys, once the QR Ph code is generated, do not push through with the payment as these QR Ph codes are live QR Ph codes. If you will be using your test API keys, it's recommended to only test the generation of the QR Ph codes.
>
> For more assistance, kindly reache out to [developers@paymongo.com](mailto:developers@paymongo.com) or [support@paymongo.com](mailto:support@paymongo.com)

# Overview

QR Ph is the Philippine's QR code standard supervised by the BSP and aims to provide a quick and secure way to accept payments from multiple banks and e-wallets, all using one QR Ph code.

To learn more about QR Ph and its features, you may refer to our [QR Ph guide](https://developers.paymongo.com/v2_sample_guides_section_template/update/docs/qr-ph#/). For this guide, we will be diving into the API integration implementation.

# Setup & Prerequisites

> 🚧 QR Ph configuration for your PayMongo account is required before development
>
> All new PayMongo accounts are automatically configured for QR Ph so your developers can start testing as soon as you sign-up for a PayMongo account. If you discover your PayMongo account is not configured yet, kindly message [support@paymongo.com](mailto:support@paymongo.com) to request for configuration.

# Implementation

### Integrating QR Ph through the Payment Intent Workflow

The [payment intent workflow](https://developers.paymongo.com/docs/pipm-workflow) is the main workflow used to make payments via PayMongo. **Before getting started with integrating QR Ph, make sure that you are familiar with the payment intent workflow.** To enable QR Ph, a few additional steps just needs to be added to the existing workflow.

<Image align="center" alt="Sample payment intent workflow for QR Ph" border={false} caption="Sample payment intent workflow for QR Ph" src="https://files.readme.io/c6cbd926fc09c3de22d356a3ba6e8354ba5df27e265f25412836ca573dc126ed-Payment_Intent_Workflow_QR_Ph.png" />

### Enabling QR Ph as a payment method for online use-case

#### 1. [Create a Payment Intent](https://developers.paymongo.com/reference/create-a-paymentintent) and include `qrph` under the `payment_method_allowed` array.

```
{
     "data": {
          "attributes": {
               "amount": 10000,
               "payment_method_allowed": [
                    "card",
                    "dob",
                    "paymaya",
                    "qrph" # add this

               ],
               # ...
          }
     }
```

#### 2. [Create a QR Ph payment method](https://developers.paymongo.com/reference/create-a-paymentmethod).

* In this step, set `qrph` as `type` in the request body. When using qrph, you only need to provide the address (optional), name, email, and phone (optional) under `billing` .

#### 3. [Attach the payment method to the created payment intent](https://developers.paymongo.com/reference/attach-to-paymentintent) as normal. Once the Payment Method is attached, the Payment Intent status transitions from `awaiting_payment_method` to `awaiting_next_action `

#### 4. Display the dynamic QRPH code on your front-end or checkout. The QRPH `image_url` is a base-64 image string and is available on the `/attach` response under `next_action`.

```json Sample Attach Response
{  
    "data": {  
        "id": "pi_uv6817kG7JbbvqJnSwE2uXsc",  
        "type": "payment_intent",  
        "attributes": {  
            "amount": 100000,  
            # ...  
            "payment_method_allowed": [  
                "qrph"  
            ],  
            "payments": \[],  
            "next_action": {  
                "code": {  
                    "id": "code_UKixJpQNzEfMm9T7NahbcXNe",  
                    "amount": 100000,  
                    "image_url": "data:image/png;base64,iVBORw0KG...CYII=",  
                    "label": "Test Paymongo"  
                },  
                "type": "consume_qr"  
            },  
            # ...  
        }  
    }  
}
```

> ❗️ QR Ph codes generated using the Payment Intent workflow have an expiry period of 30 minutes.
>
> After 30 minutes, the QR Ph code will expire and should not be used anymore. Expired QR Ph codes may still be scanned but the User will receive an error on their ewallet/banking app after attempting to pay.
>
> These QR Ph codes are also designed to be one-time use only so once the QR Ph code is paid, the user will receieve an error once they attempt to pay.

#### 5. Once the customer has successfully paid, the payment intent status will transition to `succeeded`.

* To determine if the QR Ph payment has already been paid, a webhook call will be made to the nominated and registered webhook endpoint subscribed to the `payment.paid` event. You may refer to our [Webhook API](https://developers.paymongo.com/reference/getting-started-with-your-api#webhook-resource) to learn more.
* If after 30 minutes, you have not received any webhook call, you may also check the status of the payment intent through the [Retrieve a Payment Intent API](https://developers.paymongo.com/reference/retrieve-a-paymentintent). **Kindly note that checking the status of the payment intent through the GET Payment Intent API should only be used if there is no webhook call and shouldn't be used as the default way of checking the status of a payment.**

```json Webhook Event (payment.paid)
{
  "data": {
    "id": "evt_123",
    "type": "event",
    "attributes": {
      "type": "payment.paid",
      "livemode": true,
      "data": {
        "id": "pay_Haq1UQKf4p7b4cDRcxRrnF8j",
        "type": "payment",
        "attributes": {
          "access_url": null,
          "amount": 2000,
          "balance_transaction_id": "bal_txn_wWWuZhjS4N45b5YYLS38cXTR",
          "billing": {
            "address": {
              "city": "",
              "country": "",
              "line1": "",
              "line2": "",
              "postal_code": "",
              "state": ""
            },
            "email": "test@email.com",
            "name": "Test Customer",
            "phone": ""
          },
          "currency": "PHP",
          "description": "test 1",
          "disputed": false,
          "external_reference_number": "SBuAjs2",
          "fee": 400,
          "instant_settlement": null,
          "livemode": true,
          "net_amount": 1600,
          "origin": "links",
          "payment_intent_id": "pi_EXpLFBparajBVHFiU78NKdY3",
          "payout": null,
          "source": {
            "id": "qrph_Xp5eLQKwhJZd4njwa4EFXfa1",
            "type": "qrph",
            "provider": {
              "id": "333444",
              "code_id": "code_6K7HdrvrCrH937BSpJ6K4T5i"
            }
          },
          "statement_descriptor": "Test",
          "status": "paid",
          "tax_amount": 0,
          "metadata": {
            "pm_reference_number": "SBuAjs2"
          },
          "refunds": [],
          "taxes": [
            {
              "amount": 43,
              "currency": "PHP",
              "inclusive": true,
              "name": "VAT",
              "type": "vat",
              "value": "1200_bps"
            }
          ],
          "available_at": 1721984400,
          "created_at": 1721812323,
          "credited_at": 1722416400,
          "paid_at": 1721812322,
          "updated_at": 1721812323
        }
      }
    }
  }
}
```
```json GET Payment Intent Response (paid payment)
{
    "data": {
        "id": "pi_EXpLFBparajBVHFiU78NKdY3",
        "type": "payment_intent",
        "attributes": {
            "amount": 2000,
            "capture_type": "automatic",
            "client_key": "pi_EXpLFBparajBVHFiU78NKdY3_client_412VZQwShMeZDZLFwZmXmiyE",
            "currency": "PHP",
            "description": "test 1",
            "livemode": true,
            "statement_descriptor": "test",
            "status": "succeeded",
            "last_payment_error": null,
            "payment_method_allowed": [
                "paymaya",
                "brankas",
                "qrph",
                "dob",
                "gcash",
                "grab_pay"
            ],
            "payments": [
                {
                    "id": "pay_Haq1UQKf4p7b4cDRcxRrnF8j",
                    "type": "payment",
                    "attributes": {
                        "access_url": null,
                        "amount": 2000,
                        "balance_transaction_id": "bal_txn_wWWuZhjS4N45b5YYLS38cXTR",
                        "billing": {
                            "address": {
                                "city": "",
                                "country": "",
                                "line1": "",
                                "line2": "",
                                "postal_code": "",
                                "state": ""
                            },
                            "email": "test@gmail.com",
                            "name": "test1",
                            "phone": ""
                        },
                        "currency": "PHP",
                        "description": "test 1",
                        "disputed": false,
                        "external_reference_number": "SBuAjs2",
                        "fee": 400,
                        "instant_settlement": null,
                        "livemode": true,
                        "net_amount": 1600,
                        "origin": "links",
                        "payment_intent_id": "pi_EXpLFBparajBVHFiU78NKdY3",
                        "payout": null,
                        "source": {
                            "id": "qrph_Xp5eLQKwhJZd4njwa4EFXfa1",
                            "type": "qrph",
                            "provider": {
                                "id": "333444",
                                "code_id": "code_6K7HdrvrCrH937BSpJ6K4T5i"
                            }
                        },
                        "statement_descriptor": "test",
                        "status": "paid",
                        "tax_amount": 0,
                        "metadata": {
                            "pm_reference_number": "SBuAjs2"
                        },
                        "refunds": [],
                        "taxes": [
                            {
                                "amount": 43,
                                "currency": "PHP",
                                "inclusive": true,
                                "name": "VAT",
                                "type": "vat",
                                "value": "1200_bps"
                            }
                        ],
                        "available_at": 1721984400,
                        "created_at": 1721812323,
                        "credited_at": 1722416400,
                        "paid_at": 1721812322,
                        "updated_at": 1721812323
                    }
                }
            ],
            "next_action": null,
            "payment_method_options": null,
            "metadata": {
                "pm_reference_number": "SBuAjs2"
            },
            "setup_future_usage": null,
            "created_at": 1721812019,
            "updated_at": 1721812323
        }
    }
}
```

* If the QR Ph payment failed or the QR Ph code is expired (not paid within 30 mins from the time the QR Ph image URL was generated), the payment intent will revert back to `awaiting_payment_method`. You may create a new payment method resource and attach it to the payment intent to generate a new QR Ph code.
  * For failed QR Ph payments, a webhook call will be made to the nominated and registered webhook endpoint subscribed to the `payment.failed` event. You may also check the status of the payment intent through the [Retrieve a Payment Intent API](https://developers.paymongo.com/reference/retrieve-a-paymentintent)
  * For expired QR Ph codes, a webhook call will be made to the nominated and registered webhook endpoint subscribed to the `qrph.expired` event.

```json Webhook Event (payment.failed)
{
  "data": {
    "id": "evt_123",
    "type": "event",
    "attributes": {
      "type": "payment.failed",
      "livemode": true,
      "data": {
        "id": "pay_kVjqqErX7nJatqtdJnTGdXs5",
        "type": "payment",
        "attributes": {
          "access_url": null,
          "amount": 2000,
          "balance_transaction_id": null,
          "billing": {
            "address": {
              "city": "",
              "country": "",
              "line1": "",
              "line2": "",
              "postal_code": "",
              "state": ""
            },
            "email": "test@gmail.com",
            "name": "test",
            "phone": ""
          },
          "currency": "PHP",
          "description": "test 2",
          "disputed": false,
          "external_reference_number": "FVFYMiG",
          "failed_code": "RJCT",
          "failed_message": "Unknown processing error.",
          "fee": 0,
          "instant_settlement": null,
          "livemode": true,
          "net_amount": 0,
          "origin": "links",
          "payment_intent_id": "pi_cufYwN1b9mzrvKpXXQLknRiB",
          "payout": null,
          "source": {
            "id": "qrph_SprjmBZcaJKKHryvJvs3FoEL",
            "type": "qrph",
            "provider": {
              "id": "444555",
              "code_id": "code_xBF4wAhRSp3uagh3c8K3zB7i"
            }
          },
          "statement_descriptor": "Test",
          "status": "failed",
          "tax_amount": 0,
          "metadata": null,
          "refunds": [],
          "taxes": [],
          "created_at": 1721814835,
          "credited_at": null,
          "paid_at": 1721814834,
          "updated_at": 1721814835
        }
      }
    }
  }
}
```
```json GET Payment Intent Response (failed payment)
{
    "data": {
        "id": "pi_cufYwN1b9mzrvKpXXQLknRiB",
        "type": "payment_intent",
        "attributes": {
            "amount": 2000,
            "capture_type": "automatic",
            "client_key": "pi_cufYwN1b9mzrvKpXXQLknRiB_client_NyzkVvzEKsb9QtaBj3fexFsq",
            "currency": "PHP",
            "description": "test 2",
            "livemode": true,
            "statement_descriptor": "Test",
            "status": "awaiting_payment_method",
            "last_payment_error": null,
            "payment_method_allowed": [
                "gcash",
                "paymaya",
                "grab_pay",
                "brankas",
                "qrph",
                "dob"
            ],
            "payments": [
                {
                    "id": "pay_kVjqqErX7nJatqtdJnTGdXs5",
                    "type": "payment",
                    "attributes": {
                        "access_url": null,
                        "amount": 2000,
                        "balance_transaction_id": null,
                        "billing": {
                            "address": {
                                "city": "",
                                "country": "",
                                "line1": "",
                                "line2": "",
                                "postal_code": "",
                                "state": ""
                            },
                            "email": "test@gmail.com",
                            "name": "test",
                            "phone": ""
                        },
                        "currency": "PHP",
                        "description": "test 2",
                        "disputed": false,
                        "external_reference_number": "FVFYMiG",
                        "failed_code": "RJCT",
                        "failed_message": "Unknown processing error.",
                        "fee": 0,
                        "instant_settlement": null,
                        "livemode": true,
                        "net_amount": 0,
                        "origin": "links",
                        "payment_intent_id": "pi_cufYwN1b9mzrvKpXXQLknRiB",
                        "payout": null,
                        "source": {
                            "id": "qrph_SprjmBZcaJKKHryvJvs3FoEL",
                            "type": "qrph",
                            "provider": {
                                "id": "444555",
                                "code_id": "code_xBF4wAhRSp3uagh3c8K3zB7i"
                            }
                        },
                        "statement_descriptor": "Test",
                        "status": "failed",
                        "tax_amount": 0,
                        "metadata": null,
                        "refunds": [],
                        "taxes": [],
                        "created_at": 1721814835,
                        "credited_at": null,
                        "paid_at": 1721814834,
                        "updated_at": 1721814835
                    }
                }
            ],
            "next_action": null,
            "payment_method_options": null,
            "metadata": {
                "pm_reference_number": "FVFYMiG"
            },
            "setup_future_usage": null,
            "created_at": 1721814680,
            "updated_at": 1721814835
        }
    }
}
```
```json Webhook Event (qrph.expired)
{
    "data": {
        "id": "evt_Y4BLNd6MhCDc4SYCWngSAq2Y",
        "type": "event",
        "attributes": {
            "type": "qrph.expired",
            "livemode": true,
            "data": {
                "id": "qrph_Dbzwvb5X44BSJc4MgLpZXFaF",
                "type": "qrph",
                "attributes": {
                    "code_id": "code_i7CXZFeM9xFcB1p3DsjRE5Lr",
                    "livemode": true,
                    "organization_id": "org_hQBQmY5mDBPCpFmGSBfKJV2w",
                    "created_at": "2024-08-07T15:59:11.179+08:00",
                    "source_id": "src_FnGTG2jUXrCXSrK7UBX2Zj1h",
                    "source_status": "expired",
                    "payment_intent_id": "pi_3z1Va2HEd1cfjAWzx6N7Cppm"
                }
            },
            "previous_data": {},
            "created_at": 1723019372,
            "updated_at": 1723019372
        }
    }
}
```

***

## Generating Reusable QR Ph Codes

> 📘 Currently only supports the generation of Static QR Ph Codes. For Static QR Ph codes, customers input the payment amount after scanning the QR Ph code. These reusable QR Ph Codes can be used primarily for in-store use and displayed at your store's point of purchase in the form of a standee or digital display.

**QR Ph Code Resource**

```Text QR Ph Code Resource
{
    "data": {
        "id": "code_rmDbeEY1oxyPRU9zuKHEEX5y", #unique ID assigned to each QR Ph code
        "type": "code",
        "attributes": {
            "mobile_number": "+639191234567",
            "qr_image": "data:image/png;base64,iVB...mCC",
            "name": "Paymongo Test"
        }
    }
}
```

| Attribute     | Description                                                                             |
| :------------ | :-------------------------------------------------------------------------------------- |
| qr_image      | Base64-encoded, data/image URL of the QR image generated using the generated QR string. |
| mobile_number | Recipient of the SMS notification we send out for every payment made using the code     |
| name          | Store name that will appear when scanning the QRPH code. Applies to all providers       |

### Creating a Static QR Ph Code

> Generates QR Ph codes and creates a code record for it via API.

<HTMLBlock>{`
<div class="action-button-container">
  <a href="https://developers.paymongo.com/reference/create-a-static-qr-ph-code" target="_blank" class="action-button">API Reference</a>
</div>


<style>
  .heading-text{
  margin-top: 2rem;
  }
  div.action-button-container{
display:flex;
}
a.action-button{
  background: #5e5df0;
  box-shadow: inset 0 0 20px 20px rgba(255, 255, 255, 0.1);
  color: #ffffff;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  line-height: 24px;
  margin-right: 10px;
  outline: 0 solid transparent;
  padding: 6px 12px;
  width: fit-content;
  border: 0;
  text-decoration: none !important;
  transition: box-shadow 0.3s ease-in-out 0s;
}
  
a.action-button:hover{
  box-shadow: #5e5df0 0 10px 20px -10px;
  transition: box-shadow 0.3s ease-in-out 0s;
}
</style>
`}</HTMLBlock>

#### 1. Call the API Endpoint using your Live API Keys, which can be found on your PayMongo dashboard once activated.

* It's important to note that each QR Code will have a unique QR Code ID which can be used to reference each generated QR Code.

**Payload**

```Text POST Request
{
    "data": {
        "attributes": {
            "kind": "instore",
            "mobile_number": "+639191234567"
        }
    }
```

<HTMLBlock>{`
<table style="width: 100%; border-collapse: collapse;">
<thead>
<tr>
  <th style="border: 1px solid #ddd; padding: 8px;">Parameter</th>
  <th style="border: 1px solid #ddd; padding: 8px;">Description</th>
  <th style="border: 1px solid #ddd; padding: 8px;">Validation</th>
  <th style="border: 1px solid #ddd; padding: 8px;">Value</th>
</tr>
</thead>
<tbody>
<tr>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>mobile_number</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>Mobile number that will receive the SMS confirmation on a successful payment  </p>
<p>Note: If no mobile_number is added, no SMS notification will be sent for successful QR Ph payments</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>Optional<br><code>mobile_number</code></p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>+639191234567</p>
</td>
</tr>
<tr>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>kind</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>Kind of QR Ph code to generate</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>Required</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>&#39;instore&#39;</p>
</td>
</tr>
<tr>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>notes</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>Additional notes to be used to identify the generated code (for your internal use, does not get displayed to the customer)</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>Optional<br>String</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>&#39;Main Branch&#39;<br>&#39;Cashier 1&#39;</p>
</td>
</tr>
</tbody>
</table>
`}</HTMLBlock>

#### 2. Convert the Base-64-encoded string from the API response into an image.

* The QR Ph image will be in the API response under `data.attributes.qr_image` as a Base64-encoded string. You can use any Base-64 to Image Converter to convert the QR Image string into an actual image.

```Text POST Response
{
    "data": {
        "id": "code_Yk3HN6HvWddSrNwhM3dKkYeA",
        "type": "code",
        "attributes": {
            "mobile_number": "+639191234567",
            "qr_image": "data:image/png;base64,iVBO...ggg==", #This is the base-64-enconded string
            "name": "Paymongo Test"
        }
    }
}
```

#### 3. Start accepting payments with your static QR Ph code!

* Once you have converted the string into an image, you can now print out or display this QR Ph code in your store.

#### 4. Finish

* To determine if the QR Ph payment has already been paid, a webhook call will be made to the nominated and registered webhook endpoint subscribed to the `payment.paid` event.

* [For CS] Any additional information needed by merchant/dev for the product
  * How are edge cases handled/reported (for expired source, but ACTC)
  * Creating a Static QR Ph Code
  * Should we mention that amount is entered by payer?
  * Clarify primary use cases for dynamic QR vs in store static QR
    [https://paymongo.help/en/articles/9759731-getting-to-know-the-in-store-qr-ph-dashboard](https://paymongo.help/en/articles/9759731-getting-to-know-the-in-store-qr-ph-dashboard)
    How will I be notified of a successful payment via my In-store QR Ph code?
    [https://paymongo.help/en/articles/9759751-how-will-i-be-notified-of-a-successful-payment-via-my-in-store-qr-ph-code](https://paymongo.help/en/articles/9759751-how-will-i-be-notified-of-a-successful-payment-via-my-in-store-qr-ph-code)
  <br />