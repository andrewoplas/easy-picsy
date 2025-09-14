import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface PaymongoLinkData {
  id: string;
  attributes: {
    amount: number;
    currency: string;
    description: string;
    url: string;
    status: string;
    checkout_url: string;
    reference_number: string;
  };
}

export interface CreatePaymentLinkRequest {
  amount: number; // Amount in cents
  currency: string;
  description: string;
  reference_number?: string;
  remarks?: string;
}

export interface PaymongoPaymentIntent {
  id: string;
  attributes: {
    amount: number;
    currency: string;
    description: string;
    status: string;
    reference_number?: string;
    next_action?: {
      type: string;
      redirect?: {
        url: string;
      };
    };
  };
}

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
    this.secretKey = this.configService.get<string>('PAYMONGO_SECRET_KEY');
    
    if (!this.secretKey) {
      throw new Error('PAYMONGO_SECRET_KEY is required in environment variables');
    }

    // Create axios instance for Paymongo API
    this.apiClient = axios.create({
      baseURL: 'https://api.paymongo.com/v1',
      headers: {
        'Authorization': `Basic ${Buffer.from(this.secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Create a payment link with QR code for the given event
   */
  async createPaymentLink(request: CreatePaymentLinkRequest): Promise<PaymongoLinkData> {
    try {
      this.logger.log(`Creating payment link for amount: ${request.amount}`);
      
      const response = await this.apiClient.post('/links', {
        data: {
          attributes: {
            amount: request.amount,
            currency: request.currency,
            description: request.description,
            reference_number: request.reference_number,
            remarks: request.remarks,
          },
        },
      });

      const linkData = response.data.data as PaymongoLinkData;
      this.logger.log(`Payment link created successfully: ${linkData.id}`);
      
      return linkData;
    } catch (error) {
      this.logger.error('Failed to create payment link:', error.response?.data || error.message);
      throw new Error('Failed to create payment link with Paymongo');
    }
  }

  /**
   * Retrieve payment link details
   */
  async getPaymentLink(linkId: string): Promise<PaymongoLinkData> {
    try {
      const response = await this.apiClient.get(`/links/${linkId}`);
      return response.data.data as PaymongoLinkData;
    } catch (error) {
      this.logger.error(`Failed to retrieve payment link ${linkId}:`, error.response?.data || error.message);
      throw new Error('Failed to retrieve payment link');
    }
  }

  /**
   * Archive (disable) a payment link
   */
  async archivePaymentLink(linkId: string): Promise<void> {
    try {
      await this.apiClient.post(`/links/${linkId}/archive`);
      this.logger.log(`Payment link ${linkId} archived successfully`);
    } catch (error) {
      this.logger.error(`Failed to archive payment link ${linkId}:`, error.response?.data || error.message);
      throw new Error('Failed to archive payment link');
    }
  }

  /**
   * Cancel a payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
    try {
      await this.apiClient.post(`/payment_intents/${paymentIntentId}/cancel`);
      this.logger.log(`Payment intent ${paymentIntentId} cancelled successfully`);
    } catch (error) {
      this.logger.error(`Failed to cancel payment intent ${paymentIntentId}:`, error.response?.data || error.message);
      throw new Error('Failed to cancel payment intent');
    }
  }

  /**
   * Validate that a payment was successfully completed
   */
  async validatePayment(paymentId: string): Promise<boolean> {
    try {
      const response = await this.apiClient.get(`/payments/${paymentId}`);
      const payment = response.data.data;
      return payment.attributes.status === 'paid';
    } catch (error) {
      this.logger.error(`Failed to validate payment ${paymentId}:`, error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Generate QR code data from payment link URL
   * This creates the QR code content that can be encoded into an image
   */
  generateQRCodeData(paymentLink: PaymongoLinkData): string {
    return paymentLink.attributes.checkout_url;
  }

  /**
   * Create a Payment Intent with QR Ph support
   * This generates a QR code that contains payment data directly
   */
  async createPaymentIntentWithQR(request: CreatePaymentIntentRequest): Promise<PaymongoPaymentIntent> {
    try {
      this.logger.log(`Creating payment intent with QR for amount: ${request.amount}`);
      
      const response = await this.apiClient.post('/payment_intents', {
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

      const paymentIntent = response.data.data as PaymongoPaymentIntent;
      this.logger.log(`Payment intent created successfully: ${paymentIntent.id}`);
      
      return paymentIntent;
    } catch (error) {
      this.logger.error('Failed to create payment intent:', error.response?.data || error.message);
      throw new Error('Failed to create payment intent with Paymongo');
    }
  }

  /**
   * Create a static QR code for in-store payments
   * This generates a reusable QR code that works with Philippine payment apps
   */
  async createStaticQRCode(): Promise<string | null> {
    try {
      const response = await this.apiClient.post('/codes', {
        data: {
          attributes: {
            kind: 'instore'
          }
        }
      });

      const qrData = response.data.data;
      if (qrData.attributes?.qr_image) {
        this.logger.log('Successfully created static QR code from PayMongo');
        return qrData.attributes.qr_image;
      }

      this.logger.warn('No QR code image in PayMongo static QR response');
      return null;
    } catch (error) {
      this.logger.error('Failed to create static QR code:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Create and attach QR Ph payment method to get QR code image
   */
  async createAndAttachQRPaymentMethod(paymentIntentId: string): Promise<{ qrImage: string; qrphId: string } | null> {
    try {
      // Step 1: Create QR Ph payment method with required billing information
      const paymentMethodResponse = await this.apiClient.post('/payment_methods', {
        data: {
          attributes: {
            type: 'qrph',
            billing: {
              name: 'Easy Picsy Customer',
              email: 'customer@easypicsy.com',
              phone: '+639171234567',
              address: {
                line1: '',
                line2: '',
                city: '',
                state: '',
                country: 'PH',
                postal_code: ''
              }
            }
          }
        }
      });

      const paymentMethodId = paymentMethodResponse.data.data.id;
      this.logger.log(`Created QR Ph payment method: ${paymentMethodId}`);

      // Step 2: Attach payment method to payment intent
      const attachResponse = await this.apiClient.post(`/payment_intents/${paymentIntentId}/attach`, {
        data: {
          attributes: {
            payment_method: paymentMethodId
          }
        }
      });

      // Step 3: Extract QR code image and QR Ph ID from next_action
      const nextAction = attachResponse.data.data.attributes.next_action;
      if (nextAction?.type === 'consume_qr' && nextAction.code?.image_url) {
        this.logger.log('Successfully retrieved QR code image from PayMongo');
        
        // The QR Ph ID might be in the response data or we can extract from payment method
        const qrphId = nextAction.code?.id || paymentMethodId;
        
        return {
          qrImage: nextAction.code.image_url,
          qrphId: qrphId
        };
      }

      this.logger.warn('No QR code image found in PayMongo response');
      return null;
    } catch (error) {
      this.logger.error(`Failed to create/attach QR payment method for ${paymentIntentId}:`, error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Get payment intent details
   */
  async getPaymentIntent(paymentIntentId: string): Promise<PaymongoPaymentIntent> {
    try {
      const response = await this.apiClient.get(`/payment_intents/${paymentIntentId}`);
      return response.data.data as PaymongoPaymentIntent;
    } catch (error) {
      this.logger.error(`Failed to retrieve payment intent ${paymentIntentId}:`, error.response?.data || error.message);
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