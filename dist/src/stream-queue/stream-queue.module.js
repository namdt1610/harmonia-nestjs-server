"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamQueueModule = void 0;
const common_1 = require("@nestjs/common");
const stream_queue_service_1 = require("./stream-queue.service");
const stream_queue_controller_1 = require("./stream-queue.controller");
const stream_queue_repository_1 = require("./stream-queue.repository");
const prisma_module_1 = require("../common/prisma.module");
let StreamQueueModule = class StreamQueueModule {
};
exports.StreamQueueModule = StreamQueueModule;
exports.StreamQueueModule = StreamQueueModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [stream_queue_controller_1.StreamQueueController],
        providers: [stream_queue_service_1.StreamQueueService, stream_queue_repository_1.StreamQueueRepository],
        exports: [stream_queue_service_1.StreamQueueService, stream_queue_repository_1.StreamQueueRepository],
    })
], StreamQueueModule);
//# sourceMappingURL=stream-queue.module.js.map