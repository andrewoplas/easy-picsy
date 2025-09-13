

# Overview

QR Ph is the Philippine's QR code standard supervised by the BSP and aims to provide a quick and secure way to accept payments from multiple banks and e-wallets, all using one QR Ph code.

QR Ph is now available as a payment method for API, Shopify, PayMongo Links and Pages! This unlocks additional banks and e-wallets as payment options during checkout for the customer. ﻿✅

<Image align="center" src="https://files.readme.io/f0fafeb-Screenshot_2024-07-09_at_10.00.59_AM.png" />

# Setup & Prerequisites

> 🚧 QR Ph configuration for your PayMongo account is required before development
>
> All new PayMongo accounts are automatically configured for QR Ph so your developers can start testing as soon as you sign-up for a PayMongo account. If you discover your PayMongo account is not configured yet, kindly message [support@paymongo.com](mailto:support@paymongo.com) to request for configuration.

# Key Features

* **Accept payments from over 30+ banks and e-wallets**\
  This applies as well to BNPL and other financial partners (ex. BillEase, Home Credit, Salmon, ShopeePayLater etc) who are technically not part of the Instapay network but are connected to banks/ewallets that are.

| Bank                                                          | E-Wallets & Other Issuers                    |
| :------------------------------------------------------------ | :------------------------------------------- |
| Asia United Bank Corporation (AUB)                            | GCash (G-Xchange, Inc.)                      |
| Bank of the Philippine Islands (BPI)                          | Maya Philippines, Inc.                       |
| BDO Unibank Inc                                               | ShopeePay Philippines, Inc.                  |
| Metropolitan Bank and Trust Company (MetroBank)               | GrabPay (Gpay Network PH, Inc.)              |
| Philippine National Bank (PNB)                                | PPS-PEPP Financial Services Corporation      |
| Rizal Commercial Banking Corporation (RCBC)                   | Starpay Corporation                          |
| Robinsons Bank Corporation                                    | TayoCash, Inc.                               |
| Security Bank Corporation                                     | Traxion Pay, Inc.                            |
| Union Bank of the Philippines (UBP)                           | USSC Money Services, Inc.                    |
| China Banking Corporation                                     | Zybi Tech, Inc.                              |
| Land Bank of the Philippines                                  | CIS Bayad Center, Inc.                       |
| AllBank (A Thrift Bank), Inc.                                 | DCPAY Philippines, Inc.                      |
| Queen City Development Bank, Inc. or QueenBank, A Thrift Bank | Home Credit Philippines                      |
| Sterling Bank of Asia, Inc. (A Savings Bank)                  | First Digital Finance Corporation (BillEase) |
| Philippine Savings Bank                                       | Salmon Group Ltd.                            |
| Cebuana Lhuillier Rural Bank, Inc.                            |                                              |
| Rural Bank of Guinobatan, Inc.                                |                                              |
| SeaBank Philippines Inc. (A Rural Bank)                       |                                              |
| GoTyme Bank Corporation                                       |                                              |

* **Low cost, high impact payment solution**\
  Given that PayMongo is a direct provider/acquirer of QR Ph, we have a lot of control over the pricing and features of QR Ph.
  Caters to online (one-time use dynamic QR Ph codes) and in-store (reusable static QR Ph codes) use cases.
* **Secure your payments**\
  Aside from the security benefits of going cashless, part of QR Ph standards is the implementation of a signature mechanism that prevents QR Ph codes from being tampered.

Real-time payment notification via SMS or the dashboard.

### Two Types of PayMongo QR Ph Codes: Online QR Ph and In-store QR Ph

1. **Online QR Ph**
   * A dynamic QR Ph code generated through PayMongo's online payment gateway, such as PayMongo Checkout. A dynamic QR Ph code already includes the payment amount and is generated for each new payment, so that customers can simply scan it and confirm their payment.
   * Available on API via the Payment Intent Workflow and Checkout API, Shopify plugin, PayMongo Links and Pages.
   * One-time use only with a 30 minute expiry period.
2. **In-store QR Ph**
   * A static QR Ph code that is often used in standees, but can be also be shared in digital form. When customers scan a static QR Ph code using their payment app, they will need to enter the amount to be paid.
   * Available on the In-store module on the PayMongo dashboard and API via the <Anchor label="create a static QR Ph code endpoint" target="_blank" href="https://developers.paymongo.com/v2_sample_guides_section_template/update/reference/create-a-static-qr-ph-code#/">create a static QR Ph code endpoint</Anchor>
   * Reusable / Accepts multiple payments

### Customer Payment Process

Paying via QRPh is easy! Below is the QR Ph customer payment process for PayMongo Links on a mobile device to help illustrate this payment method in action.

<Image align="center" src="https://files.readme.io/43b83eabf3e3c66d4fc8dc652d41b63d41e559a1b5290f544bc7ca77e115b4e9-QR_Ph_Checkout_1.png" />

<Image align="center" src="https://files.readme.io/7717b54452a1924d3b3b9d4cebc20a3094a75c79e40777cadabae93a870998e6-QR_Ph_Checkout_2.png" />

# Pricing

We do not charge any set-up fees or monthly fees to use QR Ph both for online and in-store. We only go by a per-transaction rate with the following:

| Payment Method | Pricing (Per Transaction) |
| :------------- | :------------------------ |
| QR Ph          | **1.5%**                  |

For custom pricing, you may check our <Anchor label="Pricing Page" target="_blank" href="https://www.paymongo.com/pricing">Pricing Page</Anchor>