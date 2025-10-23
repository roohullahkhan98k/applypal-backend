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

export class ChatClickAnalyticsDto {
  @ApiProperty({ 
    description: 'Total number of chat clicks',
    example: 150
  })
  totalClicks: number;

  @ApiProperty({ 
    description: 'Clicks grouped by country',
    example: [
      { country: 'United States', count: 45 },
      { country: 'Germany', count: 32 },
      { country: 'Japan', count: 28 }
    ]
  })
  clicksByCountry: { country: string; count: number }[];

  @ApiProperty({ 
    description: 'Clicks grouped by domain',
    example: [
      { domain: 'example.com', count: 60 },
      { domain: 'test.com', count: 40 }
    ]
  })
  clicksByDomain: { domain: string; count: number }[];

  @ApiProperty({ 
    description: 'Recent chat clicks (last 10)',
    example: [
      {
        id: 'click-123',
        domain: 'example.com',
        country: 'United States',
        clickedAt: '2025-01-08T10:30:45.123Z'
      }
    ]
  })
  recentClicks: {
    id: string;
    domain: string;
    country?: string;
    clickedAt: string;
  }[];

  @ApiProperty({ 
    description: 'Last click timestamp',
    example: '2025-01-08T10:30:45.123Z',
    required: false
  })
  lastClick?: string;
}
