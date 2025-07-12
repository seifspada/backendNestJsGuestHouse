import { Test, TestingModule } from '@nestjs/testing';
import { BungalowController } from './bungalow.controller';
import { BungalowService } from './bungalow.service';

describe('BungalowController', () => {
  let controller: BungalowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BungalowController],
      providers: [BungalowService],
    }).compile();

    controller = module.get<BungalowController>(BungalowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
