import { ChatbotService } from './chatbot.service';
declare class SendMessageDto {
    message: string;
}
export declare class ChatbotController {
    private readonly chatbotService;
    constructor(chatbotService: ChatbotService);
    sendMessage(req: any, sendMessageDto: SendMessageDto): Promise<{
        success: boolean;
        data: import("./chatbot.service").ChatMessage;
        message: string;
    }>;
    getChatHistory(req: any, limit?: number): Promise<{
        success: boolean;
        data: import("./chatbot.service").ChatMessage[];
        count: number;
    }>;
    clearChatHistory(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserPreferences(req: any): Promise<{
        success: boolean;
        data: any;
    }>;
    quickRecommendation(req: any): Promise<{
        success: boolean;
        data: import("./chatbot.service").ChatMessage;
        message: string;
    }>;
    getPopularMusic(req: any): Promise<{
        success: boolean;
        data: import("./chatbot.service").ChatMessage;
        message: string;
    }>;
    getNewReleases(req: any): Promise<{
        success: boolean;
        data: import("./chatbot.service").ChatMessage;
        message: string;
    }>;
    getMoodMusic(req: any, mood: string): Promise<{
        success: boolean;
        data: import("./chatbot.service").ChatMessage;
        message: string;
    }>;
    getHelp(req: any): Promise<{
        success: boolean;
        data: import("./chatbot.service").ChatMessage;
        message: string;
    }>;
    getStatus(): Promise<{
        success: boolean;
        data: {
            status: string;
            capabilities: string[];
            supportedMoods: string[];
            version: string;
            language: string;
        };
        message: string;
    }>;
}
export {};
