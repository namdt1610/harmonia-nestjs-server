import { Test, TestingModule } from '@nestjs/testing';
import { StreamQueueController } from './stream-queue.controller';

describe('StreamQueueController', () => {
  let controller: StreamQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreamQueueController],
    }).compile();

    controller = module.get<StreamQueueController>(StreamQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
