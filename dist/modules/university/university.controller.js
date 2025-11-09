"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const university_service_1 = require("./university.service");
const widget_config_dto_1 = require("./dto/widget-config.dto");
const chat_click_dto_1 = require("./dto/chat-click.dto");
const email_dto_1 = require("./dto/email.dto");
const invitation_dto_1 = require("./dto/invitation.dto");
const jwt_auth_guard_1 = require("../../common/auth/jwt-auth.guard");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let UniversityController = class UniversityController {
    constructor(universityService) {
        this.universityService = universityService;
    }
    async generateWidget(config, req) {
        const userId = req.user?.id;
        return this.universityService.generateWidget(config, userId);
    }
    async getMyWidget(req) {
        const userId = req.user?.id;
        return this.universityService.getUserWidget(userId);
    }
    async getWidget(widgetId, res) {
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
    async getJoinedAmbassadorsForWidget(widgetId) {
        return this.universityService.getJoinedAmbassadorsForWidget(widgetId);
    }
    async getWidgetConfig(widgetId) {
        const config = await this.universityService.getWidgetConfig(widgetId);
        if (!config) {
            throw new Error('Widget not found');
        }
        return config;
    }
    async handleIframeLoaded(data) {
        return this.universityService.handleIframeLoaded(data);
    }
    async verifyIframeIntegration(data) {
        return this.universityService.verifyIframeIntegration(data.widgetId, data.websiteUrl);
    }
    async getIntegrationStatus(widgetId) {
        return this.universityService.getIntegrationStatus(widgetId);
    }
    async handleChatClick(data, req) {
        let ipAddress = req.ip;
        if (!ipAddress) {
            const forwardedFor = req.headers['x-forwarded-for'];
            if (forwardedFor) {
                const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
                ipAddress = typeof ips === 'string' ? ips.split(',')[0].trim() : ips;
            }
        }
        if (!ipAddress) {
            ipAddress = req.headers['x-real-ip'];
        }
        if (!ipAddress) {
            ipAddress = req.connection?.remoteAddress ||
                req.socket?.remoteAddress ||
                'unknown';
        }
        if (ipAddress) {
            if (ipAddress.startsWith('::ffff:')) {
                ipAddress = ipAddress.substring(7);
            }
            else if (ipAddress === '::1') {
                ipAddress = '127.0.0.1';
            }
            else if (ipAddress === 'localhost' || ipAddress === '::') {
                ipAddress = '127.0.0.1';
            }
        }
        if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 IP Address extracted: ${ipAddress} (from req.ip: ${req.ip || 'N/A'})`);
        }
        return this.universityService.recordChatClick(data, ipAddress);
    }
    async getChatClickAnalytics(widgetId, req) {
        const userId = req.user?.id;
        return this.universityService.getChatClickAnalytics(widgetId, userId);
    }
    async getChatClickCount(widgetId, req) {
        const userId = req.user?.id;
        const count = await this.universityService.getChatClickCount(widgetId, userId);
        return { count };
    }
    async getChatClicksByCountry(widgetId, req) {
        const userId = req.user?.id;
        return this.universityService.getChatClicksByCountry(widgetId, userId);
    }
    async saveChatClickAnswers(data) {
        return this.universityService.saveChatClickAnswers(data);
    }
    async setUniversityEmail(emailData, req) {
        const userId = req.user?.id;
        return this.universityService.setUniversityEmail(userId, emailData);
    }
    async getUniversityEmail(req) {
        const userId = req.user?.id;
        return this.universityService.getUniversityEmail(userId);
    }
    async sendAmbassadorInvitation(invitationData, req) {
        const userId = req.user?.id;
        return this.universityService.sendAmbassadorInvitation(userId, invitationData);
    }
    async sendBulkAmbassadorInvitations(bulkData, req) {
        const userId = req.user?.id;
        return this.universityService.sendBulkAmbassadorInvitations(userId, bulkData);
    }
    async getInvitedAmbassadors(req) {
        const userId = req.user?.id;
        return this.universityService.getInvitedAmbassadors(userId);
    }
    async updateInvitationStatus(ambassadorEmail, statusData) {
        return this.universityService.updateInvitationStatus(ambassadorEmail, statusData.status);
    }
    async acceptInvitation(token) {
        return this.universityService.updateInvitationStatus(token, 'ACCEPTED');
    }
    async declineInvitation(token) {
        return this.universityService.updateInvitationStatus(token, 'DECLINED');
    }
    async checkInvitationStatus(email) {
        return this.universityService.checkInvitationStatus(email);
    }
};
exports.UniversityController = UniversityController;
__decorate([
    (0, common_1.Post)('widget/generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate iframe widget from configuration' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Widget generated successfully',
        type: widget_config_dto_1.WidgetResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid configuration data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized',
    }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({
        whitelist: false,
        forbidNonWhitelisted: false,
        transform: true
    }))),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [widget_config_dto_1.WidgetConfigDto, Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "generateWidget", null);
__decorate([
    (0, common_1.Get)('widget/my-widget'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user\'s existing widget' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User widget retrieved successfully',
        type: widget_config_dto_1.WidgetResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No widget found for user',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getMyWidget", null);
__decorate([
    (0, common_1.Get)('widget/:widgetId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get widget HTML for iframe embedding (Public Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Widget HTML served successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Widget not found',
    }),
    __param(0, (0, common_1.Param)('widgetId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getWidget", null);
__decorate([
    (0, common_1.Get)('widget/:widgetId/joined-ambassadors'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get joined ambassadors for widget (Public Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Joined ambassadors retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getJoinedAmbassadorsForWidget", null);
__decorate([
    (0, common_1.Get)('widget/:widgetId/config'),
    (0, swagger_1.ApiOperation)({ summary: 'Get widget configuration' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Widget configuration retrieved successfully',
        type: widget_config_dto_1.WidgetConfigDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Widget not found',
    }),
    __param(0, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getWidgetConfig", null);
__decorate([
    (0, common_1.Post)('widget/iframe-loaded'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Handle iframe load notification (Public Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Iframe load notification received successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "handleIframeLoaded", null);
__decorate([
    (0, common_1.Post)('widget/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify iframe integration on website' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Verification completed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "verifyIframeIntegration", null);
__decorate([
    (0, common_1.Get)('widget/:widgetId/status'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get iframe integration status for frontend (Public Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Integration status retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Widget not found',
    }),
    __param(0, (0, common_1.Param)('widgetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getIntegrationStatus", null);
__decorate([
    (0, common_1.Post)('widget/chat-click'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Record chat icon click (Public Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat click recorded successfully',
        type: chat_click_dto_1.ChatClickResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid click data',
    }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }))),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_click_dto_1.ChatClickDto, Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "handleChatClick", null);
__decorate([
    (0, common_1.Get)('widget/:widgetId/chat-analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat click analytics for verified widget (Authenticated Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat click analytics retrieved successfully',
        type: chat_click_dto_1.ChatClickAnalyticsDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Widget not found or not verified',
    }),
    __param(0, (0, common_1.Param)('widgetId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getChatClickAnalytics", null);
__decorate([
    (0, common_1.Get)('widget/:widgetId/chat-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total chat click count for verified widget (Authenticated Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat click count retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('widgetId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getChatClickCount", null);
__decorate([
    (0, common_1.Get)('widget/:widgetId/chat-countries'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat clicks grouped by country for verified widget (Authenticated Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Chat clicks by country retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('widgetId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getChatClicksByCountry", null);
__decorate([
    (0, common_1.Post)('widget/chat-click-answers'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Save answers to chat questions (Public Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Answers saved successfully',
        type: chat_click_dto_1.ChatClickAnswersResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid answer data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Chat click not found',
    }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_click_dto_1.ChatClickAnswersDto]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "saveChatClickAnswers", null);
__decorate([
    (0, common_1.Post)('email/set'),
    (0, swagger_1.ApiOperation)({ summary: 'Set university email address for sending invitations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'University email set successfully',
        type: email_dto_1.EmailResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid email or email already taken',
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dto_1.SetUniversityEmailDto, Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "setUniversityEmail", null);
__decorate([
    (0, common_1.Get)('email'),
    (0, swagger_1.ApiOperation)({ summary: 'Get university email address' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'University email retrieved successfully',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getUniversityEmail", null);
__decorate([
    (0, common_1.Post)('email/send-invitation'),
    (0, swagger_1.ApiOperation)({ summary: 'Send ambassador invitation email' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Ambassador invitation sent successfully',
        type: email_dto_1.InvitationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'University email not set or invalid invitation data',
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dto_1.SendInvitationDto, Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "sendAmbassadorInvitation", null);
__decorate([
    (0, common_1.Post)('email/send-bulk-invitations'),
    (0, swagger_1.ApiOperation)({ summary: 'Send bulk ambassador invitations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Bulk invitations sent successfully',
        type: email_dto_1.BulkInvitationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'University email not set or invalid invitation data',
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dto_1.BulkInvitationDto, Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "sendBulkAmbassadorInvitations", null);
__decorate([
    (0, common_1.Get)('invitations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all invited ambassadors for university' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invited ambassadors retrieved successfully',
        type: invitation_dto_1.InvitationListResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "getInvitedAmbassadors", null);
__decorate([
    (0, common_1.Post)('invitations/:ambassadorEmail/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update invitation status (Accept/Decline)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invitation status updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Invitation not found',
    }),
    __param(0, (0, common_1.Param)('ambassadorEmail')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, invitation_dto_1.UpdateInvitationStatusDto]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "updateInvitationStatus", null);
__decorate([
    (0, common_1.Get)('invitations/:token/accept'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Handle invitation accept (Public Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invitation accepted successfully',
    }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Get)('invitations/:token/decline'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Handle invitation decline (Public Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invitation declined successfully',
    }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "declineInvitation", null);
__decorate([
    (0, common_1.Get)('invitations/check/:email'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check if email was invited (Public Access)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invitation status retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UniversityController.prototype, "checkInvitationStatus", null);
exports.UniversityController = UniversityController = __decorate([
    (0, swagger_1.ApiTags)('University'),
    (0, common_1.Controller)('university'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [university_service_1.UniversityService])
], UniversityController);
//# sourceMappingURL=university.controller.js.map