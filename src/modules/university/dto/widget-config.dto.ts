import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class WidgetConfigDto {
  @ApiProperty({ description: 'Selected icons array', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedIcons?: string[];

  @ApiProperty({ 
    description: 'Icon inputs configuration - dynamic object with icon names as keys',
    type: 'object',
    required: false,
    example: {
      "Chat": { "label": "Chat Support", "url": "https://university.com/chat" },
      "Home": { "label": "Homepage", "url": "https://university.com" }
    }
  })
  @IsOptional()
  iconInputs?: { [key: string]: { label?: string; url?: string } };

  @ApiProperty({ description: 'Selected color for the widget', required: false })
  @IsOptional()
  @IsString()
  selectedColor?: string;

  @ApiProperty({ description: 'University ID or identifier', required: false })
  @IsOptional()
  @IsString()
  universityId?: string;
}

export class WidgetResponseDto {
  @ApiProperty({ description: 'Generated iframe HTML code (backward compatibility)' })
  iframeCode: string;

  @ApiProperty({ 
    description: 'Iframe codes for different platforms and frameworks',
    example: {
      html: '<iframe src="..." width="200" height="300">...</iframe>',
      react: '<iframe src="..." frameBorder="0" style={{...}} />',
      vue: '<iframe :src="..." :style="{...}">...</iframe>',
      angular: '<iframe [src]="..." [style]="{...}">...</iframe>',
      wordpress: '<!-- WordPress comment --> <iframe>...</iframe>',
      shopify: '<!-- Shopify comment --> <iframe>...</iframe>'
    }
  })
  iframeFormats: {
    html: string;
    react: string;
    vue: string;
    angular: string;
    wordpress: string;
    shopify: string;
  };

  @ApiProperty({ description: 'Widget preview URL' })
  previewUrl: string;

  @ApiProperty({ description: 'Widget ID for future reference' })
  widgetId: string;
}
