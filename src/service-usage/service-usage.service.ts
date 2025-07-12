// service-usage.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceUsage } from './schemas/service-usage.schema';
import { CreateServiceUsageDto } from './dto/create-service-usage.dto';

@Injectable()
export class ServiceUsageService {
  constructor(
    @InjectModel(ServiceUsage.name)
    private usageModel: Model<ServiceUsage>,
  ) {}

  async create(dto: CreateServiceUsageDto): Promise<ServiceUsage> {
    const usage = new this.usageModel(dto);
    return usage.save();
  }

  async findAllByUser(userId: string): Promise<ServiceUsage[]> {
    return this.usageModel.find({ user: userId }).populate('service responsable');
  }

  async findAll(): Promise<ServiceUsage[]> {
    return this.usageModel.find().populate('user responsable service');
  }
}
