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
      model: createServiceRequestDto.model
    };

    return this.prisma.serviceRequest.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true
          }
        }
      }
    });
  }

  // ... rest of the service methods ...
} 