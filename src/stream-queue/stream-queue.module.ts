import { Module } from '@nestjs/common';
import { StreamQueueService } from './stream-queue.service';
import { StreamQueueController } from './stream-queue.controller';
import { StreamQueueRepository } from './stream-queue.repository';
import { PrismaModule } from '../common/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StreamQueueController],
  providers: [StreamQueueService, StreamQueueRepository],
  exports: [StreamQueueService, StreamQueueRepository],
})
export class StreamQueueModule {}
