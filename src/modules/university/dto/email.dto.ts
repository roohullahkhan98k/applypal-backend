import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

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

export class AmbassadorDto {
  @ApiProperty({ 
    description: 'Ambassador name',
    example: 'John Doe'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Ambassador email',
    example: 'john@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class BulkInvitationDto {
  @ApiProperty({ 
    description: 'List of ambassadors to invite',
    example: [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' }
    ],
    type: [AmbassadorDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AmbassadorDto)
  ambassadors: AmbassadorDto[];

  @ApiProperty({ 
    description: 'University name (optional)',
    example: 'Harvard University',
    required: false
  })
  @IsOptional()
  @IsString()
  universityName?: string;
}

export class BulkInvitationResponseDto {
  @ApiProperty({ 
    description: 'Whether the bulk operation was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({ 
    description: 'Response message',
    example: 'Bulk invitations sent successfully'
  })
  message: string;

  @ApiProperty({ 
    description: 'Total invitations sent',
    example: 5
  })
  totalSent: number;

  @ApiProperty({ 
    description: 'Total invitations failed',
    example: 1
  })
  totalFailed: number;

  @ApiProperty({ 
    description: 'Details of each invitation',
    example: [
      { name: 'John Doe', email: 'john@example.com', success: true },
      { name: 'Jane Smith', email: 'jane@example.com', success: false, error: 'Invalid email' }
    ]
  })
  results: {
    name: string;
    email: string;
    success: boolean;
    error?: string;
  }[];
}
