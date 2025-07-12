import { Test, TestingModule } from '@nestjs/testing';
import { BungalowService } from './bungalow.service';

describe('BungalowService', () => {
  let service: BungalowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BungalowService],
    }).compile();

    service = module.get<BungalowService>(BungalowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
