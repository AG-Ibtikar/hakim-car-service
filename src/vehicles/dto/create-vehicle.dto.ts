import { IsString, IsNumber, IsOptional, Min, Max, IsEnum } from 'class-validator';

export enum VehicleType {
  SEDAN = 'Sedan',
  SUV = 'SUV',
  TRUCK = 'Truck',
  VAN = 'Van',
  SPORTS_CAR = 'Sports Car',
  LUXURY = 'Luxury',
  HYBRID = 'Hybrid',
  ELECTRIC = 'Electric'
}

export class CreateVehicleDto {
  @IsEnum(VehicleType)
  type: VehicleType;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsString()
  licensePlate: string;

  @IsString()
  @IsOptional()
  vin?: string;
} 