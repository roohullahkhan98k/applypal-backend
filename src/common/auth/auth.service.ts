import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserPayload } from '../interfaces/user.interface';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { VerifyPasswordDto } from '../dto/verify-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

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

    // If this is an ambassador signup, check if they were invited and update status
    if (role === 'ambassador') {
      try {
        // First check if they have any ACCEPTED invitations and update to JOINED
        const acceptedInvitations = await this.prisma.invitedAmbassador.findMany({
          where: { 
            ambassadorEmail: email,
            status: 'ACCEPTED'
          }
        });

        if (acceptedInvitations.length > 0) {
          await this.prisma.invitedAmbassador.updateMany({
            where: { 
              ambassadorEmail: email,
              status: 'ACCEPTED'
            },
            data: {
              status: 'JOINED',
              respondedAt: new Date()
            }
          });
          this.logger.log(`📝 Updated invitation status to JOINED for ${email}`);
        } else {
          // If no ACCEPTED invitations, check for INVITED and update to ACCEPTED
          await this.prisma.invitedAmbassador.updateMany({
            where: { 
              ambassadorEmail: email,
              status: 'INVITED'
            },
            data: {
              status: 'ACCEPTED',
              respondedAt: new Date()
            }
          });
          this.logger.log(`📝 Updated invitation status to ACCEPTED for ${email}`);
        }
      } catch (error) {
        this.logger.warn(`⚠️ Could not update invitation status for ${email}: ${error.message}`);
      }
    }

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

  async verifyPassword(userId: string, verifyPasswordDto: VerifyPasswordDto): Promise<{ isValid: boolean }> {
    const { currentPassword } = verifyPasswordDto;

    // Get user from database
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    
    return { isValid: isPasswordValid };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    // Check if new password is different from current password
    if (currentPassword === newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    // Get user from database
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashedNewPassword,
      },
    });

    return { message: 'Password changed successfully' };
  }

}
