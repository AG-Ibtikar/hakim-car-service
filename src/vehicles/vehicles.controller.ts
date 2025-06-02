import { Controller, Get, Post, Put, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
    return this.vehiclesService.create(createVehicleDto, req.user);
  }

  @Post('user/:userId')
  createForUser(@Param('userId') userId: string, @Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.createForUser(createVehicleDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.vehiclesService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.vehiclesService.findOne(id, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateVehicleDto: CreateVehicleDto, @Request() req) {
    return this.vehiclesService.update(id, updateVehicleDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.vehiclesService.remove(id, req.user.id);
  }
} 