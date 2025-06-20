import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    server: Server;
    private readonly logger;
    private connectedUsers;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleGetQueue(client: Socket): Promise<void>;
    handleAddTrack(client: Socket, data: {
        trackId: string;
        position?: number;
    }): Promise<void>;
    handleRemoveTrack(client: Socket, data: {
        index: number;
    }): Promise<void>;
    handlePlayPause(client: Socket): Promise<void>;
    handleNext(client: Socket): Promise<void>;
    handlePrevious(client: Socket): Promise<void>;
    handleSeek(client: Socket, data: {
        position: number;
    }): Promise<void>;
    handleVolume(client: Socket, data: {
        volume: number;
    }): Promise<void>;
    handlePing(client: Socket): void;
    emitQueueUpdate(userId: string, queueData: any): void;
    emitNotification(userId: string, notification: any): void;
    emitPlaybackUpdate(userId: string, playbackData: any): void;
    broadcastMessage(event: string, data: any): void;
    isUserConnected(userId: string): boolean;
    getConnectedUsersCount(): number;
    getConnectedUserIds(): string[];
}
