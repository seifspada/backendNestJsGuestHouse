import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUsageService } from './service-usage.service';

describe('ServiceUsageService', () => {
  let service: ServiceUsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceUsageService],
    }).compile();

    service = module.get<ServiceUsageService>(ServiceUsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
