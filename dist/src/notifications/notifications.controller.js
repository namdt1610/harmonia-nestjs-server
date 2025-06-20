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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notifications_service_1 = require("./notifications.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
class CreateNotificationDto {
    title;
    message;
    type;
    data;
}
class SendEmailDto {
    to;
    subject;
    text;
    html;
}
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async getUserNotifications(req, limit = 20, offset = 0) {
        const notifications = await this.notificationsService.getUserNotifications(req.user.sub, Number(limit), Number(offset));
        return {
            success: true,
            data: notifications,
            pagination: {
                limit: Number(limit),
                offset: Number(offset),
                hasMore: notifications.length === Number(limit),
            },
        };
    }
    async getUnreadCount(req) {
        const count = await this.notificationsService.getUnreadCount(req.user.sub);
        return {
            success: true,
            data: { unreadCount: count },
        };
    }
    async createNotification(req, createNotificationDto) {
        const notificationData = {
            userId: req.user.sub,
            ...createNotificationDto,
        };
        const notification = await this.notificationsService.createNotification(notificationData);
        return {
            success: true,
            data: notification,
            message: 'Notification created successfully',
        };
    }
    async markAsRead(req, index) {
        const success = await this.notificationsService.markAsRead(req.user.sub, parseInt(index));
        return {
            success,
            message: success
                ? 'Notification marked as read'
                : 'Notification not found',
        };
    }
    async markAllAsRead(req) {
        const success = await this.notificationsService.markAllAsRead(req.user.sub);
        return {
            success,
            message: 'All notifications marked as read',
        };
    }
    async deleteNotification(req, index) {
        const success = await this.notificationsService.deleteNotification(req.user.sub, parseInt(index));
        return {
            success,
            message: success
                ? 'Notification deleted successfully'
                : 'Notification not found',
        };
    }
    async clearAllNotifications(req) {
        const success = await this.notificationsService.clearAllNotifications(req.user.sub);
        return {
            success,
            message: 'All notifications cleared',
        };
    }
    async sendEmail(sendEmailDto) {
        const success = await this.notificationsService.sendEmail(sendEmailDto);
        return {
            success,
            message: success ? 'Email sent successfully' : 'Failed to send email',
        };
    }
    async sendTestWelcomeEmail(req) {
        const userEmail = req.user.email || 'test@example.com';
        const userName = req.user.name || 'Test User';
        const success = await this.notificationsService.sendWelcomeEmail(userEmail, userName);
        return {
            success,
            message: success
                ? 'Welcome email sent successfully'
                : 'Failed to send welcome email',
        };
    }
    async sendTestPasswordResetEmail(req) {
        const userEmail = req.user.email || 'test@example.com';
        const resetToken = 'test-reset-token-' + Date.now();
        const success = await this.notificationsService.sendPasswordResetEmail(userEmail, resetToken);
        return {
            success,
            message: success
                ? 'Password reset email sent successfully'
                : 'Failed to send password reset email',
        };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user notifications' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'offset', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notifications retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUserNotifications", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread notifications count' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Unread count retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new notification' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Notification created successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "createNotification", null);
__decorate([
    (0, common_1.Put)(':index/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification marked as read' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Put)('mark-all-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All notifications marked as read' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':index'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a notification' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notification deleted successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "deleteNotification", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Clear all notifications' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All notifications cleared' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "clearAllNotifications", null);
__decorate([
    (0, common_1.Post)('send-email'),
    (0, swagger_1.ApiOperation)({ summary: 'Send email notification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email sent successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendEmailDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Post)('test/welcome-email'),
    (0, swagger_1.ApiOperation)({ summary: 'Send test welcome email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Welcome email sent' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendTestWelcomeEmail", null);
__decorate([
    (0, common_1.Post)('test/reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Send test password reset email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset email sent' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendTestPasswordResetEmail", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map