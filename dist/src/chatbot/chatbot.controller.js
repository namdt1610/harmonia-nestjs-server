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
exports.ChatbotController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chatbot_service_1 = require("./chatbot.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
class SendMessageDto {
    message;
}
let ChatbotController = class ChatbotController {
    chatbotService;
    constructor(chatbotService) {
        this.chatbotService = chatbotService;
    }
    async sendMessage(req, sendMessageDto) {
        const chatMessage = await this.chatbotService.sendMessage(req.user.sub, sendMessageDto.message);
        return {
            success: true,
            data: chatMessage,
            message: 'Message processed successfully',
        };
    }
    async getChatHistory(req, limit = 10) {
        const history = await this.chatbotService.getChatHistory(req.user.sub, Number(limit));
        return {
            success: true,
            data: history,
            count: history.length,
        };
    }
    async clearChatHistory(req) {
        const success = await this.chatbotService.clearChatHistory(req.user.sub);
        return {
            success,
            message: success
                ? 'Chat history cleared successfully'
                : 'No chat history found',
        };
    }
    async getUserPreferences(req) {
        const preferences = this.chatbotService.getUserPreferences(req.user.sub);
        return {
            success: true,
            data: preferences,
        };
    }
    async quickRecommendation(req) {
        const chatMessage = await this.chatbotService.sendMessage(req.user.sub, 'Recommend some music for me');
        return {
            success: true,
            data: chatMessage,
            message: 'Quick recommendation generated',
        };
    }
    async getPopularMusic(req) {
        const chatMessage = await this.chatbotService.sendMessage(req.user.sub, 'Show me popular music');
        return {
            success: true,
            data: chatMessage,
            message: 'Popular music retrieved',
        };
    }
    async getNewReleases(req) {
        const chatMessage = await this.chatbotService.sendMessage(req.user.sub, 'Show me new releases');
        return {
            success: true,
            data: chatMessage,
            message: 'New releases retrieved',
        };
    }
    async getMoodMusic(req, mood) {
        const validMoods = [
            'happy',
            'sad',
            'energetic',
            'calm',
            'romantic',
            'angry',
        ];
        const selectedMood = validMoods.includes(mood) ? mood : 'happy';
        const chatMessage = await this.chatbotService.sendMessage(req.user.sub, `I'm feeling ${selectedMood}`);
        return {
            success: true,
            data: chatMessage,
            message: `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} music retrieved`,
        };
    }
    async getHelp(req) {
        const chatMessage = await this.chatbotService.sendMessage(req.user.sub, 'help');
        return {
            success: true,
            data: chatMessage,
            message: 'Help information retrieved',
        };
    }
    async getStatus() {
        return {
            success: true,
            data: {
                status: 'online',
                capabilities: [
                    'Music recommendations based on mood, genre, or artist',
                    'Search for songs, artists, and albums',
                    'Discover popular and new releases',
                    'Playlist creation assistance',
                    'App guidance and help',
                    'Personalized music discovery',
                ],
                supportedMoods: [
                    'happy',
                    'sad',
                    'energetic',
                    'calm',
                    'romantic',
                    'angry',
                ],
                version: '1.0.0',
                language: 'English',
            },
            message: 'Chatbot is ready to assist you!',
        };
    }
};
exports.ChatbotController = ChatbotController;
__decorate([
    (0, common_1.Post)('message'),
    (0, swagger_1.ApiOperation)({ summary: 'Send message to chatbot' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message processed successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat history' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat history retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getChatHistory", null);
__decorate([
    (0, common_1.Delete)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Clear chat history' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat history cleared successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "clearChatHistory", null);
__decorate([
    (0, common_1.Get)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user music preferences learned from chat' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User preferences retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getUserPreferences", null);
__decorate([
    (0, common_1.Post)('quick-actions/recommend'),
    (0, swagger_1.ApiOperation)({ summary: 'Quick music recommendation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quick recommendation generated' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "quickRecommendation", null);
__decorate([
    (0, common_1.Post)('quick-actions/popular'),
    (0, swagger_1.ApiOperation)({ summary: 'Get popular music' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Popular music retrieved' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getPopularMusic", null);
__decorate([
    (0, common_1.Post)('quick-actions/new-releases'),
    (0, swagger_1.ApiOperation)({ summary: 'Get new releases' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'New releases retrieved' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getNewReleases", null);
__decorate([
    (0, common_1.Post)('quick-actions/mood/:mood'),
    (0, swagger_1.ApiOperation)({ summary: 'Get music by mood' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mood-based music retrieved' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('mood')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getMoodMusic", null);
__decorate([
    (0, common_1.Get)('help'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chatbot help information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Help information retrieved' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getHelp", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chatbot status and capabilities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chatbot status retrieved' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "getStatus", null);
exports.ChatbotController = ChatbotController = __decorate([
    (0, swagger_1.ApiTags)('chatbot'),
    (0, common_1.Controller)('chatbot'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [chatbot_service_1.ChatbotService])
], ChatbotController);
//# sourceMappingURL=chatbot.controller.js.map