import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    // TODO: Replace with actual database query
    // This is a mock implementation
    const mockUser = {
      id: 1,
      email: registerDto.email,
      password: await bcrypt.hash(registerDto.password, 10),
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phoneNumber: registerDto.phoneNumber,
      role: 'CUSTOMER',
    };

    const payload = { sub: mockUser.id, email: mockUser.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        phoneNumber: mockUser.phoneNumber,
        role: mockUser.role,
      },
    };
  }

  async validateCustomer(email: string, password: string) {
    // TODO: Replace with actual database query
    // This is a mock implementation
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test User',
    };

    const isPasswordValid = await bcrypt.compare(password, mockUser.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: mockUser.id, email: mockUser.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      },
    };
  }
} 