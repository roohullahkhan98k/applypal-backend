import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  Res,
  UseGuards,
  ValidationPipe,
  Request
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { Response } from 'express';
import { UniversityService } from './university.service';
import { WidgetConfigDto, WidgetResponseDto } from './dto/widget-config.dto';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('University')
@Controller('university')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UniversityController {
  constructor(private universityService: UniversityService) {}

  @Post('widget/generate')
  @ApiOperation({ summary: 'Generate iframe widget from configuration' })
  @ApiResponse({
    status: 201,
    description: 'Widget generated successfully',
    type: WidgetResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid configuration data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async generateWidget(
    @Body(new ValidationPipe({ 
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true 
    })) config: WidgetConfigDto,
    @Request() req: any,
  ): Promise<WidgetResponseDto> {
    const userId = req.user?.id; // Get user ID from JWT token
    return this.universityService.generateWidget(config, userId);
  }

  @Get('widget/my-widget')
  @ApiOperation({ summary: 'Get current user\'s existing widget' })
  @ApiResponse({
    status: 200,
    description: 'User widget retrieved successfully',
    type: WidgetResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No widget found for user',
  })
  async getMyWidget(@Request() req: any): Promise<WidgetResponseDto | null> {
    const userId = req.user?.id;
    return this.universityService.getUserWidget(userId);
  }

  @Get('widget/:widgetId')
  @Public()
  @ApiOperation({ summary: 'Get widget HTML for iframe embedding (Public Access)' })
  @ApiResponse({
    status: 200,
    description: 'Widget HTML served successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Widget not found',
  })
  async getWidget(
    @Param('widgetId') widgetId: string,
    @Res() res: Response,
  ): Promise<void> {
    const config = await this.universityService.getWidgetConfig(widgetId);
    
    if (!config) {
      res.status(404).send('Widget not found');
      return;
    }

    const html = this.universityService.generateWidgetHTML(config, widgetId);
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', "frame-ancestors *");
    res.send(html);
  }

  @Get('widget/:widgetId/config')
  @ApiOperation({ summary: 'Get widget configuration' })
  @ApiResponse({
    status: 200,
    description: 'Widget configuration retrieved successfully',
    type: WidgetConfigDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Widget not found',
  })
  async getWidgetConfig(
    @Param('widgetId') widgetId: string,
  ): Promise<WidgetConfigDto> {
    const config = await this.universityService.getWidgetConfig(widgetId);
    
    if (!config) {
      throw new Error('Widget not found');
    }
    
    return config;
  }

  @Post('widget/iframe-loaded')
  @Public()
  @ApiOperation({ summary: 'Handle iframe load notification (Public Access)' })
  @ApiResponse({
    status: 200,
    description: 'Iframe load notification received successfully',
  })
  async handleIframeLoaded(
    @Body() data: {
      widgetId: string;
      domain: string;
      timestamp: string;
      userAgent: string;
    },
  ): Promise<{ success: boolean; message: string }> {
    return this.universityService.handleIframeLoaded(data);
  }

  @Post('widget/verify')
  @ApiOperation({ summary: 'Verify iframe integration on website' })
  @ApiResponse({
    status: 200,
    description: 'Verification completed',
  })
  async verifyIframeIntegration(
    @Body() data: {
      widgetId: string;
      websiteUrl: string;
    },
  ): Promise<{ verified: boolean; message: string; details?: any }> {
    return this.universityService.verifyIframeIntegration(data.widgetId, data.websiteUrl);
  }

  @Get('widget/:widgetId/status')
  @Public()
  @ApiOperation({ summary: 'Get iframe integration status for frontend (Public Access)' })
  @ApiResponse({
    status: 200,
    description: 'Integration status retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Widget not found',
  })
  async getIntegrationStatus(
    @Param('widgetId') widgetId: string,
  ): Promise<{
    verified: boolean;
    message: string;
    details?: any;
    statistics?: any;
  }> {
    return this.universityService.getIntegrationStatus(widgetId);
  }
}
