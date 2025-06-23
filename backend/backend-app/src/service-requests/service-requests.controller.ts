import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: {
    id: string;
    email: string;
  };
}

@Controller('service-requests')
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  @Post('guest')
  createGuestRequest(@Body() createServiceRequestDto: CreateServiceRequestDto) {
    return this.serviceRequestsService.createGuestRequest(createServiceRequestDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createServiceRequestDto: CreateServiceRequestDto, @Request() req: RequestWithUser) {
    return this.serviceRequestsService.create({
      ...createServiceRequestDto,
      userId: req.user.id,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.serviceRequestsService.findAll();
  }

  @Get('my-requests')
  @UseGuards(JwtAuthGuard)
  findMyRequests(@Request() req: RequestWithUser) {
    return this.serviceRequestsService.findByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.serviceRequestsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateServiceRequestDto: UpdateServiceRequestDto) {
    return this.serviceRequestsService.update(id, updateServiceRequestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.serviceRequestsService.remove(id);
  }
} 