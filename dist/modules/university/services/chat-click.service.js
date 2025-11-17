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
var ChatClickService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatClickService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const geolocation_service_1 = require("./geolocation.service");
let ChatClickService = ChatClickService_1 = class ChatClickService {
    constructor(prisma, geolocationService) {
        this.prisma = prisma;
        this.geolocationService = geolocationService;
        this.logger = new common_1.Logger(ChatClickService_1.name);
    }
    async recordChatClick(clickData, ipAddress) {
        try {
            this.logger.log(`💬 Processing chat click for widget: ${clickData.widgetId}`);
            const chatClick = await this.prisma.chatClick.create({
                data: {
                    widgetId: clickData.widgetId,
                    domain: clickData.domain,
                    ipAddress,
                    country: null,
                    ambassadorId: clickData.ambassadorId || null,
                    ambassadorName: clickData.ambassadorName || null,
                    clickedAt: new Date(clickData.timestamp)
                }
            });
            this.updateGeolocationInBackground(chatClick.id, ipAddress).catch(err => {
                this.logger.warn(`⚠️ Background geolocation update failed for click ${chatClick.id}: ${err.message}`);
            });
            this.logger.log(`💬 CHAT ICON CLICKED! Widget: ${clickData.widgetId}`);
            this.logger.log(`📱 Domain: ${clickData.domain}`);
            this.logger.log(`🌐 IP: ${ipAddress}`);
            this.logger.log(`⏰ Timestamp: ${clickData.timestamp}`);
            this.logger.log(`🆔 Click ID: ${chatClick.id}`);
            this.logger.log(`✅ Click recorded instantly (geolocation updating in background)`);
            return {
                success: true,
                message: 'Chat click recorded successfully',
                clickId: chatClick.id
            };
        }
        catch (error) {
            this.logger.error('❌ Error recording chat click:', error);
            return {
                success: false,
                message: 'Failed to record chat click'
            };
        }
    }
    async updateGeolocationInBackground(clickId, ipAddress) {
        try {
            const geolocationData = await this.geolocationService.getLocationFromIp(ipAddress);
            await this.prisma.chatClick.update({
                where: { id: clickId },
                data: { country: geolocationData.country }
            });
            this.logger.log(`📍 Geolocation updated for click ${clickId}: ${geolocationData.country}`);
        }
        catch (error) {
            this.logger.error(`❌ Failed to update geolocation for click ${clickId}:`, error);
        }
    }
    async getChatClickAnalytics(widgetId) {
        try {
            this.logger.log(`📊 Getting chat click analytics for widget: ${widgetId}`);
            const clicks = await this.prisma.chatClick.findMany({
                where: { widgetId },
                orderBy: { clickedAt: 'desc' }
            });
            if (clicks.length === 0) {
                return {
                    totalClicks: 0,
                    clicks: []
                };
            }
            const allClicks = clicks.map(click => ({
                id: click.id,
                domain: click.domain,
                ipAddress: click.ipAddress,
                country: click.country || null,
                ambassadorId: click.ambassadorId || null,
                ambassadorName: click.ambassadorName || null,
                question1Answer: click.question1Answer || null,
                question2Answer: click.question2Answer || null,
                clickedAt: click.clickedAt.toISOString(),
                createdAt: click.createdAt.toISOString()
            }));
            const analytics = {
                totalClicks: clicks.length,
                clicks: allClicks
            };
            this.logger.log(`📊 Analytics generated: ${analytics.totalClicks} total clicks (ALL records sent)`);
            return analytics;
        }
        catch (error) {
            this.logger.error('❌ Error getting chat click analytics:', error);
            return {
                totalClicks: 0,
                clicks: []
            };
        }
    }
    async getClickCount(widgetId) {
        try {
            const count = await this.prisma.chatClick.count({
                where: { widgetId }
            });
            this.logger.log(`📊 Widget ${widgetId} has ${count} total chat clicks`);
            return count;
        }
        catch (error) {
            this.logger.error(`❌ Error getting click count for widget ${widgetId}:`, error);
            return 0;
        }
    }
    async getClicksByCountry(widgetId) {
        try {
            const clicks = await this.prisma.chatClick.findMany({
                where: { widgetId },
                select: { country: true }
            });
            const countryStats = clicks.reduce((acc, click) => {
                const country = click.country || 'Unknown';
                const existing = acc.find(item => item.country === country);
                if (existing) {
                    existing.count++;
                }
                else {
                    acc.push({ country, count: 1 });
                }
                return acc;
            }, []);
            return countryStats.sort((a, b) => b.count - a.count);
        }
        catch (error) {
            this.logger.error(`❌ Error getting country stats for widget ${widgetId}:`, error);
            return [];
        }
    }
};
exports.ChatClickService = ChatClickService;
exports.ChatClickService = ChatClickService = ChatClickService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        geolocation_service_1.GeolocationService])
], ChatClickService);
//# sourceMappingURL=chat-click.service.js.map