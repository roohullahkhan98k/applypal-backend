import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  Res,
  UseGuards,
  ValidationPipe,
  Request,
  Req
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
import { ChatClickDto, ChatClickResponseDto, ChatClickAnalyticsDto } from './dto/chat-click.dto';
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

  @Post('widget/chat-click')
  @Public()
  @ApiOperation({ summary: 'Record chat icon click (Public Access)' })
  @ApiResponse({
    status: 200,
    description: 'Chat click recorded successfully',
    type: ChatClickResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid click data',
  })
  async handleChatClick(
    @Body(new ValidationPipe({ 
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true 
    })) data: ChatClickDto,
    @Req() req: any,
  ): Promise<ChatClickResponseDto> {
    // Extract IP address from request
    const ipAddress = req.ip || 
                     req.connection?.remoteAddress || 
                     req.socket?.remoteAddress ||
                     (req.connection?.socket ? req.connection.socket.remoteAddress : null) ||
                     req.headers['x-forwarded-for'] ||
                     req.headers['x-real-ip'] ||
                     'unknown';
    
    return this.universityService.recordChatClick(data, ipAddress);
  }

  @Get('widget/:widgetId/chat-analytics')
  @ApiOperation({ summary: 'Get chat click analytics for verified widget (Authenticated Access)' })
  @ApiResponse({
    status: 200,
    description: 'Chat click analytics retrieved successfully',
    type: ChatClickAnalyticsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Widget not found or not verified',
  })
  async getChatClickAnalytics(
    @Param('widgetId') widgetId: string,
    @Request() req: any,
  ): Promise<ChatClickAnalyticsDto> {
    // Only allow access to analytics for widgets owned by the authenticated user
    const userId = req.user?.id;
    return this.universityService.getChatClickAnalytics(widgetId, userId);
  }

  @Get('widget/:widgetId/chat-count')
  @ApiOperation({ summary: 'Get total chat click count for verified widget (Authenticated Access)' })
  @ApiResponse({
    status: 200,
    description: 'Chat click count retrieved successfully',
  })
  async getChatClickCount(
    @Param('widgetId') widgetId: string,
    @Request() req: any,
  ): Promise<{ count: number }> {
    const userId = req.user?.id;
    const count = await this.universityService.getChatClickCount(widgetId, userId);
    return { count };
  }

  @Get('widget/:widgetId/chat-countries')
  @ApiOperation({ summary: 'Get chat clicks grouped by country for verified widget (Authenticated Access)' })
  @ApiResponse({
    status: 200,
    description: 'Chat clicks by country retrieved successfully',
  })
  async getChatClicksByCountry(
    @Param('widgetId') widgetId: string,
    @Request() req: any,
  ): Promise<{ country: string; count: number }[]> {
    const userId = req.user?.id;
    return this.universityService.getChatClicksByCountry(widgetId, userId);
  }
}
