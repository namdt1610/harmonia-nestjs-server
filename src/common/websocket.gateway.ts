import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WSGateway({
  cors: {
    origin: '*',
  },
  namespace: '/ws',
})
export class WebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGateway.name);
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;

      if (!token) {
        this.logger.warn(`WebSocket connection rejected: No token provided`);
        client.disconnect(true);
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      client.data.userId = userId;
      this.connectedUsers.set(userId, client.id);

      client.join(`user_${userId}`);

      this.logger.log(`User ${userId} connected via WebSocket (${client.id})`);

      // Send connection confirmation
      client.emit('connected', {
        message: 'Connected successfully',
        userId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.warn(`WebSocket authentication failed:`, error.message);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      this.logger.log(`User ${userId} disconnected from WebSocket`);
    }
  }

  // Queue Management Events
  @SubscribeMessage('queue:get')
  async handleGetQueue(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (!userId) return;

    // In a real implementation, you'd get the queue from StreamQueueService
    client.emit('queue:update', {
      tracks: [],
      currentIndex: 0,
      isPlaying: false,
      volume: 1.0,
      repeat: 'none',
      shuffle: false,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('queue:add_track')
  async handleAddTrack(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { trackId: string; position?: number },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    this.logger.log(`User ${userId} adding track ${data.trackId} to queue`);

    // Broadcast to all user's connected devices
    this.server.to(`user_${userId}`).emit('queue:track_added', {
      trackId: data.trackId,
      position: data.position,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('queue:remove_track')
  async handleRemoveTrack(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { index: number },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    this.logger.log(
      `User ${userId} removing track at index ${data.index} from queue`,
    );

    this.server.to(`user_${userId}`).emit('queue:track_removed', {
      index: data.index,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('playback:play_pause')
  async handlePlayPause(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (!userId) return;

    this.server.to(`user_${userId}`).emit('playback:state_changed', {
      action: 'toggle_play_pause',
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('playback:next')
  async handleNext(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (!userId) return;

    this.server.to(`user_${userId}`).emit('playback:state_changed', {
      action: 'next',
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('playback:previous')
  async handlePrevious(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (!userId) return;

    this.server.to(`user_${userId}`).emit('playback:state_changed', {
      action: 'previous',
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('playback:seek')
  async handleSeek(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { position: number },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    this.server.to(`user_${userId}`).emit('playback:state_changed', {
      action: 'seek',
      position: data.position,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('playback:volume')
  async handleVolume(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { volume: number },
  ) {
    const userId = client.data.userId;
    if (!userId) return;

    this.server.to(`user_${userId}`).emit('playback:state_changed', {
      action: 'volume',
      volume: data.volume,
      timestamp: new Date().toISOString(),
    });
  }

  // Ping/Pong for connection health
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', {
      timestamp: new Date().toISOString(),
    });
  }

  // Public methods for emitting events from services
  emitQueueUpdate(userId: string, queueData: any) {
    this.server.to(`user_${userId}`).emit('queue:update', {
      ...queueData,
      timestamp: new Date().toISOString(),
    });
  }

  emitNotification(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit('notification:new', {
      ...notification,
      timestamp: new Date().toISOString(),
    });
  }

  emitPlaybackUpdate(userId: string, playbackData: any) {
    this.server.to(`user_${userId}`).emit('playback:update', {
      ...playbackData,
      timestamp: new Date().toISOString(),
    });
  }

  // Broadcast to all connected users
  broadcastMessage(event: string, data: any) {
    this.server.emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }

  // Check if user is connected
  isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get all connected user IDs
  getConnectedUserIds(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}
