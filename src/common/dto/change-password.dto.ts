import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ 
    description: 'Current password for verification', 
    example: 'currentPassword123',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Current password must be at least 6 characters long' })
  currentPassword: string;

  @ApiProperty({ 
    description: 'New password', 
    example: 'newPassword123',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword: string;

  @ApiProperty({ 
    description: 'Confirm new password', 
    example: 'newPassword123',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Confirm password must be at least 6 characters long' })
  confirmPassword: string;
}
