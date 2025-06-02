import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../enums/user-role.enum';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/customer')
  @HttpCode(HttpStatus.CREATED)
  async customerRegister(@Body() registerDto: RegisterDto) {
    return this.authService.register({
      ...registerDto,
      role: UserRole.CUSTOMER,
    });
  }

  @Post('register/technician')
  @HttpCode(HttpStatus.CREATED)
  async technicianRegister(@Body() registerDto: RegisterDto) {
    return this.authService.register({
      ...registerDto,
      role: UserRole.STAFF,
    });
  }

  @Post('login/customer')
  @HttpCode(HttpStatus.OK)
  async customerLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, UserRole.CUSTOMER);
  }

  @Post('login/technician')
  @HttpCode(HttpStatus.OK)
  async technicianLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, UserRole.STAFF);
  }

  @Post('login/admin')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, UserRole.ADMIN);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
} 