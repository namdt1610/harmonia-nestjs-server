"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Harmonia API')
        .setDescription('The Harmonia music streaming API - Complete backend for music streaming platform')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Authentication', 'User authentication and authorization')
        .addTag('Users', 'User management and profiles')
        .addTag('Tracks', 'Music track management and streaming')
        .addTag('Artists', 'Artist management and information')
        .addTag('Albums', 'Album management and track collections')
        .addTag('Playlists', 'User playlists and collaboration')
        .addTag('Genres', 'Music genres and categorization')
        .addTag('Subscriptions', 'Subscription plans and management')
        .addTag('Favorites', 'User favorites and liked content')
        .addTag('Search', 'Advanced search across all content')
        .addTag('Analytics', 'Platform analytics and user insights')
        .addTag('Payments', 'Stripe payment processing')
        .addTag('Notifications', 'Real-time notifications and email alerts')
        .addTag('Stream Queue', 'Music playback queue management')
        .addTag('Chatbot', 'AI-powered music assistant')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'Harmonia API Documentation',
        customfavIcon: '/favicon.ico',
        customCss: '.swagger-ui .topbar { display: none }',
    });
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
    console.log(`🎵 Harmonia Music Streaming Backend - Ready to Rock! 🎸`);
    console.log(`\n📋 Available Features:`);
    console.log(`   ✅ User Authentication & Authorization`);
    console.log(`   ✅ Music Tracks, Artists, Albums Management`);
    console.log(`   ✅ Playlists & Favorites`);
    console.log(`   ✅ Advanced Search & Genres`);
    console.log(`   ✅ Subscription Plans & Stripe Payments`);
    console.log(`   ✅ Real-time Notifications & Email Alerts`);
    console.log(`   ✅ Stream Queue Management with WebSocket`);
    console.log(`   ✅ AI-Powered Music Chatbot`);
    console.log(`   ✅ Comprehensive Analytics Dashboard`);
    console.log(`   ✅ File Upload Support`);
    console.log(`   ✅ RESTful API with Swagger Documentation`);
}
bootstrap();
//# sourceMappingURL=main.js.map