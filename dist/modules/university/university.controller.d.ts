import { Response } from 'express';
import { UniversityService } from './university.service';
import { WidgetConfigDto, WidgetResponseDto } from './dto/widget-config.dto';
import { ChatClickDto, ChatClickResponseDto, ChatClickAnalyticsDto, ChatClickAnswersDto, ChatClickAnswersResponseDto } from './dto/chat-click.dto';
import { SetUniversityEmailDto, SendInvitationDto, EmailResponseDto, InvitationResponseDto, BulkInvitationDto, BulkInvitationResponseDto } from './dto/email.dto';
import { InvitationListResponseDto, UpdateInvitationStatusDto } from './dto/invitation.dto';
export declare class UniversityController {
    private universityService;
    constructor(universityService: UniversityService);
    generateWidget(config: WidgetConfigDto, req: any): Promise<WidgetResponseDto>;
    getMyWidget(req: any): Promise<WidgetResponseDto | null>;
    getWidget(widgetId: string, res: Response): Promise<void>;
    getJoinedAmbassadorsForWidget(widgetId: string): Promise<any[]>;
    getWidgetConfig(widgetId: string): Promise<WidgetConfigDto>;
    handleIframeLoaded(data: {
        widgetId: string;
        domain: string;
        timestamp: string;
        userAgent: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyIframeIntegration(data: {
        widgetId: string;
        websiteUrl: string;
    }): Promise<{
        verified: boolean;
        message: string;
        details?: any;
    }>;
    getIntegrationStatus(widgetId: string): Promise<{
        verified: boolean;
        message: string;
        details?: any;
        statistics?: any;
    }>;
    handleChatClick(data: ChatClickDto, req: any): Promise<ChatClickResponseDto>;
    getChatClickAnalytics(widgetId: string, req: any): Promise<ChatClickAnalyticsDto>;
    getChatClickCount(widgetId: string, req: any): Promise<{
        count: number;
    }>;
    getChatClicksByCountry(widgetId: string, req: any): Promise<{
        country: string;
        count: number;
    }[]>;
    saveChatClickAnswers(data: ChatClickAnswersDto): Promise<ChatClickAnswersResponseDto>;
    setUniversityEmail(emailData: SetUniversityEmailDto, req: any): Promise<EmailResponseDto>;
    getUniversityEmail(req: any): Promise<{
        email?: string;
        hasEmail: boolean;
    }>;
    sendAmbassadorInvitation(invitationData: SendInvitationDto, req: any): Promise<InvitationResponseDto>;
    sendBulkAmbassadorInvitations(bulkData: BulkInvitationDto, req: any): Promise<BulkInvitationResponseDto>;
    getInvitedAmbassadors(req: any): Promise<InvitationListResponseDto>;
    updateInvitationStatus(ambassadorEmail: string, statusData: UpdateInvitationStatusDto): Promise<{
        success: boolean;
        message: string;
    }>;
    acceptInvitation(token: string): Promise<{
        success: boolean;
        message: string;
    }>;
    declineInvitation(token: string): Promise<{
        success: boolean;
        message: string;
    }>;
    checkInvitationStatus(email: string): Promise<{
        wasInvited: boolean;
        status?: string;
        universityName?: string;
    }>;
}
