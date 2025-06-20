"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const tracks_module_1 = require("./tracks/tracks.module");
const artists_module_1 = require("./artists/artists.module");
const albums_module_1 = require("./albums/albums.module");
const playlists_module_1 = require("./playlists/playlists.module");
const genres_module_1 = require("./genres/genres.module");
const subscription_plans_module_1 = require("./subscription-plans/subscription-plans.module");
const favorites_module_1 = require("./favorites/favorites.module");
const search_module_1 = require("./search/search.module");
const analytics_module_1 = require("./analytics/analytics.module");
const chatbot_module_1 = require("./chatbot/chatbot.module");
const stream_queue_module_1 = require("./stream-queue/stream-queue.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'password'),
                    database: configService.get('DB_DATABASE', 'harmonia'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/media',
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            tracks_module_1.TracksModule,
            artists_module_1.ArtistsModule,
            albums_module_1.AlbumsModule,
            playlists_module_1.PlaylistsModule,
            genres_module_1.GenresModule,
            subscription_plans_module_1.SubscriptionPlansModule,
            favorites_module_1.FavoritesModule,
            search_module_1.SearchModule,
            analytics_module_1.AnalyticsModule,
            chatbot_module_1.ChatbotModule,
            stream_queue_module_1.StreamQueueModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map