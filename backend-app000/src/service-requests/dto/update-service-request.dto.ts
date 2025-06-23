import { IsString, IsOptional, IsObject, IsNumber, IsUUID, IsDate, IsEnum } from 'class-validator';
import { ServiceCategory, ServiceRequestStatus } from '@prisma/client';

export class UpdateServiceRequestDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsEnum(ServiceCategory)
  serviceType?: ServiceCategory;

  @IsOptional()
  @IsObject()
  location?: any;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ServiceRequestStatus)
  status?: ServiceRequestStatus;

  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @IsOptional()
  @IsDate()
  scheduledTime?: Date;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  vehicleType?: string;

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;
} 