import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Harmonia API')
    .setDescription(
      'The Harmonia music streaming API - Complete backend for music streaming platform',
    )
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

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
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
