export interface PaymongoPaymentIntent {
  id: string;
  type: 'payment_intent';
  attributes: {
    amount: number;
    currency: 'PHP';
    description: string;
    statement_descriptor?: string;
    status: 'awaiting_payment_method' | 'awaiting_next_action' | 'processing' | 'succeeded';
    livemode: boolean;
    client_key: string;
    capture_type?: 'automatic' | 'manual';
    created_at: number;
    updated_at: number;
    last_payment_error?: {
      code: string;
      message: string;
      source?: string;
    } | null;
    payment_method_allowed: string[];
    payments: Array<{
      id: string;
      type: string;
      attributes: Record<string, unknown>;
    }>;
    next_action?: {
      type: 'redirect' | 'consume_qr';
      redirect?: {
        url: string;
        return_url?: string;
      };
      code?: {
        id: string;
        image_url: string;
      };
    } | null;
    payment_method_options?: {
      card?: {
        request_three_d_secure: 'any' | 'automatic';
      };
    };
    setup_future_usage?: {
      session_type: 'on_session';
      customer_id: string;
    };
    metadata?: Record<string, string>;
  };
}

export interface PaymongoPaymentIntentAttachResponse {
  data: PaymongoPaymentIntent;
}

export interface PaymongoPaymentMethod {
  id: string;
  type: 'payment_method';
  attributes: {
    billing: {
      address: {
        city: string;
        country: string;
        line1: string;
        line2: string;
        postal_code: string;
        state: string;
      };
      email: string;
      name: string;
      phone: string;
    };
    details?: {
      last4?: string;
      exp_month?: number;
      exp_year?: number;
    };
    livemode: boolean;
    type: 'brankas' | 'card' | 'dob' | 'gcash' | 'grab_pay' | 'billease' | 'paymaya' | 'qrph';
    metadata?: Record<string, string>;
    created_at: number;
    updated_at: number;
  };
}

export interface PaymongoPaymentMethodResponse {
  data: PaymongoPaymentMethod;
}
