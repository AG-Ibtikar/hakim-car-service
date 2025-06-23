import { IsString, IsObject, IsNumber, IsDate, IsEnum } from 'class-validator';
import { ServiceCategory } from '@prisma/client';

export class CreateServiceRequestDto {
  @IsString()
  userId: string;

  @IsString()
  vehicleId: string;

  @IsEnum(ServiceCategory)
  serviceType: ServiceCategory;

  @IsObject()
  location: any;

  @IsString()
  description: string;

  @IsNumber()
  estimatedCost: number;

  @IsDate()
  scheduledTime: Date;

  @IsString()
  customerName: string;

  @IsString()
  customerPhone: string;

  @IsString()
  vehicleType: string;

  @IsString()
  make: string;

  @IsString()
  model: string;
} 