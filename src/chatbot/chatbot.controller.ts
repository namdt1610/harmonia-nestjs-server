import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class SendMessageDto {
  message: string;
}

@ApiTags('chatbot')
@Controller('chatbot')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  @ApiOperation({ summary: 'Send message to chatbot' })
  @ApiResponse({ status: 200, description: 'Message processed successfully' })
  async sendMessage(@Request() req, @Body() sendMessageDto: SendMessageDto) {
    const chatMessage = await this.chatbotService.sendMessage(
      req.user.sub,
      sendMessageDto.message,
    );

    return {
      success: true,
      data: chatMessage,
      message: 'Message processed successfully',
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get chat history' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Chat history retrieved successfully',
  })
  async getChatHistory(@Request() req, @Query('limit') limit: number = 10) {
    const history = await this.chatbotService.getChatHistory(
      req.user.sub,
      Number(limit),
    );

    return {
      success: true,
      data: history,
      count: history.length,
    };
  }

  @Delete('history')
  @ApiOperation({ summary: 'Clear chat history' })
  @ApiResponse({
    status: 200,
    description: 'Chat history cleared successfully',
  })
  async clearChatHistory(@Request() req) {
    const success = await this.chatbotService.clearChatHistory(req.user.sub);

    return {
      success,
      message: success
        ? 'Chat history cleared successfully'
        : 'No chat history found',
    };
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get user music preferences learned from chat' })
  @ApiResponse({
    status: 200,
    description: 'User preferences retrieved successfully',
  })
  async getUserPreferences(@Request() req) {
    const preferences = this.chatbotService.getUserPreferences(req.user.sub);

    return {
      success: true,
      data: preferences,
    };
  }

  @Post('quick-actions/recommend')
  @ApiOperation({ summary: 'Quick music recommendation' })
  @ApiResponse({ status: 200, description: 'Quick recommendation generated' })
  async quickRecommendation(@Request() req) {
    const chatMessage = await this.chatbotService.sendMessage(
      req.user.sub,
      'Recommend some music for me',
    );

    return {
      success: true,
      data: chatMessage,
      message: 'Quick recommendation generated',
    };
  }

  @Post('quick-actions/popular')
  @ApiOperation({ summary: 'Get popular music' })
  @ApiResponse({ status: 200, description: 'Popular music retrieved' })
  async getPopularMusic(@Request() req) {
    const chatMessage = await this.chatbotService.sendMessage(
      req.user.sub,
      'Show me popular music',
    );

    return {
      success: true,
      data: chatMessage,
      message: 'Popular music retrieved',
    };
  }

  @Post('quick-actions/new-releases')
  @ApiOperation({ summary: 'Get new releases' })
  @ApiResponse({ status: 200, description: 'New releases retrieved' })
  async getNewReleases(@Request() req) {
    const chatMessage = await this.chatbotService.sendMessage(
      req.user.sub,
      'Show me new releases',
    );

    return {
      success: true,
      data: chatMessage,
      message: 'New releases retrieved',
    };
  }

  @Post('quick-actions/mood/:mood')
  @ApiOperation({ summary: 'Get music by mood' })
  @ApiResponse({ status: 200, description: 'Mood-based music retrieved' })
  async getMoodMusic(@Request() req, @Query('mood') mood: string) {
    const validMoods = [
      'happy',
      'sad',
      'energetic',
      'calm',
      'romantic',
      'angry',
    ];
    const selectedMood = validMoods.includes(mood) ? mood : 'happy';

    const chatMessage = await this.chatbotService.sendMessage(
      req.user.sub,
      `I'm feeling ${selectedMood}`,
    );

    return {
      success: true,
      data: chatMessage,
      message: `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} music retrieved`,
    };
  }

  @Get('help')
  @ApiOperation({ summary: 'Get chatbot help information' })
  @ApiResponse({ status: 200, description: 'Help information retrieved' })
  async getHelp(@Request() req) {
    const chatMessage = await this.chatbotService.sendMessage(
      req.user.sub,
      'help',
    );

    return {
      success: true,
      data: chatMessage,
      message: 'Help information retrieved',
    };
  }

  @Get('status')
  @ApiOperation({ summary: 'Get chatbot status and capabilities' })
  @ApiResponse({ status: 200, description: 'Chatbot status retrieved' })
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
}
