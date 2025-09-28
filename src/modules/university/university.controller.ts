import { Controller, Post, Body, ValidationPipe, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../../common/auth/auth.service';
import { SignupDto } from '../../common/dto/signup.dto';
import { UserRole } from '@prisma/client';
import { LoginDto } from '../../common/dto/login.dto';
import { AuthResponseDto } from '../../common/dto/auth-response.dto';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { User } from '../../common/interfaces/user.interface';

@ApiTags('University')
@Controller('university')
export class UniversityController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up as a University' })
  @ApiResponse({
    status: 201,
    description: 'University successfully registered',
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
    // Ensure the role is set to university
    const universitySignupDto = { ...signupDto, role: UserRole.university };
    return this.authService.signup(universitySignupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login as a University' })
  @ApiResponse({
    status: 200,
    description: 'University successfully logged in',
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
    // Ensure the role is set to university
    const universityLoginDto = { ...loginDto, role: UserRole.university };
    return this.authService.login(universityLoginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get University profile' })
  @ApiResponse({
    status: 200,
    description: 'University profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getProfile(@Body() user: any) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      university: user.university,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
