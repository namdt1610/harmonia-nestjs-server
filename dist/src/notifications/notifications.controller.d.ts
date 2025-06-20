import { NotificationsService, NotificationData } from './notifications.service';
declare class CreateNotificationDto {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    data?: any;
}
declare class SendEmailDto {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUserNotifications(req: any, limit?: number, offset?: number): Promise<{
        success: boolean;
        data: NotificationData[];
        pagination: {
            limit: number;
            offset: number;
            hasMore: boolean;
        };
    }>;
    getUnreadCount(req: any): Promise<{
        success: boolean;
        data: {
            unreadCount: number;
        };
    }>;
    createNotification(req: any, createNotificationDto: CreateNotificationDto): Promise<{
        success: boolean;
        data: NotificationData;
        message: string;
    }>;
    markAsRead(req: any, index: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteNotification(req: any, index: string): Promise<{
        success: boolean;
        message: string;
    }>;
    clearAllNotifications(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    sendEmail(sendEmailDto: SendEmailDto): Promise<{
        success: boolean;
        message: string;
    }>;
    sendTestWelcomeEmail(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    sendTestPasswordResetEmail(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
