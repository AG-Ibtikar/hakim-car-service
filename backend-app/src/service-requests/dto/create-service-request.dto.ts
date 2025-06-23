import { IsString, IsOptional, IsObject, IsNumber, IsUUID, IsDate, IsEnum } from 'class-validator';
import { ServiceCategory } from '@prisma/client';

export class CreateServiceRequestDto {
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

  @IsEnum(ServiceCategory)
  serviceType: ServiceCategory;

  @IsObject()
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @IsDate()
  @IsOptional()
  scheduledTime?: Date;
} 