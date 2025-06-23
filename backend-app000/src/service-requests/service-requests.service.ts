import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequestStatus, ServiceCategory, Prisma } from '@prisma/client';

@Injectable()
export class ServiceRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceRequestDto: CreateServiceRequestDto) {
    const data: Prisma.ServiceRequestCreateInput = {
      serviceType: createServiceRequestDto.serviceType as ServiceCategory,
      location: JSON.stringify(createServiceRequestDto.location),
      description: createServiceRequestDto.description,
      estimatedCost: createServiceRequestDto.estimatedCost,
      scheduledTime: createServiceRequestDto.scheduledTime,
      status: ServiceRequestStatus.PENDING,
      customerName: createServiceRequestDto.customerName,
      customerPhone: createServiceRequestDto.customerPhone,
      vehicleType: createServiceRequestDto.vehicleType,
      make: createServiceRequestDto.make,
      model: createServiceRequestDto.model,
      user: {
        connect: {
          id: createServiceRequestDto.userId
        }
      }
    };

    return this.prisma.serviceRequest.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
  }

  async findAll() {
    return this.prisma.serviceRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
  }

  async findOne(id: string) {
    const serviceRequest = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!serviceRequest) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }

    return serviceRequest;
  }

  async update(id: string, updateServiceRequestDto: UpdateServiceRequestDto) {
    const data: Prisma.ServiceRequestUpdateInput = {
      ...updateServiceRequestDto,
      location: updateServiceRequestDto.location ? JSON.stringify(updateServiceRequestDto.location) : undefined,
      serviceType: updateServiceRequestDto.serviceType as ServiceCategory,
      status: updateServiceRequestDto.status as ServiceRequestStatus
    };

    return this.prisma.serviceRequest.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
  }

  async remove(id: string) {
    return this.prisma.serviceRequest.delete({
      where: { id }
    });
  }
} 