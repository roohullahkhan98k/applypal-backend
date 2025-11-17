import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { GeolocationService } from './geolocation.service';
import { ChatClickDto, ChatClickResponseDto, ChatClickAnalyticsDto } from '../dto/chat-click.dto';

@Injectable()
export class ChatClickService {
  private readonly logger = new Logger(ChatClickService.name);

  constructor(
    private prisma: PrismaService,
    private geolocationService: GeolocationService
  ) {}

  /**
   * Record a chat icon click with full tracking data
   * OPTIMIZED: Returns instantly, geolocation updated in background
   * @param clickData - The chat click data from the iframe
   * @param ipAddress - The user's IP address
   * @returns Success response with click ID (returns instantly!)
   */
  async recordChatClick(
    clickData: ChatClickDto, 
    ipAddress: string
  ): Promise<ChatClickResponseDto> {
    try {
      this.logger.log(`💬 Processing chat click for widget: ${clickData.widgetId}`);

      // Store the chat click IMMEDIATELY without waiting for geolocation (INSTANT RESPONSE!)
      const chatClick = await this.prisma.chatClick.create({
        data: {
          widgetId: clickData.widgetId,
          domain: clickData.domain,
          ipAddress,
          country: null, // Will be updated in background
          ambassadorId: clickData.ambassadorId || null,
          ambassadorName: clickData.ambassadorName || null,
          clickedAt: new Date(clickData.timestamp)
        }
      });

      // Update geolocation in BACKGROUND (non-blocking, doesn't delay response)
      this.updateGeolocationInBackground(chatClick.id, ipAddress).catch(err => {
        this.logger.warn(`⚠️ Background geolocation update failed for click ${chatClick.id}: ${err.message}`);
      });

      // Enhanced logging
      this.logger.log(`💬 CHAT ICON CLICKED! Widget: ${clickData.widgetId}`);
      this.logger.log(`📱 Domain: ${clickData.domain}`);
      this.logger.log(`🌐 IP: ${ipAddress}`);
      this.logger.log(`⏰ Timestamp: ${clickData.timestamp}`);
      this.logger.log(`🆔 Click ID: ${chatClick.id}`);
      this.logger.log(`✅ Click recorded instantly (geolocation updating in background)`);

      // Return INSTANTLY without waiting for geolocation!
      return {
        success: true,
        message: 'Chat click recorded successfully',
        clickId: chatClick.id
      };

    } catch (error) {
      this.logger.error('❌ Error recording chat click:', error);
      return {
        success: false,
        message: 'Failed to record chat click'
      };
    }
  }

  /**
   * Update geolocation data in the background (non-blocking)
   * @param clickId - The chat click ID to update
   * @param ipAddress - The IP address to lookup
   */
  private async updateGeolocationInBackground(clickId: string, ipAddress: string): Promise<void> {
    try {
      const geolocationData = await this.geolocationService.getLocationFromIp(ipAddress);
      
      await this.prisma.chatClick.update({
        where: { id: clickId },
        data: { country: geolocationData.country }
      });

      this.logger.log(`📍 Geolocation updated for click ${clickId}: ${geolocationData.country}`);
    } catch (error) {
      this.logger.error(`❌ Failed to update geolocation for click ${clickId}:`, error);
      // Don't throw - this is background work, failures are acceptable
    }
  }

  /**
   * Get analytics data for a specific widget
   * @param widgetId - The widget ID to get analytics for
   * @returns Analytics data with ALL individual click records
   */
  async getChatClickAnalytics(widgetId: string): Promise<ChatClickAnalyticsDto> {
    try {
      this.logger.log(`📊 Getting chat click analytics for widget: ${widgetId}`);

      // Get ALL clicks for this widget (no limit)
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

      // Return ALL individual click records with full details
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

      const analytics: ChatClickAnalyticsDto = {
        totalClicks: clicks.length,
        clicks: allClicks
      };

      this.logger.log(`📊 Analytics generated: ${analytics.totalClicks} total clicks (ALL records sent)`);
      
      return analytics;

    } catch (error) {
      this.logger.error('❌ Error getting chat click analytics:', error);
      return {
        totalClicks: 0,
        clicks: []
      };
    }
  }

  /**
   * Get simple click count for a widget (for quick checks)
   * @param widgetId - The widget ID to get click count for
   * @returns Total click count
   */
  async getClickCount(widgetId: string): Promise<number> {
    try {
      const count = await this.prisma.chatClick.count({
        where: { widgetId }
      });
      
      this.logger.log(`📊 Widget ${widgetId} has ${count} total chat clicks`);
      return count;
    } catch (error) {
      this.logger.error(`❌ Error getting click count for widget ${widgetId}:`, error);
      return 0;
    }
  }

  /**
   * Get clicks by country for a widget
   * @param widgetId - The widget ID to get country stats for
   * @returns Array of countries with click counts
   */
  async getClicksByCountry(widgetId: string): Promise<{ country: string; count: number }[]> {
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
        } else {
          acc.push({ country, count: 1 });
        }
        return acc;
      }, [] as { country: string; count: number }[]);

      return countryStats.sort((a, b) => b.count - a.count);
    } catch (error) {
      this.logger.error(`❌ Error getting country stats for widget ${widgetId}:`, error);
      return [];
    }
  }
}
