import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { VehicleType } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto, user: any): Promise<any> {
    return this.prisma.vehicle.create({
      data: {
        type: createVehicleDto.type,
        make: createVehicleDto.make,
        model: createVehicleDto.model,
        year: createVehicleDto.year,
        licensePlate: createVehicleDto.licensePlate,
        vin: createVehicleDto.vin || null,
        vinImage: createVehicleDto.vinImage || null,
        userId: user.id,
      },
    });
  }

  async createForUser(createVehicleDto: CreateVehicleDto, userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.vehicle.create({
      data: {
        type: createVehicleDto.type,
        make: createVehicleDto.make,
        model: createVehicleDto.model,
        year: createVehicleDto.year,
        licensePlate: createVehicleDto.licensePlate,
        vin: createVehicleDto.vin || null,
        vinImage: createVehicleDto.vinImage || null,
        userId,
      },
    });
  }

  async findAllByUser(userId: string): Promise<any[]> {
    return this.prisma.vehicle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<any> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id, userId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async update(id: string, updateVehicleDto: CreateVehicleDto, userId: string): Promise<any> {
    await this.findOne(id, userId);
    
    return this.prisma.vehicle.update({
      where: { id },
      data: {
        type: updateVehicleDto.type,
        make: updateVehicleDto.make,
        model: updateVehicleDto.model,
        year: updateVehicleDto.year,
        licensePlate: updateVehicleDto.licensePlate,
        vin: updateVehicleDto.vin || null,
        vinImage: updateVehicleDto.vinImage || null,
      },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    await this.prisma.vehicle.delete({
      where: { id },
    });
  }
} 