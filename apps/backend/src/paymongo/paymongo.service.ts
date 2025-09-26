import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { PaymongoPaymentIntent, PaymongoPaymentIntentAttachResponse, PaymongoPaymentMethodResponse } from './type';

export interface CreatePaymentIntentRequest {
  amount: number; // Amount in cents
  currency: string;
  description?: string;
  reference_number?: string;
  payment_method_allowed: string[];
}

@Injectable()
export class PaymongoService {
  private readonly logger = new Logger(PaymongoService.name);
  private readonly apiClient: AxiosInstance;
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('PAYMONGO_SECRET_KEY');

    if (!secretKey) {
      throw new Error('PAYMONGO_SECRET_KEY is required in environment variables');
    }

    this.secretKey = secretKey;

    // Create axios instance for Paymongo API
    this.apiClient = axios.create({
      baseURL: 'https://api.paymongo.com/v1',
      headers: {
        Authorization: `Basic ${Buffer.from(this.secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Cancel a payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
    try {
      await this.apiClient.post(`/payment_intents/${paymentIntentId}/cancel`);
      this.logger.log(`Payment intent ${paymentIntentId} cancelled successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const responseData = error instanceof AxiosError ? error.response?.data : undefined;
      this.logger.error(`Failed to cancel payment intent ${paymentIntentId}:`, responseData || errorMessage);
      throw new Error('Failed to cancel payment intent');
    }
  }

  /**
   * Create a Payment Intent with QR Ph support
   * This generates a QR code that contains payment data directly
   */
  async createPaymentIntentWithQR(request: CreatePaymentIntentRequest): Promise<PaymongoPaymentIntent> {
    try {
      this.logger.log(`Creating payment intent with QR for amount: ${request.amount}`);

      const response = await this.apiClient.post<PaymongoPaymentIntentAttachResponse>('/payment_intents', {
        data: {
          attributes: {
            amount: request.amount,
            currency: request.currency,
            description: request.description || 'Photobooth Payment',
            reference_number: request.reference_number,
            payment_method_allowed: request.payment_method_allowed || ['qrph'],
          },
        },
      });

      const paymentIntent = response.data.data;
      this.logger.log(`Payment intent created successfully: ${paymentIntent.id}`);

      return paymentIntent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const responseData = error instanceof AxiosError ? error.response?.data : undefined;
      this.logger.error('Failed to create payment intent:', responseData || errorMessage);
      throw new Error('Failed to create payment intent with Paymongo');
    }
  }

  /**
   * Create and attach QR Ph payment method to get QR code image
   */
  async createAndAttachQRPaymentMethod(paymentIntentId: string): Promise<{ qrImage: string; qrphId: string } | null> {
    try {
      // Step 1: Create QR Ph payment method with required billing information
      const paymentMethodResponse = await this.apiClient.post<PaymongoPaymentMethodResponse>('/payment_methods', {
        data: {
          attributes: {
            type: 'qrph',
            billing: {
              name: 'Easy Picsy Customer',
              email: 'hello@easypicsybooths.com',
              phone: '+639055625909',
              address: {
                line1: '',
                line2: '',
                city: '',
                state: '',
                country: 'PH',
                postal_code: '',
              },
            },
          },
        },
      });

      const paymentMethodId = paymentMethodResponse.data.data.id;
      this.logger.log(`Created QR Ph payment method: ${paymentMethodId}`);

      // Step 2: Attach payment method to payment intent
      const attachResponse = await this.apiClient.post<PaymongoPaymentIntentAttachResponse>(
        `/payment_intents/${paymentIntentId}/attach`,
        {
          data: {
            attributes: {
              payment_method: paymentMethodId,
            },
          },
        },
      );

      // Step 3: Extract QR code image and QR Ph ID from next_action
      const nextAction = attachResponse.data.data.attributes.next_action;

      if (nextAction?.type === 'consume_qr' && nextAction.code?.image_url) {
        this.logger.log('Successfully retrieved QR code image from PayMongo');

        // The QR Ph ID might be in the response data or we can extract from payment method
        const qrphId = nextAction.code?.id || paymentMethodId;

        return {
          qrImage: nextAction.code.image_url,
          qrphId: qrphId,
        };
      }

      this.logger.warn('No QR code image found in PayMongo response');
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const responseData = error instanceof AxiosError ? error.response?.data : undefined;
      this.logger.error(
        `Failed to create/attach QR payment method for ${paymentIntentId}:`,
        responseData || errorMessage,
      );
      return null;
    }
  }

  /**
   * Get payment intent details
   */
  async getPaymentIntent(paymentIntentId: string): Promise<PaymongoPaymentIntent> {
    try {
      const response = await this.apiClient.get<PaymongoPaymentIntentAttachResponse>(
        `/payment_intents/${paymentIntentId}`,
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const responseData = error instanceof AxiosError ? error.response?.data : undefined;
      this.logger.error(`Failed to retrieve payment intent ${paymentIntentId}:`, responseData || errorMessage);
      throw new Error('Failed to retrieve payment intent');
    }
  }

  /**
   * Create expiry time for QR codes (30 minutes from now by default)
   */
  generateExpiryTime(minutes = 30): Date {
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + minutes);
    return expiryTime;
  }
}
