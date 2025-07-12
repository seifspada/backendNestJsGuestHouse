import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUsageController } from './service-usage.controller';
import { ServiceUsageService } from './service-usage.service';

describe('ServiceUsageController', () => {
  let controller: ServiceUsageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceUsageController],
      providers: [ServiceUsageService],
    }).compile();

    controller = module.get<ServiceUsageController>(ServiceUsageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
