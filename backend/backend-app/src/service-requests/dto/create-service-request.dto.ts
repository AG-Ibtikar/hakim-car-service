import { IsString, IsOptional, IsNumber, IsDate, IsEnum, IsObject } from 'class-validator';
import { ServiceCategory } from '@prisma/client';

export class LocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  address: string;

  [key: string]: any; // Add index signature to match Prisma's JSON type
}

export class CreateServiceRequestDto {
  @IsEnum(ServiceCategory)
  serviceType: ServiceCategory;

  @IsObject()
  location: LocationDto;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @IsDate()
  @IsOptional()
  scheduledTime?: Date;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  vehicleId?: string;

  // Guest request fields
  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsString()
  @IsOptional()
  vehicleType?: string;

  @IsString()
  @IsOptional()
  make?: string;

  @IsString()
  @IsOptional()
  model?: string;
} 