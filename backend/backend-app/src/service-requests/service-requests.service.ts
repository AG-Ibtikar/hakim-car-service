import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequestStatus, ServiceCategory, Prisma } from '@prisma/client';

@Injectable()
export class ServiceRequestsService {
  constructor(private prisma: PrismaService) {}

  async createGuestRequest(createServiceRequestDto: CreateServiceRequestDto) {
    try {
      console.log('Creating guest request with data:', createServiceRequestDto);
      
    const data: Prisma.ServiceRequestCreateInput = {
      serviceType: createServiceRequestDto.serviceType as ServiceCategory,
        location: createServiceRequestDto.location as unknown as Prisma.JsonValue,
      description: createServiceRequestDto.description,
      status: ServiceRequestStatus.PENDING,
      customerName: createServiceRequestDto.customerName,
      customerPhone: createServiceRequestDto.customerPhone,
      vehicleType: createServiceRequestDto.vehicleType,
      make: createServiceRequestDto.make,
      model: createServiceRequestDto.model,
    };

      console.log('Processed data for Prisma:', data);

      const result = await this.prisma.serviceRequest.create({
      data,
    });

      console.log('Created service request:', result);
      return result;
    } catch (error) {
      console.error('Error creating guest request:', error);
      throw error;
    }
  }

  async create(createServiceRequestDto: CreateServiceRequestDto) {
    // Get user's city if userId is provided
    let userCity = null;
    if (createServiceRequestDto.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: createServiceRequestDto.userId },
        select: { city: true }
      });
      userCity = user?.city;
    }

    // Prepare location data with city
    const locationData = {
      ...createServiceRequestDto.location,
      city: createServiceRequestDto.location.city || userCity || ''
    };

    const data: Prisma.ServiceRequestCreateInput = {
      serviceType: createServiceRequestDto.serviceType as ServiceCategory,
      location: locationData,
      description: createServiceRequestDto.description,
      estimatedCost: createServiceRequestDto.estimatedCost,
      scheduledTime: createServiceRequestDto.scheduledTime,
      status: ServiceRequestStatus.PENDING,
      user: {
        connect: { id: createServiceRequestDto.userId }
      },
      ...(createServiceRequestDto.vehicleId && {
        vehicle: {
          connect: { id: createServiceRequestDto.vehicleId }
        }
      })
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
            phoneNumber: true,
            city: true
          }
        },
        vehicle: true
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
            firstName: true,
            lastName: true,
            phoneNumber: true,
            city: true
          }
        },
        vehicle: true
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
            firstName: true,
            lastName: true,
            phoneNumber: true,
            city: true
          }
        },
        vehicle: true
      }
    });

    if (!serviceRequest) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }

    return serviceRequest;
  }

  async findByUser(userId: string) {
    return this.prisma.serviceRequest.findMany({
      where: {
        userId: userId
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            city: true
          }
        },
        vehicle: true
      }
    });
  }

  async update(id: string, updateServiceRequestDto: UpdateServiceRequestDto) {
    const data: Prisma.ServiceRequestUpdateInput = {
      ...updateServiceRequestDto,
      status: updateServiceRequestDto.status ? updateServiceRequestDto.status : undefined,
      location: updateServiceRequestDto.location ? JSON.stringify(updateServiceRequestDto.location) : undefined,
      serviceType: updateServiceRequestDto.serviceType ? updateServiceRequestDto.serviceType : undefined
    };

    try {
      return await this.prisma.serviceRequest.update({
        where: { id },
        data,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              city: true
            }
          },
          vehicle: true
        }
      });
    } catch (error) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.serviceRequest.delete({
        where: { id }
      });
    } catch (error) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }
  }

  // Admin methods
  async findAllForAdmin() {
    return this.prisma.serviceRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            city: true
          }
        },
        vehicle: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async updateStatus(id: string, status: string) {
    try {
      return await this.prisma.serviceRequest.update({
        where: { id },
        data: {
          status: status as ServiceRequestStatus
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              city: true
            }
          },
          vehicle: true
        }
      });
    } catch (error) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }
  }
} 