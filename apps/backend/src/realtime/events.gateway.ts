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

// Essential WebSocket events only
export interface PaymentSuccess {
  qrCodeId: string;
  eventId: string;
  paymentId: string;
  amount: number;
  currency: string;
}

export interface PaymentFailed {
  qrCodeId: string;
  eventId: string;
  paymentId: string;
  failureReason: string;
}

export interface QRExpiryWarning {
  qrCodeId: string;
  eventId: string;
  minutesRemaining: number;
  message: string;
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
   * Broadcast payment success to event room
   */
  broadcastPaymentSuccess(eventId: string, payment: PaymentSuccess) {
    this.server.to(`event_${eventId}`).emit('paymentSuccess', payment);
    this.logger.log(
      `Broadcasted payment success for event ${eventId}: ${payment.paymentId}`
    );
  }

  /**
   * Broadcast payment failure to event room
   */
  broadcastPaymentFailed(eventId: string, payment: PaymentFailed) {
    this.server.to(`event_${eventId}`).emit('paymentFailed', payment);
    this.logger.log(
      `Broadcasted payment failure for event ${eventId}: ${payment.failureReason}`
    );
  }

  /**
   * Broadcast QR code expiry warning (5 minutes before expiry)
   */
  broadcastQRExpiryWarning(eventId: string, warning: QRExpiryWarning) {
    this.server.to(`event_${eventId}`).emit('qrExpiryWarning', warning);
    this.logger.log(
      `Broadcasted QR expiry warning for event ${eventId}: ${warning.minutesRemaining}min remaining`
    );
  }
}
