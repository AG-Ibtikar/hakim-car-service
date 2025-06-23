import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/customer')
  async registerCustomer(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register({
        ...registerDto,
        role: 'CUSTOMER',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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