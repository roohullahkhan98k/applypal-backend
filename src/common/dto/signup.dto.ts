import { IsEmail, IsString, MinLength, IsEnum, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class SignupDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  fullName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'University name',
    example: 'Harvard University',
  })
  @IsString()
  @MinLength(2, { message: 'University name must be at least 2 characters long' })
  university: string;

  @ApiProperty({
    description: 'Password',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @ApiProperty({
    description: 'Confirm password',
    example: 'SecurePassword123!',
  })
  @IsString()
  confirmPassword: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.ambassador,
  })
  @IsEnum(UserRole, { message: 'Role must be either ambassador or university' })
  role: UserRole;
}
