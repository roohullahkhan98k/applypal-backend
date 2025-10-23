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
   * @param clickData - The chat click data from the iframe
   * @param ipAddress - The user's IP address
   * @returns Success response with click ID
   */
  async recordChatClick(
    clickData: ChatClickDto, 
    ipAddress: string
  ): Promise<ChatClickResponseDto> {
    try {
      this.logger.log(`💬 Processing chat click for widget: ${clickData.widgetId}`);

      // Get geolocation data for the IP address
      const geolocationData = await this.geolocationService.getLocationFromIp(ipAddress);

      // Store the chat click in database
      const chatClick = await this.prisma.chatClick.create({
        data: {
          widgetId: clickData.widgetId,
          domain: clickData.domain,
          ipAddress,
          country: geolocationData.country,
          clickedAt: new Date(clickData.timestamp)
        }
      });

      // Enhanced logging with emojis and details
      this.logger.log(`💬 CHAT ICON CLICKED! Widget: ${clickData.widgetId}`);
      this.logger.log(`📱 Domain: ${clickData.domain}`);
      this.logger.log(`🌍 Country: ${geolocationData.country}`);
      this.logger.log(`🌐 IP: ${ipAddress}`);
      this.logger.log(`⏰ Timestamp: ${clickData.timestamp}`);
      this.logger.log(`🆔 Click ID: ${chatClick.id}`);
      this.logger.log(`✅ Click recorded successfully`);

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
   * Get analytics data for a specific widget
   * @param widgetId - The widget ID to get analytics for
   * @returns Analytics data including clicks by country, domain, etc.
   */
  async getChatClickAnalytics(widgetId: string): Promise<ChatClickAnalyticsDto> {
    try {
      this.logger.log(`📊 Getting chat click analytics for widget: ${widgetId}`);

      // Get all clicks for this widget
      const clicks = await this.prisma.chatClick.findMany({
        where: { widgetId },
        orderBy: { clickedAt: 'desc' },
        take: 1000 // Get last 1000 clicks for analytics
      });

      if (clicks.length === 0) {
        return {
          totalClicks: 0,
          clicksByCountry: [],
          clicksByDomain: [],
          recentClicks: []
        };
      }

      // Group clicks by country
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

      // Group clicks by domain
      const domainStats = clicks.reduce((acc, click) => {
        const existing = acc.find(item => item.domain === click.domain);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ domain: click.domain, count: 1 });
        }
        return acc;
      }, [] as { domain: string; count: number }[]);

      // Get recent clicks (last 10)
      const recentClicks = clicks.slice(0, 10).map(click => ({
        id: click.id,
        domain: click.domain,
        country: click.country,
        clickedAt: click.clickedAt.toISOString()
      }));

      const analytics: ChatClickAnalyticsDto = {
        totalClicks: clicks.length,
        clicksByCountry: countryStats.sort((a, b) => b.count - a.count),
        clicksByDomain: domainStats.sort((a, b) => b.count - a.count),
        recentClicks,
        lastClick: clicks.length > 0 ? clicks[0].clickedAt.toISOString() : undefined
      };

      this.logger.log(`📊 Analytics generated: ${analytics.totalClicks} total clicks, ${analytics.clicksByCountry.length} countries`);
      
      return analytics;

    } catch (error) {
      this.logger.error('❌ Error getting chat click analytics:', error);
      return {
        totalClicks: 0,
        clicksByCountry: [],
        clicksByDomain: [],
        recentClicks: []
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
