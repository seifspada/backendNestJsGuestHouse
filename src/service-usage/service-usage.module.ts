// service-usage.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceUsage, ServiceUsageSchema } from './schemas/service-usage.schema';
import { ServiceUsageService } from './service-usage.service';
import { ServiceUsageController } from './service-usage.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceUsage.name, schema: ServiceUsageSchema },
    ]),AuthModule
  ],
  controllers: [ServiceUsageController],
  providers: [ServiceUsageService],
})
export class ServiceUsageModule {}
