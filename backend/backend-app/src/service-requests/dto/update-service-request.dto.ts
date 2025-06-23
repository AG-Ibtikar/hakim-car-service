import { IsString, IsOptional, IsObject, IsNumber, IsUUID, IsDate, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceRequestDto } from './create-service-request.dto';
import { ServiceCategory, ServiceRequestStatus } from '@prisma/client';

export class UpdateServiceRequestDto extends PartialType(CreateServiceRequestDto) {
  @IsEnum(ServiceRequestStatus)
  @IsOptional()
  status?: ServiceRequestStatus;

  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @IsEnum(ServiceCategory)
  @IsOptional()
  serviceType?: ServiceCategory;

  @IsObject()
  @IsOptional()
  location?: {
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

  @IsString()
  @IsOptional()
  assignedToId?: string;
} 