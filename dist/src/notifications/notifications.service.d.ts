import { ConfigService } from '@nestjs/config';
import { WebSocketGateway as WSGateway } from '../common/websocket.gateway';
export interface NotificationData {
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    data?: any;
    read?: boolean;
    createdAt?: Date;
}
export interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    template?: string;
    templateData?: any;
}
export declare class NotificationsService {
    private configService;
    private webSocketGateway?;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService, webSocketGateway?: WSGateway | undefined);
    private initializeEmailTransporter;
    private notifications;
    sendEmail(options: EmailOptions): Promise<boolean>;
    private generateEmailHTML;
    createNotification(notificationData: NotificationData): Promise<NotificationData>;
    getUserNotifications(userId: string, limit?: number, offset?: number): Promise<NotificationData[]>;
    markAsRead(userId: string, notificationIndex: number): Promise<boolean>;
    markAllAsRead(userId: string): Promise<boolean>;
    getUnreadCount(userId: string): Promise<number>;
    deleteNotification(userId: string, notificationIndex: number): Promise<boolean>;
    clearAllNotifications(userId: string): Promise<boolean>;
    sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean>;
    sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<boolean>;
    sendSubscriptionNotification(userEmail: string, subscriptionType: string, isUpgrade: boolean): Promise<boolean>;
    sendPlaylistSharedNotification(userEmail: string, playlistName: string, sharedBy: string): Promise<boolean>;
    sendNewReleaseNotification(userEmail: string, artistName: string, albumName: string): Promise<boolean>;
}
