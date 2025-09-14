import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QrCodeRealtimeStatus } from '@org/api-lib/types';

export interface QRCodeStatusUpdate {
  qrCodeId: string;
  eventId: string;
  status: QrCodeRealtimeStatus;
  expiresAt?: string;
  timeUntilExpiry?: number;
  failureReason?: string;
}

export interface PaymentNotification {
  paymentId: string;
  eventId: string;
  qrCodeId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'failed';
}

export interface QRCodeGenerated {
  qrCodeId: string;
  eventId: string;
  checkoutUrl: string | null;
  qrCodeImage: string;
  expiresAt: string;
  amount: number;
  currency: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  },
  namespace: '/events',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      // Extract token from auth header or query
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '') ||
        client.handshake.query?.token;

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      // Store token for later use
      client.data.token = token;
      client.data.authenticated = true;

      this.logger.log(`Client connected: ${client.id}`);
    } catch (error) {
      this.logger.error(`Connection error for client ${client.id}:`, error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Join a room for specific event updates
   */
  @SubscribeMessage('joinEvent')
  async joinEventRoom(
    @MessageBody() data: { eventId: string },
    @ConnectedSocket() client: Socket
  ) {
    if (!client.data.authenticated) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }

    await client.join(`event_${data.eventId}`);
    this.logger.log(`Client ${client.id} joined event room: ${data.eventId}`);
    client.emit('joinedEvent', { eventId: data.eventId });
  }

  /**
   * Leave an event room
   */
  @SubscribeMessage('leaveEvent')
  async leaveEventRoom(
    @MessageBody() data: { eventId: string },
    @ConnectedSocket() client: Socket
  ) {
    await client.leave(`event_${data.eventId}`);
    this.logger.log(`Client ${client.id} left event room: ${data.eventId}`);
    client.emit('leftEvent', { eventId: data.eventId });
  }

  /**
   * Broadcast QR code status update to event room
   */
  broadcastQRStatusUpdate(eventId: string, update: QRCodeStatusUpdate) {
    this.server.to(`event_${eventId}`).emit('qrStatusUpdate', update);
    this.logger.log(
      `Broadcasted QR status update for event ${eventId}: ${update.status}`
    );
  }

  /**
   * Broadcast payment notification to event room
   */
  broadcastPaymentNotification(eventId: string, payment: PaymentNotification) {
    this.server.to(`event_${eventId}`).emit('paymentReceived', payment);
    this.logger.log(
      `Broadcasted payment notification for event ${eventId}: ${payment.status}`
    );
  }

  /**
   * Broadcast new QR code generation to event room
   */
  broadcastQRCodeGenerated(eventId: string, qrCode: QRCodeGenerated) {
    this.server.to(`event_${eventId}`).emit('qrCodeGenerated', qrCode);
    this.logger.log(`Broadcasted QR code generation for event ${eventId}`);
  }

  /**
   * Broadcast QR code expiry warning (5 minutes before expiry)
   */
  broadcastQRExpiryWarning(
    eventId: string,
    qrCodeId: string,
    minutesRemaining: number
  ) {
    this.server.to(`event_${eventId}`).emit('qrExpiryWarning', {
      qrCodeId,
      eventId,
      minutesRemaining,
      message: `QR code expires in ${minutesRemaining} minutes`,
    });
    this.logger.log(
      `Broadcasted QR expiry warning for event ${eventId}: ${minutesRemaining}min remaining`
    );
  }

  /**
   * Send connection status to all clients
   */
  broadcastConnectionStatus(status: 'connected' | 'reconnected' | 'error') {
    this.server.emit('connectionStatus', {
      status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Broadcast payment success to event room
   */
  broadcastPaymentSuccess(
    eventId: string,
    payment: {
      qrCodeId: string;
      eventId: string;
      paymentId: string;
      amount: number;
      currency: string;
    }
  ) {
    this.server.to(`event_${eventId}`).emit('paymentSuccess', payment);
    this.logger.log(
      `Broadcasted payment success for event ${eventId}: ${payment.paymentId}`
    );
  }

  /**
   * Broadcast payment failure to event room
   */
  broadcastPaymentFailed(
    eventId: string,
    payment: {
      qrCodeId: string;
      eventId: string;
      paymentId: string;
      failureReason: string;
    }
  ) {
    this.server.to(`event_${eventId}`).emit('paymentFailed', payment);
    this.logger.log(
      `Broadcasted payment failure for event ${eventId}: ${payment.failureReason}`
    );
  }
}
