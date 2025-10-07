import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserPayload } from '../interfaces/user.interface';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const { fullName, email, university, password, confirmPassword, role } = signupDto;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new ConflictException('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      const roleText = existingUser.role === 'ambassador' ? 'Ambassador' : 'University';
      throw new ConflictException(`This email is already registered as a ${roleText}. Please use a different email or login with your existing account.`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user using Prisma
    const newUser = await this.prisma.user.create({
      data: {
        fullName,
        email,
        university,
        passwordHash: hashedPassword,
        role: role as any,
      },
    });

    // Generate JWT token
    const payload: UserPayload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role as any,
      fullName: newUser.fullName,
      university: newUser.university,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        university: newUser.university,
        role: newUser.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password, role } = loginDto;

    // First check if user exists with this email
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the role matches
    if (existingUser.role !== role) {
      const currentRoleText = existingUser.role === 'ambassador' ? 'Ambassador' : 'University';
      const requestedRoleText = role === 'ambassador' ? 'Ambassador' : 'University';
      throw new UnauthorizedException(`This email is registered as a ${currentRoleText}, not as a ${requestedRoleText}. Please login with the correct role.`);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload: UserPayload = {
      sub: existingUser.id,
      email: existingUser.email,
      role: existingUser.role as any,
      fullName: existingUser.fullName,
      university: existingUser.university,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: existingUser.id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        university: existingUser.university,
        role: existingUser.role,
      },
    };
  }

  async validateUser(payload: UserPayload): Promise<any | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    return user || null;
  }

}
