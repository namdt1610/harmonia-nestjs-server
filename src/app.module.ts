import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { GenresModule } from './genres/genres.module';
import { SubscriptionPlansModule } from './subscription-plans/subscription-plans.module';
import { FavoritesModule } from './favorites/favorites.module';
import { SearchModule } from './search/search.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { StreamQueueModule } from './stream-queue/stream-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(
          'MONGODB_URI',
          'mongodb://localhost:27017/harmonia',
        ),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/media',
    }),
    AuthModule,
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    PlaylistsModule,
    GenresModule,
    SubscriptionPlansModule,
    FavoritesModule,
    SearchModule,
    AnalyticsModule,
    ChatbotModule,
    StreamQueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
