"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var WebSocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let WebSocketGateway = WebSocketGateway_1 = class WebSocketGateway {
    jwtService;
    server;
    logger = new common_1.Logger(WebSocketGateway_1.name);
    connectedUsers = new Map();
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token || client.handshake.query?.token;
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
            client.emit('connected', {
                message: 'Connected successfully',
                userId,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            this.logger.warn(`WebSocket authentication failed:`, error.message);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        const userId = client.data.userId;
        if (userId) {
            this.connectedUsers.delete(userId);
            this.logger.log(`User ${userId} disconnected from WebSocket`);
        }
    }
    async handleGetQueue(client) {
        const userId = client.data.userId;
        if (!userId)
            return;
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
    async handleAddTrack(client, data) {
        const userId = client.data.userId;
        if (!userId)
            return;
        this.logger.log(`User ${userId} adding track ${data.trackId} to queue`);
        this.server.to(`user_${userId}`).emit('queue:track_added', {
            trackId: data.trackId,
            position: data.position,
            timestamp: new Date().toISOString(),
        });
    }
    async handleRemoveTrack(client, data) {
        const userId = client.data.userId;
        if (!userId)
            return;
        this.logger.log(`User ${userId} removing track at index ${data.index} from queue`);
        this.server.to(`user_${userId}`).emit('queue:track_removed', {
            index: data.index,
            timestamp: new Date().toISOString(),
        });
    }
    async handlePlayPause(client) {
        const userId = client.data.userId;
        if (!userId)
            return;
        this.server.to(`user_${userId}`).emit('playback:state_changed', {
            action: 'toggle_play_pause',
            timestamp: new Date().toISOString(),
        });
    }
    async handleNext(client) {
        const userId = client.data.userId;
        if (!userId)
            return;
        this.server.to(`user_${userId}`).emit('playback:state_changed', {
            action: 'next',
            timestamp: new Date().toISOString(),
        });
    }
    async handlePrevious(client) {
        const userId = client.data.userId;
        if (!userId)
            return;
        this.server.to(`user_${userId}`).emit('playback:state_changed', {
            action: 'previous',
            timestamp: new Date().toISOString(),
        });
    }
    async handleSeek(client, data) {
        const userId = client.data.userId;
        if (!userId)
            return;
        this.server.to(`user_${userId}`).emit('playback:state_changed', {
            action: 'seek',
            position: data.position,
            timestamp: new Date().toISOString(),
        });
    }
    async handleVolume(client, data) {
        const userId = client.data.userId;
        if (!userId)
            return;
        this.server.to(`user_${userId}`).emit('playback:state_changed', {
            action: 'volume',
            volume: data.volume,
            timestamp: new Date().toISOString(),
        });
    }
    handlePing(client) {
        client.emit('pong', {
            timestamp: new Date().toISOString(),
        });
    }
    emitQueueUpdate(userId, queueData) {
        this.server.to(`user_${userId}`).emit('queue:update', {
            ...queueData,
            timestamp: new Date().toISOString(),
        });
    }
    emitNotification(userId, notification) {
        this.server.to(`user_${userId}`).emit('notification:new', {
            ...notification,
            timestamp: new Date().toISOString(),
        });
    }
    emitPlaybackUpdate(userId, playbackData) {
        this.server.to(`user_${userId}`).emit('playback:update', {
            ...playbackData,
            timestamp: new Date().toISOString(),
        });
    }
    broadcastMessage(event, data) {
        this.server.emit(event, {
            ...data,
            timestamp: new Date().toISOString(),
        });
    }
    isUserConnected(userId) {
        return this.connectedUsers.has(userId);
    }
    getConnectedUsersCount() {
        return this.connectedUsers.size;
    }
    getConnectedUserIds() {
        return Array.from(this.connectedUsers.keys());
    }
};
exports.WebSocketGateway = WebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('queue:get'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleGetQueue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('queue:add_track'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleAddTrack", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('queue:remove_track'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleRemoveTrack", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playback:play_pause'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handlePlayPause", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playback:next'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleNext", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playback:previous'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handlePrevious", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playback:seek'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleSeek", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('playback:volume'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], WebSocketGateway.prototype, "handleVolume", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebSocketGateway.prototype, "handlePing", null);
exports.WebSocketGateway = WebSocketGateway = WebSocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
        namespace: '/ws',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], WebSocketGateway);
//# sourceMappingURL=websocket.gateway.js.map