import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { VerifyPasswordDto } from '../dto/verify-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up as Ambassador or University' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists or passwords do not match',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async signup(@Body(ValidationPipe) signupDto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login as Ambassador or University' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async login(@Body(ValidationPipe) loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getProfile(@Request() req) {
    const user = req.user;
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      university: user.university,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  @Post('verify-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify current password' })
  @ApiResponse({
    status: 200,
    description: 'Password verification result',
    schema: {
      type: 'object',
      properties: {
        isValid: {
          type: 'boolean',
          description: 'Whether the current password is valid'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid password',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async verifyPassword(@Request() req, @Body(ValidationPipe) verifyPasswordDto: VerifyPasswordDto) {
    return this.authService.verifyPassword(req.user.id, verifyPasswordDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Password changed successfully'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or current password is incorrect',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or passwords do not match',
  })
  async changePassword(@Request() req, @Body(ValidationPipe) changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }

}
