import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class SetUniversityEmailDto {
  @ApiProperty({ 
    description: 'University email address for sending invitations',
    example: 'university@harvard.edu'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SendInvitationDto {
  @ApiProperty({ 
    description: 'Ambassador name',
    example: 'John Doe'
  })
  @IsString()
  @IsNotEmpty()
  ambassadorName: string;

  @ApiProperty({ 
    description: 'Ambassador email address',
    example: 'ambassador@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  ambassadorEmail: string;

  @ApiProperty({ 
    description: 'University name (optional, defaults to user name)',
    example: 'Harvard University',
    required: false
  })
  @IsString()
  @IsOptional()
  universityName?: string;
}

export class EmailResponseDto {
  @ApiProperty({ 
    description: 'Whether the operation was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({ 
    description: 'Response message',
    example: 'Email set successfully'
  })
  message: string;

  @ApiProperty({ 
    description: 'University email address',
    example: 'university@harvard.edu',
    required: false
  })
  email?: string;
}

export class InvitationResponseDto {
  @ApiProperty({ 
    description: 'Whether the invitation was sent successfully',
    example: true
  })
  success: boolean;

  @ApiProperty({ 
    description: 'Response message',
    example: 'Invitation sent successfully to ambassador@example.com'
  })
  message: string;

  @ApiProperty({ 
    description: 'Sent to email address',
    example: 'ambassador@example.com'
  })
  sentTo: string;
}
