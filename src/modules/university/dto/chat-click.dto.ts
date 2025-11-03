import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ChatClickDto {
  @ApiProperty({ 
    description: 'Widget ID that was clicked',
    example: 'abc123-def456-ghi789'
  })
  @IsString()
  @IsNotEmpty()
  widgetId: string;

  @ApiProperty({ 
    description: 'Domain where the click occurred',
    example: 'example.com'
  })
  @IsString()
  @IsNotEmpty()
  domain: string;

  @ApiProperty({ 
    description: 'User agent string',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  })
  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @ApiProperty({ 
    description: 'Timestamp when the click occurred',
    example: '2025-01-08T10:30:45.123Z'
  })
  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @ApiProperty({ 
    description: 'Ambassador ID if user selected an ambassador',
    example: 'ambassador-abc123',
    required: false
  })
  @IsString()
  @IsOptional()
  ambassadorId?: string;

  @ApiProperty({ 
    description: 'Ambassador name if user selected an ambassador',
    example: 'John Doe',
    required: false
  })
  @IsString()
  @IsOptional()
  ambassadorName?: string;

}

export class ChatClickResponseDto {
  @ApiProperty({ 
    description: 'Whether the click was recorded successfully',
    example: true
  })
  success: boolean;

  @ApiProperty({ 
    description: 'Response message',
    example: 'Chat click recorded successfully'
  })
  message: string;

  @ApiProperty({ 
    description: 'Click ID if successfully recorded',
    example: 'click-abc123-def456',
    required: false
  })
  clickId?: string;
}

export class ChatClickAnswersDto {
  @ApiProperty({ 
    description: 'Click ID from the initial chat click',
    example: 'click-abc123-def456'
  })
  @IsString()
  @IsNotEmpty()
  clickId: string;

  @ApiProperty({ 
    description: 'Answer to first question',
    example: 'I want to know about admission requirements',
    required: false
  })
  @IsString()
  @IsOptional()
  question1Answer?: string;

  @ApiProperty({ 
    description: 'Answer to second question',
    example: 'Yes, I need help with visa application',
    required: false
  })
  @IsString()
  @IsOptional()
  question2Answer?: string;

  @ApiProperty({ 
    description: 'Ambassador ID if user selected an ambassador',
    example: 'ambassador-abc123',
    required: false
  })
  @IsString()
  @IsOptional()
  ambassadorId?: string;

  @ApiProperty({ 
    description: 'Ambassador name if user selected an ambassador',
    example: 'John Doe',
    required: false
  })
  @IsString()
  @IsOptional()
  ambassadorName?: string;
}

export class ChatClickAnswersResponseDto {
  @ApiProperty({ 
    description: 'Whether the answers were saved successfully',
    example: true
  })
  success: boolean;

  @ApiProperty({ 
    description: 'Response message',
    example: 'Answers saved successfully'
  })
  message: string;
}

export class ChatClickAnalyticsDto {
  @ApiProperty({ 
    description: 'Total number of chat clicks',
    example: 150
  })
  totalClicks: number;

  @ApiProperty({ 
    description: 'ALL individual chat click records with full details',
    example: [
      {
        id: 'click-123',
        domain: 'example.com',
        ipAddress: '192.168.1.1',
        country: 'United States',
        ambassadorId: 'ambassador-abc123',
        ambassadorName: 'John Doe',
        question1Answer: 'I want to know about admission requirements',
        question2Answer: 'Yes, I need help with visa',
        clickedAt: '2025-01-08T10:30:45.123Z',
        createdAt: '2025-01-08T10:30:45.123Z'
      },
      {
        id: 'click-124',
        domain: 'example.com',
        ipAddress: '192.168.1.2',
        country: 'Germany',
        ambassadorId: null,
        ambassadorName: null,
        question1Answer: null,
        question2Answer: null,
        clickedAt: '2025-01-08T10:25:30.456Z',
        createdAt: '2025-01-08T10:25:30.456Z'
      }
    ]
  })
  clicks: {
    id: string;
    domain: string;
    ipAddress: string;
    country: string | null;
    ambassadorId: string | null;
    ambassadorName: string | null;
    question1Answer: string | null;
    question2Answer: string | null;
    clickedAt: string;
    createdAt: string;
  }[];
}
