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
import { ChatClickDto, ChatClickResponseDto, ChatClickAnalyticsDto, ChatClickAnswersDto, ChatClickAnswersResponseDto } from './dto/chat-click.dto';
import { SetUniversityEmailDto, SendInvitationDto, EmailResponseDto, InvitationResponseDto, BulkInvitationDto, BulkInvitationResponseDto } from './dto/email.dto';
import { InvitedAmbassadorDto, InvitationListResponseDto, UpdateInvitationStatusDto } from './dto/invitation.dto';
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

  @Get('widget/:widgetId/joined-ambassadors')
  @Public()
  @ApiOperation({ summary: 'Get joined ambassadors for widget (Public Access)' })
  @ApiResponse({
    status: 200,
    description: 'Joined ambassadors retrieved successfully',
  })
  async getJoinedAmbassadorsForWidget(
    @Param('widgetId') widgetId: string,
  ): Promise<any[]> {
    return this.universityService.getJoinedAmbassadorsForWidget(widgetId);
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
    // Priority: req.ip (works with trust proxy) > x-forwarded-for > x-real-ip > socket address
    let ipAddress = req.ip;
    
    if (!ipAddress) {
      // Try x-forwarded-for header (may contain multiple IPs, get the first one)
      const forwardedFor = req.headers['x-forwarded-for'];
      if (forwardedFor) {
        const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
        ipAddress = typeof ips === 'string' ? ips.split(',')[0].trim() : ips;
      }
    }
    
    if (!ipAddress) {
      // Try x-real-ip header
      ipAddress = req.headers['x-real-ip'] as string;
    }
    
    if (!ipAddress) {
      // Fallback to socket connection IP
      ipAddress = req.connection?.remoteAddress || 
                  req.socket?.remoteAddress ||
                  'unknown';
    }
    
    // Normalize IP address
    if (ipAddress) {
      // Remove IPv6 prefix if present (::ffff:192.168.1.1 -> 192.168.1.1)
      if (ipAddress.startsWith('::ffff:')) {
        ipAddress = ipAddress.substring(7);
      }
      // Normalize IPv6 localhost to IPv4 localhost for consistency
      else if (ipAddress === '::1') {
        ipAddress = '127.0.0.1';
      }
      // Normalize IPv4 localhost variants
      else if (ipAddress === 'localhost' || ipAddress === '::') {
        ipAddress = '127.0.0.1';
      }
    }
    
    // Log IP extraction for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 IP Address extracted: ${ipAddress} (from req.ip: ${req.ip || 'N/A'})`);
    }
    
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

  @Post('widget/chat-click-answers')
  @Public()
  @ApiOperation({ summary: 'Save answers to chat questions (Public Access)' })
  @ApiResponse({
    status: 200,
    description: 'Answers saved successfully',
    type: ChatClickAnswersResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid answer data',
  })
  @ApiResponse({
    status: 404,
    description: 'Chat click not found',
  })
  async saveChatClickAnswers(
    @Body(new ValidationPipe({ 
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true 
    })) data: ChatClickAnswersDto,
  ): Promise<ChatClickAnswersResponseDto> {
    return this.universityService.saveChatClickAnswers(data);
  }

  // ==================== EMAIL MANAGEMENT ENDPOINTS ====================

  @Post('email/set')
  @ApiOperation({ summary: 'Set university email address for sending invitations' })
  @ApiResponse({
    status: 200,
    description: 'University email set successfully',
    type: EmailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email or email already taken',
  })
  async setUniversityEmail(
    @Body(ValidationPipe) emailData: SetUniversityEmailDto,
    @Request() req: any,
  ): Promise<EmailResponseDto> {
    const userId = req.user?.id;
    return this.universityService.setUniversityEmail(userId, emailData);
  }

  @Get('email')
  @ApiOperation({ summary: 'Get university email address' })
  @ApiResponse({
    status: 200,
    description: 'University email retrieved successfully',
  })
  async getUniversityEmail(
    @Request() req: any,
  ): Promise<{ email?: string; hasEmail: boolean }> {
    const userId = req.user?.id;
    return this.universityService.getUniversityEmail(userId);
  }

  @Post('email/send-invitation')
  @ApiOperation({ summary: 'Send ambassador invitation email' })
  @ApiResponse({
    status: 200,
    description: 'Ambassador invitation sent successfully',
    type: InvitationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'University email not set or invalid invitation data',
  })
  async sendAmbassadorInvitation(
    @Body(ValidationPipe) invitationData: SendInvitationDto,
    @Request() req: any,
  ): Promise<InvitationResponseDto> {
    const userId = req.user?.id;
    return this.universityService.sendAmbassadorInvitation(userId, invitationData);
  }

  @Post('email/send-bulk-invitations')
  @ApiOperation({ summary: 'Send bulk ambassador invitations' })
  @ApiResponse({
    status: 200,
    description: 'Bulk invitations sent successfully',
    type: BulkInvitationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'University email not set or invalid invitation data',
  })
  async sendBulkAmbassadorInvitations(
    @Body(ValidationPipe) bulkData: BulkInvitationDto,
    @Request() req: any,
  ): Promise<BulkInvitationResponseDto> {
    const userId = req.user?.id;
    return this.universityService.sendBulkAmbassadorInvitations(userId, bulkData);
  }

  // ==================== INVITATION MANAGEMENT ENDPOINTS ====================

  @Get('invitations')
  @ApiOperation({ summary: 'Get all invited ambassadors for university' })
  @ApiResponse({
    status: 200,
    description: 'Invited ambassadors retrieved successfully',
    type: InvitationListResponseDto,
  })
  async getInvitedAmbassadors(
    @Request() req: any,
  ): Promise<InvitationListResponseDto> {
    const userId = req.user?.id;
    return this.universityService.getInvitedAmbassadors(userId);
  }

  @Post('invitations/:ambassadorEmail/status')
  @ApiOperation({ summary: 'Update invitation status (Accept/Decline)' })
  @ApiResponse({
    status: 200,
    description: 'Invitation status updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Invitation not found',
  })
  async updateInvitationStatus(
    @Param('ambassadorEmail') ambassadorEmail: string,
    @Body(ValidationPipe) statusData: UpdateInvitationStatusDto,
  ): Promise<{ success: boolean; message: string }> {
    return this.universityService.updateInvitationStatus(ambassadorEmail, statusData.status);
  }

  @Get('invitations/:token/accept')
  @Public()
  @ApiOperation({ summary: 'Handle invitation accept (Public Access)' })
  @ApiResponse({
    status: 200,
    description: 'Invitation accepted successfully',
  })
  async acceptInvitation(
    @Param('token') token: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.universityService.updateInvitationStatus(token, 'ACCEPTED');
  }

  @Get('invitations/:token/decline')
  @Public()
  @ApiOperation({ summary: 'Handle invitation decline (Public Access)' })
  @ApiResponse({
    status: 200,
    description: 'Invitation declined successfully',
  })
  async declineInvitation(
    @Param('token') token: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.universityService.updateInvitationStatus(token, 'DECLINED');
  }

  @Get('invitations/check/:email')
  @Public()
  @ApiOperation({ summary: 'Check if email was invited (Public Access)' })
  @ApiResponse({
    status: 200,
    description: 'Invitation status retrieved successfully',
  })
  async checkInvitationStatus(
    @Param('email') email: string,
  ): Promise<{ wasInvited: boolean; status?: string; universityName?: string }> {
    return this.universityService.checkInvitationStatus(email);
  }
}
