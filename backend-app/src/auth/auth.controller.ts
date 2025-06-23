import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/customer')
  async loginCustomer(@Body() loginDto: { email: string; password: string }) {
    try {
      const result = await this.authService.validateCustomer(loginDto.email, loginDto.password);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
} 