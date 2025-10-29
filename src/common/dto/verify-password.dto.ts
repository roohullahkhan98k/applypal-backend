import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class VerifyPasswordDto {
  @ApiProperty({ 
    description: 'Current password for verification', 
    example: 'currentPassword123',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  currentPassword: string;
}
