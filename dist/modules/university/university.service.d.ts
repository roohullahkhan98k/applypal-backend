import { WidgetConfigDto, WidgetResponseDto } from './dto/widget-config.dto';
import { PrismaService } from '../../database/prisma.service';
import { ChatClickService } from './services/chat-click.service';
import { EmailService } from './services/email.service';
import { SetUniversityEmailDto, SendInvitationDto, EmailResponseDto, InvitationResponseDto, BulkInvitationDto, BulkInvitationResponseDto } from './dto/email.dto';
import { InvitationListResponseDto } from './dto/invitation.dto';
export declare class UniversityService {
    private prisma;
    private chatClickService;
    private emailService;
    private readonly logger;
    private widgetStore;
    private iframeLoads;
    constructor(prisma: PrismaService, chatClickService: ChatClickService, emailService: EmailService);
    generateWidget(config: WidgetConfigDto, userId?: string): Promise<WidgetResponseDto>;
    getWidgetConfig(widgetId: string): Promise<WidgetConfigDto | null>;
    getJoinedAmbassadorsForWidget(widgetId: string): Promise<any[]>;
    getUserWidget(userId: string): Promise<WidgetResponseDto | null>;
    handleIframeLoaded(data: {
        widgetId: string;
        domain: string;
        timestamp: string;
        userAgent: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyIframeIntegration(widgetId: string, websiteUrl: string): Promise<{
        verified: boolean;
        message: string;
        details?: any;
    }>;
    recordChatClick(clickData: any, ipAddress: string): Promise<{
        success: boolean;
        message: string;
        clickId?: string;
    }>;
    getChatClickAnalytics(widgetId: string, userId?: string): Promise<any>;
    getChatClickCount(widgetId: string, userId?: string): Promise<number>;
    saveChatClickAnswers(data: {
        clickId: string;
        question1Answer?: string;
        question2Answer?: string;
        ambassadorId?: string;
        ambassadorName?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getChatClicksByCountry(widgetId: string, userId?: string): Promise<{
        country: string;
        count: number;
    }[]>;
    getIntegrationStatus(widgetId: string): Promise<{
        verified: boolean;
        message: string;
        details?: any;
        statistics?: any;
    }>;
    private generateIframeFormats;
    private generateIframeCode;
    generateWidgetHTML(config: WidgetConfigDto, widgetId: string): string;
    setUniversityEmail(userId: string, emailData: SetUniversityEmailDto): Promise<EmailResponseDto>;
    getUniversityEmail(userId: string): Promise<{
        email?: string;
        hasEmail: boolean;
    }>;
    sendAmbassadorInvitation(userId: string, invitationData: SendInvitationDto): Promise<InvitationResponseDto>;
    getInvitedAmbassadors(userId: string): Promise<InvitationListResponseDto>;
    updateInvitationStatus(ambassadorEmail: string, status: 'ACCEPTED' | 'DECLINED'): Promise<{
        success: boolean;
        message: string;
    }>;
    sendBulkAmbassadorInvitations(userId: string, bulkData: BulkInvitationDto): Promise<BulkInvitationResponseDto>;
    checkInvitationStatus(email: string): Promise<{
        wasInvited: boolean;
        status?: string;
        universityName?: string;
    }>;
}
