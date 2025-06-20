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
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const schedule_1 = require("@nestjs/schedule");
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
const payments_module_1 = require("./payments/payments.module");
const notifications_module_1 = require("./notifications/notifications.module");
const prisma_module_1 = require("./common/prisma.module");
const websocket_gateway_1 = require("./common/websocket.gateway");
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
            prisma_module_1.PrismaModule,
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            schedule_1.ScheduleModule.forRoot(),
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
            payments_module_1.PaymentsModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, websocket_gateway_1.WebSocketGateway],
        exports: [websocket_gateway_1.WebSocketGateway],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map