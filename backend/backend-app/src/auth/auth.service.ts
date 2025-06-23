import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, phoneNumber, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

      if (existingUser) {
      throw new UnauthorizedException('Email already registered');
      }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
      password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        role,
      },
    });

    // Generate JWT token
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async validateUser(email: string, password: string, role: UserRole) {
    console.log('Validating user:', { email, role });
    
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    console.log('Found user:', user ? { ...user, password: '[REDACTED]' } : null);
    
    if (!user || user.role !== role) {
      console.log('User validation failed:', { 
        userExists: !!user, 
        userRole: user?.role, 
        expectedRole: role 
      });
      throw new UnauthorizedException('Invalid credentials or role');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation:', { isPasswordValid });
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto, role: UserRole) {
    console.log('Login attempt:', { email: loginDto.email, role });
    
    const user = await this.validateUser(loginDto.email, loginDto.password, role);
    console.log('User validated successfully:', { id: user.id, email: user.email, role: user.role });
    
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    console.log('Generated token:', token);

    return {
      access_token: token,
      user,
    };
  }

  async verifyAdmin(user: any) {
    console.log('Verifying admin:', user);
    
    if (!user || user.role !== UserRole.ADMIN) {
      console.log('Admin verification failed:', { 
        userExists: !!user, 
        userRole: user?.role 
      });
      throw new ForbiddenException('Not authorized to access admin features');
    }
    
    console.log('Admin verification successful');
    return { isAdmin: true };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      return user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 