import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './interfaces/service.interface';
import { Service as ServiceSchema } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(@InjectModel(ServiceSchema.name) private serviceModel: Model<ServiceSchema>) {}

  private toService(document: ServiceSchema): Service {
    const { _id, __v, ...rest } = document.toObject();
    return { id: _id.toString(), ...rest } as Service;
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const createdService = new this.serviceModel(createServiceDto);
    const savedService = await createdService.save();
    return this.toService(savedService);
  }

  async findAll(): Promise<Service[]> {
    const services = await this.serviceModel.find().exec();
    return services.map((service) => this.toService(service));
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceModel.findById(id).exec();
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return this.toService(service);
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const updatedService = await this.serviceModel
      .findByIdAndUpdate(id, updateServiceDto, { new: true })
      .exec();
    if (!updatedService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return this.toService(updatedService);
  }

  async remove(id: string): Promise<void> {
    const result = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }
}