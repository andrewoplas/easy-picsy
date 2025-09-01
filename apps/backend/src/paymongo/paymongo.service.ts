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
   * Create expiry time for QR codes (30 minutes from now by default)
   */
  generateExpiryTime(minutes: number = 30): Date {
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + minutes);
    return expiryTime;
  }
}