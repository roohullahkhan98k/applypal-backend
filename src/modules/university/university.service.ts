import { Injectable, Logger } from '@nestjs/common';
import { WidgetConfigDto, WidgetResponseDto } from './dto/widget-config.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../database/prisma.service';
import { ChatClickService } from './services/chat-click.service';
import { EmailService } from './services/email.service';
import { SetUniversityEmailDto, SendInvitationDto, EmailResponseDto, InvitationResponseDto, BulkInvitationDto, BulkInvitationResponseDto } from './dto/email.dto';
import { InvitedAmbassadorDto, InvitationListResponseDto, UpdateInvitationStatusDto } from './dto/invitation.dto';

@Injectable()
export class UniversityService {
  private readonly logger = new Logger(UniversityService.name);
  private widgetStore = new Map<string, WidgetConfigDto>();
  private iframeLoads = new Map<string, { domain: string; timestamp: string; userAgent: string }[]>();

  constructor(
    private prisma: PrismaService,
    private chatClickService: ChatClickService,
    private emailService: EmailService
  ) {}

  async generateWidget(config: WidgetConfigDto, userId?: string): Promise<WidgetResponseDto> {
    let widgetId: string;
    let isNewWidget = false;

    // Check if user already has a widget
    if (userId) {
      const existingProfile = await this.prisma.universityProfile.findUnique({
        where: { userId }
      });

      if (existingProfile?.widgetId) {
        // User already has a widget, return existing one
        widgetId = existingProfile.widgetId;
        this.logger.log(`Returning existing widget ${widgetId} for user ${userId}`);
      } else {
        // Create new widget for user
        widgetId = uuidv4();
        isNewWidget = true;
        this.logger.log(`Creating new widget ${widgetId} for user ${userId}`);
      }
    } else {
      // No user context, create temporary widget
      widgetId = uuidv4();
      isNewWidget = true;
      this.logger.log(`Creating temporary widget ${widgetId}`);
    }
    
    // Store widget configuration in memory (for backward compatibility)
    this.widgetStore.set(widgetId, config);
    
    // If new widget and user context, save to database
    if (isNewWidget && userId) {
      await this.prisma.universityProfile.upsert({
        where: { userId },
        update: {
          widgetId,
          widgetConfig: config as any,
          isVerified: false,
          updatedAt: new Date()
        },
        create: {
          userId,
          widgetId,
          widgetConfig: config as any,
          isVerified: false
        }
      });
    }
    
    // Generate iframe codes for different formats
    const iframeFormats = this.generateIframeFormats(widgetId);
    
    // Generate preview URL
    const previewUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/university/widget/${widgetId}`;
    
    return {
      iframeCode: iframeFormats.html, // Keep backward compatibility
      iframeFormats,
      previewUrl,
      widgetId,
    };
  }

  async getWidgetConfig(widgetId: string): Promise<WidgetConfigDto | null> {
    return this.widgetStore.get(widgetId) || null;
  }

  /**
   * Get joined ambassadors for a widget (Public - for widget display)
   */
  async getJoinedAmbassadorsForWidget(widgetId: string): Promise<any[]> {
    try {
      // Find university profile by widgetId
      const universityProfile = await this.prisma.universityProfile.findUnique({
        where: { widgetId },
        include: { user: true }
      });

      if (!universityProfile) {
        return [];
      }

      // Get all joined ambassadors for this university
      const joinedInvitations = await this.prisma.invitedAmbassador.findMany({
        where: {
          universityId: universityProfile.userId,
          status: 'JOINED'
        },
        include: {
          // We need to get the ambassador's profile and user info
        }
      });

      // Get ambassador profiles for joined invitations
      const ambassadorProfiles = [];
      for (const invitation of joinedInvitations) {
        // Find user by email
        const ambassadorUser = await this.prisma.user.findUnique({
          where: { email: invitation.ambassadorEmail },
          include: {
            ambassadorProfile: {
              include: {
                socialLinks: true,
                user: true
              }
            }
          }
        });

        if (ambassadorUser?.ambassadorProfile) {
          ambassadorProfiles.push({
            ...ambassadorUser.ambassadorProfile,
            user: ambassadorUser,
            socialLinks: ambassadorUser.ambassadorProfile.socialLinks
          });
        }
      }

      return ambassadorProfiles;
    } catch (error) {
      this.logger.error('Error getting joined ambassadors for widget:', error);
      return [];
    }
  }

  async getUserWidget(userId: string): Promise<WidgetResponseDto | null> {
    try {
      const profile = await this.prisma.universityProfile.findUnique({
        where: { userId },
        include: { user: true }
      });

      if (!profile?.widgetId) {
        return null;
      }

      // Restore widget config to memory if it exists in database
      if (profile.widgetConfig) {
        this.widgetStore.set(profile.widgetId, profile.widgetConfig as WidgetConfigDto);
      }

      // Generate iframe codes
      const iframeFormats = this.generateIframeFormats(profile.widgetId);
      const previewUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/university/widget/${profile.widgetId}`;

      return {
        iframeCode: iframeFormats.html,
        iframeFormats,
        previewUrl,
        widgetId: profile.widgetId,
      };
    } catch (error) {
      this.logger.error(`Error getting user widget for ${userId}:`, error);
      return null;
    }
  }

  async handleIframeLoaded(data: {
    widgetId: string;
    domain: string;
    timestamp: string;
    userAgent: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      const { widgetId, domain, timestamp, userAgent } = data;
      
      // Store the iframe load information
      if (!this.iframeLoads.has(widgetId)) {
        this.iframeLoads.set(widgetId, []);
      }
      
      const loads = this.iframeLoads.get(widgetId);
      loads.push({ domain, timestamp, userAgent });
      
      // Keep only last 10 loads per widget
      if (loads.length > 10) {
        loads.splice(0, loads.length - 10);
      }
      
      // Enhanced logging with emojis and details
      this.logger.log(`🎯 IFRAME INTEGRATION SUCCESS! Widget: ${widgetId}`);
      this.logger.log(`📱 Domain: ${domain}`);
      this.logger.log(`⏰ Timestamp: ${timestamp}`);
      this.logger.log(`🌐 User Agent: ${userAgent.substring(0, 100)}...`);
      this.logger.log(`📊 Total loads for this widget: ${loads.length}`);
      this.logger.log(`✅ Integration Status: ACTIVE`);

      // Mark widget as verified in database
      try {
        await this.prisma.universityProfile.updateMany({
          where: { widgetId },
          data: {
            isVerified: true,
            updatedAt: new Date()
          }
        });
        this.logger.log(`📊 Widget ${widgetId} marked as verified in database`);
      } catch (dbError) {
        this.logger.warn(`Failed to update widget verification in database: ${dbError.message}`);
      }
      
      return {
        success: true,
        message: 'Iframe load notification received successfully'
      };
    } catch (error) {
      console.error('Error handling iframe load notification:', error);
      return {
        success: false,
        message: 'Failed to process iframe load notification'
      };
    }
  }

  async verifyIframeIntegration(widgetId: string, websiteUrl: string): Promise<{
    verified: boolean;
    message: string;
    details?: any;
  }> {
    try {
      // Check if we have iframe load data for this widget
      const loads = this.iframeLoads.get(widgetId);
      
      if (!loads || loads.length === 0) {
        return {
          verified: false,
          message: 'No iframe load data found. Please ensure the iframe is properly embedded and the page has been visited.',
          details: {
            suggestion: 'Make sure the iframe is embedded and someone has visited the page with the iframe'
          }
        };
      }

      // Extract domain from website URL
      const targetDomain = new URL(websiteUrl).hostname;
      
      // Check if any loads match the target domain
      const matchingLoads = loads.filter(load => 
        load.domain === targetDomain || 
        load.domain.includes(targetDomain) ||
        targetDomain.includes(load.domain)
      );

      if (matchingLoads.length > 0) {
        const latestLoad = matchingLoads[matchingLoads.length - 1];
        return {
          verified: true,
          message: 'Iframe successfully verified on the website!',
          details: {
            domain: latestLoad.domain,
            lastSeen: latestLoad.timestamp,
            totalLoads: matchingLoads.length,
            userAgent: latestLoad.userAgent
          }
        };
      }

      return {
        verified: false,
        message: `No iframe loads detected for domain: ${targetDomain}`,
        details: {
          availableDomains: loads.map(load => load.domain),
          suggestion: 'Please visit the website with the embedded iframe and try again'
        }
      };
    } catch (error) {
      console.error('Error verifying iframe integration:', error);
      return {
        verified: false,
        message: 'Error during verification process',
        details: { error: error.message }
      };
    }
  }

  /**
   * Record a chat icon click with full tracking data
   */
  async recordChatClick(clickData: any, ipAddress: string): Promise<{ success: boolean; message: string; clickId?: string }> {
    return this.chatClickService.recordChatClick(clickData, ipAddress);
  }

  /**
   * Get analytics data for a specific widget (only for verified widgets owned by user)
   */
  async getChatClickAnalytics(widgetId: string, userId?: string): Promise<any> {
    // Verify that the widget exists and belongs to the user
    if (userId) {
      const profile = await this.prisma.universityProfile.findFirst({
        where: { 
          widgetId,
          userId,
          isVerified: true
        }
      });
      
      if (!profile) {
        throw new Error('Widget not found or not verified');
      }
    }
    
    return this.chatClickService.getChatClickAnalytics(widgetId);
  }

  /**
   * Get simple click count for a widget (only for verified widgets owned by user)
   */
  async getChatClickCount(widgetId: string, userId?: string): Promise<number> {
    // Verify that the widget exists and belongs to the user
    if (userId) {
      const profile = await this.prisma.universityProfile.findFirst({
        where: { 
          widgetId,
          userId,
          isVerified: true
        }
      });
      
      if (!profile) {
        throw new Error('Widget not found or not verified');
      }
    }
    
    return this.chatClickService.getClickCount(widgetId);
  }

  /**
   * Save answers to chat questions for a specific click
   */
  async saveChatClickAnswers(data: { clickId: string; question1Answer?: string; question2Answer?: string; ambassadorId?: string; ambassadorName?: string }): Promise<{ success: boolean; message: string }> {
    try {
      // Find the chat click record
      const chatClick = await this.prisma.chatClick.findUnique({
        where: { id: data.clickId }
      });

      if (!chatClick) {
        return {
          success: false,
          message: 'Chat click not found'
        };
      }

      // Update the chat click with answers and ambassador info (if not already set)
      const updateData: any = {
        question1Answer: data.question1Answer || null,
        question2Answer: data.question2Answer || null
      };
      
      // Only update ambassador info if not already set (from initial click) or if provided in answers
      if (data.ambassadorId && !(chatClick as any).ambassadorId) {
        updateData.ambassadorId = data.ambassadorId;
      }
      if (data.ambassadorName && !(chatClick as any).ambassadorName) {
        updateData.ambassadorName = data.ambassadorName;
      }

      await this.prisma.chatClick.update({
        where: { id: data.clickId },
        data: updateData
      });

      this.logger.log(`💬 Answers saved for click: ${data.clickId}`);
      if (data.question1Answer) {
        this.logger.log(`📝 Question 1 answer: ${data.question1Answer.substring(0, 50)}...`);
      }
      if (data.question2Answer) {
        this.logger.log(`📝 Question 2 answer: ${data.question2Answer.substring(0, 50)}...`);
      }
      if (data.ambassadorName) {
        this.logger.log(`👤 Ambassador: ${data.ambassadorName}`);
      }

      return {
        success: true,
        message: 'Answers saved successfully'
      };
    } catch (error) {
      this.logger.error('❌ Error saving chat click answers:', error);
      return {
        success: false,
        message: 'Failed to save answers'
      };
    }
  }

  /**
   * Get clicks by country for a widget (only for verified widgets owned by user)
   */
  async getChatClicksByCountry(widgetId: string, userId?: string): Promise<{ country: string; count: number }[]> {
    // Verify that the widget exists and belongs to the user
    if (userId) {
      const profile = await this.prisma.universityProfile.findFirst({
        where: { 
          widgetId,
          userId,
          isVerified: true
        }
      });
      
      if (!profile) {
        throw new Error('Widget not found or not verified');
      }
    }
    
    return this.chatClickService.getClicksByCountry(widgetId);
  }

  async getIntegrationStatus(widgetId: string): Promise<{
    verified: boolean;
    message: string;
    details?: any;
    statistics?: any;
  }> {
    try {
      // Check if widget exists
      const widgetConfig = this.widgetStore.get(widgetId);
      if (!widgetConfig) {
        return {
          verified: false,
          message: 'Widget not found',
          details: { error: 'Invalid widget ID' }
        };
      }

      // Get iframe load data
      const loads = this.iframeLoads.get(widgetId);
      
      if (!loads || loads.length === 0) {
        return {
          verified: false,
          message: 'No iframe loads detected yet',
          details: {
            suggestion: 'Embed the iframe code on your website and visit the page',
            embedCodes: this.generateIframeFormats(widgetId)
          },
          statistics: {
            totalLoads: 0,
            uniqueDomains: 0,
            lastSeen: null
          }
        };
      }

      // Calculate statistics
      const uniqueDomains = [...new Set(loads.map(load => load.domain))];
      const latestLoad = loads[loads.length - 1];
      const totalLoads = loads.length;

      return {
        verified: true,
        message: 'Iframe integration is active!',
        details: {
          latestDomain: latestLoad.domain,
          lastSeen: latestLoad.timestamp,
          totalLoads: totalLoads,
          uniqueDomains: uniqueDomains.length,
          allDomains: uniqueDomains
        },
        statistics: {
          totalLoads: totalLoads,
          uniqueDomains: uniqueDomains.length,
          lastSeen: latestLoad.timestamp,
          domains: uniqueDomains,
          recentLoads: loads.slice(-5) // Last 5 loads
        }
      };
    } catch (error) {
      this.logger.error('Error getting integration status:', error);
      return {
        verified: false,
        message: 'Error retrieving integration status',
        details: { error: error.message }
      };
    }
  }

  private generateIframeFormats(widgetId: string): any {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    const widgetUrl = `${baseUrl}/university/widget/${widgetId}`;
    
    return {
      html: `<iframe 
  src="${widgetUrl}" 
  width="380" 
  height="100vh" 
  frameborder="0" 
  scrolling="no"
  style="border: none; position: fixed; right: 0; top: 50%; transform: translateY(-50%); z-index: 9999; width: 380px; height: 100vh;"
  title="University Navigation Widget">
</iframe>`,
      
      react: `<iframe 
  src="${widgetUrl}" 
  width="380" 
  height="100vh" 
  frameBorder="0" 
  scrolling="no"
  style={{
    border: 'none',
    position: 'fixed',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 9999,
    width: '380px',
    height: '100vh'
  }}
  title="University Navigation Widget"
/>`,
      
      vue: `<iframe 
  :src="'${widgetUrl}'" 
  width="380" 
  height="100vh" 
  frameborder="0" 
  scrolling="no"
  :style="{
    border: 'none',
    position: 'fixed',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 9999,
    width: '380px',
    height: '100vh'
  }"
  title="University Navigation Widget">
</iframe>`,
      
      angular: `<iframe 
  [src]="'${widgetUrl}'" 
  width="380" 
  height="100vh" 
  frameborder="0" 
  scrolling="no"
  [style]="{
    'border': 'none',
    'position': 'fixed',
    'right': '0',
    'top': '50%',
    'transform': 'translateY(-50%)',
    'z-index': '9999',
    'width': '380px',
    'height': '100vh'
  }"
  title="University Navigation Widget">
</iframe>`,
      
      wordpress: `<!-- Add this to your WordPress theme's footer.php or use a plugin -->
<iframe 
  src="${widgetUrl}" 
  width="380" 
  height="100vh" 
  frameborder="0" 
  scrolling="no"
  style="border: none; position: fixed; right: 0; top: 50%; transform: translateY(-50%); z-index: 9999; width: 380px; height: 100vh;"
  title="University Navigation Widget">
</iframe>`,
      
      shopify: `<!-- Add this to your Shopify theme's layout/theme.liquid file before </body> -->
<iframe 
  src="${widgetUrl}" 
  width="380" 
  height="100vh" 
  frameborder="0" 
  scrolling="no"
  style="border: none; position: fixed; right: 0; top: 50%; transform: translateY(-50%); z-index: 9999; width: 380px; height: 100vh;"
  title="University Navigation Widget">
</iframe>`
    };
  }

  private generateIframeCode(widgetId: string): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    const widgetUrl = `${baseUrl}/university/widget/${widgetId}`;
    
    return `<iframe 
  src="${widgetUrl}" 
  width="380" 
  height="100vh" 
  frameborder="0" 
  scrolling="no"
  style="border: none; position: fixed; right: 0; top: 50%; transform: translateY(-50%); z-index: 9999; width: 380px; height: 100vh;"
  title="University Navigation Widget">
</iframe>`;
  }

  generateWidgetHTML(config: WidgetConfigDto, widgetId: string): string {
    const { selectedIcons = [], selectedColor = '#131e42', iconInputs = {} } = config;
    
    // SVG icon mapping (exact same as your Lucide icons)
    const iconMap: { [key: string]: string } = {
      "Home": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
      "User": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      "Mail": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 5L2 7"/></svg>`,
      "Phone": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
      "Calendar": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
      "FileText": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>`,
      "Book": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      "Settings": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
      "Globe": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      "HelpCircle": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
      "Send": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22,2 15,22 11,13 2,9 22,2"/></svg>`,
      "Chat": `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`
    };

    // Build rail icons array (same logic as your frontend)
    const alwaysShowIcons = ["Chat"];
    const filteredSelectedIcons = selectedIcons.filter(icon => !alwaysShowIcons.includes(icon));
    const maxIcons = 5;
    const iconsToAdd = Math.min(filteredSelectedIcons.length, maxIcons - alwaysShowIcons.length);
    
    const railIcons: Array<{name: string, icon: string, label: string, url: string}> = [];
    
    // Add selected icons first
    filteredSelectedIcons.slice(0, iconsToAdd).forEach(iconName => {
      const iconInput = iconInputs[iconName];
      const icon = iconMap[iconName] || iconMap["Chat"];
      const label = iconInput?.label || iconName;
      const url = iconInput?.url || '#';
      railIcons.push({ name: iconName, icon, label, url });
    });
    
    // Add always show icons at the end
    alwaysShowIcons.forEach(iconName => {
      const iconInput = iconInputs[iconName];
      const icon = iconMap[iconName];
      const label = iconInput?.label || iconName;
      const url = iconInput?.url || '#';
      railIcons.push({ name: iconName, icon, label, url });
    });

    // Calculate dynamic height (same as your frontend)
    const iconCount = railIcons.length;
    const baseHeight = 60;
    const iconSpacing = 40;
    const dynamicHeight = baseHeight + (iconCount - 1) * iconSpacing;

    // Build icon HTML
    const iconsHTML = railIcons.map(({ name, icon, label, url }) => {
      // Chat icon should not have a link - just be clickable
      if (name === 'Chat') {
        return `
      <div class="widget-icon" data-tooltip="${label}" data-icon-name="${name}">
        ${icon}
      </div>
    `;
      } else {
        return `
      <div class="widget-icon" data-tooltip="${label}" data-icon-name="${name}">
        <a href="${url}" target="_blank" rel="noopener noreferrer" data-icon-name="${name}">
          ${icon}
        </a>
      </div>
    `;
      }
    }).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Widget Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body {
      height: 100%;
      width: 100%;
      background: transparent;
      overflow: visible;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .widget-container {
      position: relative;
      width: 44px;
      height: ${dynamicHeight}px;
      border-radius: 720px;
      background: rgba(19, 30, 66, 0.95);
      border: none;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      padding: 6px;
      transition: height 0.3s ease-in-out;
      margin: 0;
    }
    
    .main-wrapper {
      position: fixed;
      right: 0;
      top: 0;
      width: 100%;
      height: 100vh;
      pointer-events: none;
      z-index: 9998;
    }
    
    .widget-wrapper {
      position: absolute;
      right: 0;
      margin-right: 20px;
      top: 50%;
      transform: translateY(-50%);
      display: inline-block;
      width: auto;
      height: auto;
      overflow: visible;
      z-index: 9999;
      pointer-events: auto;
    }
    
    .widget-icon {
      position: relative;
      width: 32px;
      height: 32px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
    }
    
    .widget-icon:hover {
      background: ${selectedColor};
    }
    
    .widget-icon a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      text-decoration: none;
      color: #FFFFFF;
    }
    
    .widget-icon svg {
      width: 18px;
      height: 18px;
      color: #FFFFFF;
      fill: none;
      stroke: currentColor;
    }
    
    .tooltip {
      position: absolute;
      right: calc(100% + 12px);
      top: 50%;
      transform: translateY(-50%);
      height: 28px;
      min-width: 101px;
      border-radius: 21px;
      padding: 4px 10px;
      background: rgba(19, 30, 66, 0.95);
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      color: #FFFFFF;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      z-index: 10;
      transition: opacity 0.2s ease-in-out;
      font-weight: 400;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    
    .widget-icon:hover .tooltip {
      opacity: 1;
      visibility: visible;
    }
    
    .chat-modal {
      position: absolute;
      top: calc(100% + 20px);
      right: 0;
      width: 320px;
      max-width: calc(100vw - 40px);
      max-height: 400px;
      border-radius: 16px;
      background: rgba(19, 30, 66, 0.98);
      border: none;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      padding: 20px;
      display: none;
      flex-direction: column;
      z-index: 999999;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      white-space: normal;
      word-wrap: break-word;
    }
    
    .chat-modal.show {
      display: flex;
      opacity: 1;
    }
    
    .chat-modal-question {
      font-size: 14px;
      color: #FFFFFF;
      margin-bottom: 16px;
      font-weight: 500;
      line-height: 1.5;
      white-space: normal;
      word-wrap: break-word;
      text-align: left;
      writing-mode: horizontal-tb;
      text-orientation: mixed;
    }
    
    .chat-modal-textarea {
      width: 100%;
      min-height: 80px;
      padding: 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      border: 0.6px solid rgba(255, 255, 255, 0.3);
      color: #FFFFFF;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      margin-bottom: 16px;
      outline: none;
    }
    
    .chat-modal-textarea::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    .chat-modal-buttons {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    
    .chat-modal-btn {
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .chat-modal-btn.skip {
      background: rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
      border: 0.6px solid rgba(255, 255, 255, 0.3);
    }
    
    .chat-modal-btn.skip:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .chat-modal-btn.send {
      background: ${selectedColor};
      color: #FFFFFF;
    }
    
    .chat-modal-btn.send:hover {
      opacity: 0.9;
    }
    
    .chat-modal-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .ambassador-sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: 377px;
      height: 100vh;
      background: rgba(19, 30, 66, 0.98);
      border: none;
      box-shadow: 2px 0 16px rgba(0, 0, 0, 0.3);
      display: none;
      flex-direction: column;
      z-index: 999999;
      overflow-y: auto;
      padding: 0;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    
    .ambassador-sidebar.show {
      display: flex;
      opacity: 1;
    }
    
    .ambassador-sidebar-header {
      position: relative;
      padding: 12.5px;
      padding-bottom: 5px;
    }
    
    .ambassador-sidebar-close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 28px;
      height: 28px;
      border: none;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10002;
      transition: all 0.2s ease;
    }
    
    .ambassador-sidebar-close:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.1);
    }
    
    .ambassador-sidebar-close svg {
      width: 16px;
      height: 16px;
      color: #FFFFFF;
      stroke: currentColor;
      stroke-width: 2.5;
    }
    
    .ambassador-profile {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 0 12.5px 12.5px 12.5px;
    }
    
    .widget-icon-loader {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255, 255, 255, 0.2);
      border-top-color: #FFFFFF;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      z-index: 10001;
      pointer-events: none;
    }
    
    @keyframes spin {
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    .ambassador-card {
      width: 100%;
      max-width: 352px;
      height: 180px;
      background: #F9FAFC;
      border: 1px solid #D0D0D0;
      border-radius: 8px;
      padding: 12.5px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      overflow: visible;
    }
    
    .ambassador-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .ambassador-card-avatar-wrapper {
      width: 45px;
      height: 45px;
      flex-shrink: 0;
      position: relative;
    }
    
    .ambassador-card-avatar-img {
      width: 45px;
      height: 45px;
      border-radius: 110.29px;
      object-fit: cover;
      display: block;
    }
    
    .ambassador-card-avatar-placeholder {
      width: 45px;
      height: 45px;
      border-radius: 110.29px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
    }
    
    .ambassador-card-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      min-width: 0;
      overflow: visible;
      max-width: 100%;
    }
    
    .ambassador-card-name-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      flex-wrap: wrap;
      gap: 4px;
    }
    
    .ambassador-card-name {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 14px;
      line-height: 19px;
      letter-spacing: 0%;
      vertical-align: middle;
      color: #000000;
      margin: 0;
    }
    
    .ambassador-card-country {
      font-family: 'Poppins', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 11px;
      line-height: 19px;
      letter-spacing: 0%;
      vertical-align: middle;
      color: #8A8A8A;
      margin: 0;
    }
    
    .ambassador-card-studying {
      font-family: 'Poppins', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 11px;
      line-height: 19px;
      letter-spacing: 0%;
      vertical-align: middle;
      color: #8A8A8A;
      margin: 0;
    }
    
    .ambassador-card-course {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 11px;
      line-height: 19px;
      letter-spacing: 0%;
      vertical-align: middle;
      color: #000000;
      margin: 0;
    }
    
    .ambassador-card-university {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-style: normal;
      font-size: 11px;
      line-height: 19px;
      letter-spacing: 0%;
      vertical-align: middle;
      color: #000000;
      margin: 0;
    }
    
    .ambassador-card-about {
      font-family: 'Poppins', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      line-height: 19px;
      letter-spacing: 0%;
      color: #848484;
      margin-top: 13px;
      margin-left: -36px;
      padding-left: 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      width: calc(100% + 36px);
      max-width: calc(100% + 57px);
      box-sizing: border-box;
      max-height: calc(19px * 3);
      position: relative;
    }
    
    .ambassador-card-ask {
      font-family: 'Poppins', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 12px;
      line-height: 19px;
      letter-spacing: 0%;
      color: #000000;
      margin: 4px 0 0 0;
      text-align: right;
      cursor: pointer;
      text-decoration: none;
      transition: opacity 0.2s ease;
    }
    
    .ambassador-card-ask:hover {
      opacity: 0.7;
    }
    
    .ambassador-profile-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #FFFFFF;
      margin-bottom: 16px;
    }
    
    .ambassador-profile-name {
      font-size: 20px;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 8px;
      text-align: center;
    }
    
    .ambassador-profile-subject {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 16px;
      text-align: center;
    }
    
    .ambassador-ask-button {
      width: 100%;
      padding: 12px 24px;
      border-radius: 8px;
      border: 1px solid #FFFFFF;
      background: ${selectedColor};
      color: #FFFFFF;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 20px;
    }
    
    .ambassador-ask-button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    
    .ambassador-info {
      margin-top: 20px;
    }
    
    .ambassador-info-section {
      margin-bottom: 20px;
    }
    
    .ambassador-info-title {
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 8px;
    }
    
    .ambassador-info-text {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="main-wrapper">
    <div class="widget-wrapper">
      <div class="widget-container">
        ${iconsHTML}
      </div>
      <!-- Chat Modal positioned below widget-wrapper -->
      <div class="chat-modal" id="chatModal">
        <div class="chat-modal-question" id="chatModalQuestion"></div>
        <textarea class="chat-modal-textarea" id="chatModalTextarea" placeholder="Type your answer here..."></textarea>
        <div class="chat-modal-buttons">
          <button class="chat-modal-btn skip" id="chatModalSkip">Skip</button>
          <button class="chat-modal-btn send" id="chatModalSend">Send</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Ambassador Sidebar -->
  <div class="ambassador-sidebar" id="ambassadorSidebar">
    <div class="ambassador-sidebar-header">
      <button class="ambassador-sidebar-close" id="ambassadorSidebarClose" title="Close">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="ambassador-profile" id="ambassadorProfileContent">
      <!-- Ambassador profile will be loaded here -->
    </div>
  </div>
  
  <script>
    // Add tooltip functionality and chat click tracking
    document.addEventListener('DOMContentLoaded', function() {
      const icons = document.querySelectorAll('.widget-icon');
      let maxTooltipWidth = 0;
      
      icons.forEach(icon => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = icon.getAttribute('data-tooltip');
        icon.appendChild(tooltip);
        
        // Show tooltip on hover
        icon.addEventListener('mouseenter', function() {
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
        });
        
        icon.addEventListener('mouseleave', function() {
          tooltip.style.visibility = 'hidden';
          tooltip.style.opacity = '0';
        });

        // Track chat icon clicks and show modal or sidebar
        const iconName = icon.getAttribute('data-icon-name');
        
        if (iconName === 'Chat') {
          // Chat icon has no link, so attach click listener directly to the icon div
          icon.addEventListener('click', async function(e) {
            // Track the chat icon click first
            const clickData = {
              widgetId: '${widgetId}',
              domain: document.referrer || window.location.hostname,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent
            };
            
            // Show loading state on chat icon - add loader overlay
            let loader = document.createElement('div');
            loader.className = 'widget-icon-loader';
            loader.id = 'chatIconLoader';
            icon.style.position = 'relative';
            icon.appendChild(loader);
            
            try {
              // Check if there are joined ambassadors for this widget
              const ambassadorsResponse = await fetch('${process.env.BASE_URL || 'http://localhost:3001'}/university/widget/${widgetId}/joined-ambassadors');
              const ambassadors = await ambassadorsResponse.json();
              
              if (ambassadors && ambassadors.length > 0) {
                // Show ambassador sidebar with all ambassadors
                showAmbassadorSidebar(ambassadors, clickData, icon);
              } else {
                // No ambassador joined - remove loading and show regular modal
                const loaderElement = document.getElementById('chatIconLoader');
                if (loaderElement) loaderElement.remove();
                verifyRecaptcha('chat_click', function(verified) {
                  if (verified) {
                    fetch('${process.env.BASE_URL || 'http://localhost:3001'}/university/widget/chat-click', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(clickData)
                    })
                    .then(response => response.json())
                    .then(data => {
                      console.log('💬 Chat click tracked:', data);
                      window.chatClickId = data.clickId;
                      showChatModal(1, clickData);
                    })
                    .catch(err => {
                      console.log('Could not track chat click:', err);
                      showChatModal(1, clickData);
                    });
                  } else {
                    alert('Please complete the verification to continue.');
                    const loaderElement = document.getElementById('chatIconLoader');
                    if (loaderElement) loaderElement.remove();
                  }
                });
              }
            } catch (error) {
              console.log('Error checking ambassadors or tracking click:', error);
              const loaderElement = document.getElementById('chatIconLoader');
              if (loaderElement) loaderElement.remove();
              // Fallback to regular modal if there's an error
              verifyRecaptcha('chat_click', function(verified) {
                if (verified) {
                  fetch('${process.env.BASE_URL || 'http://localhost:3001'}/university/widget/chat-click', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(clickData)
                  })
                  .then(response => response.json())
                  .then(data => {
                    window.chatClickId = data.clickId;
                    showChatModal(1, clickData);
                  })
                  .catch(err => {
                    showChatModal(1, clickData);
                  });
                } else {
                  alert('Please complete the verification to continue.');
                  const loaderElement = document.getElementById('chatIconLoader');
                  if (loaderElement) loaderElement.remove();
                }
              });
            }
          });
        }
      });
      
      // Chat modal functionality
      const chatModal = document.getElementById('chatModal');
      const chatModalQuestion = document.getElementById('chatModalQuestion');
      const chatModalTextarea = document.getElementById('chatModalTextarea');
      const chatModalSkip = document.getElementById('chatModalSkip');
      const chatModalSend = document.getElementById('chatModalSend');
      
      console.log('🔍 Modal elements found:', {
        modal: !!chatModal,
        question: !!chatModalQuestion,
        textarea: !!chatModalTextarea,
        skip: !!chatModalSkip,
        send: !!chatModalSend
      });
      
      const questions = [
        'What would you like to know?',
        'Is there anything else we can help you with?'
      ];
      
      let currentQuestionIndex = 0;
      let questionAnswers = {
        question1: null,
        question2: null
      };
      let clickDataForAnswers = null;
      
      // Ambassador sidebar functionality
      const ambassadorSidebar = document.getElementById('ambassadorSidebar');
      const ambassadorProfileContent = document.getElementById('ambassadorProfileContent');
      let currentAmbassadorData = null;
      let currentClickData = null;
      
      function showAmbassadorSidebar(ambassadors, clickData, chatIconElement) {
        currentClickData = clickData;
        
        // NOTE: We do NOT track click here when ambassadors exist
        // Click will only be tracked when user clicks "Ask me a question" button
        
        // Populate ambassador cards
        const baseUrl = '${process.env.BASE_URL || 'http://localhost:3001'}';
        let profileHTML = '';
        
        // Create a card for each ambassador
        ambassadors.forEach((ambassador, index) => {
          // Construct image URL properly
          let profileImageUrl = null;
          if (ambassador.profileImage) {
            // Check if it's already a complete URL (http/https) or data URI
            if (ambassador.profileImage.startsWith('http://') || 
                ambassador.profileImage.startsWith('https://') ||
                ambassador.profileImage.startsWith('data:')) {
              // Use it directly (already complete URL or data URI)
              profileImageUrl = ambassador.profileImage;
            } else {
              // It's a relative path, prepend baseUrl
              profileImageUrl = baseUrl + (ambassador.profileImage.startsWith('/') ? ambassador.profileImage : '/' + ambassador.profileImage);
            }
            console.log('🖼️ Image URL for ambassador:', profileImageUrl.substring(0, 100) + '...');
          } else {
            console.log('⚠️ No profile image for ambassador:', ambassador);
          }
          
          const ambassadorName = (ambassador.user && ambassador.user.fullName) || ambassador.ambassadorName || 'Ambassador';
          const originCountry = ambassador.countryOriginal || '';
          const studyingCountry = ambassador.countryCurrent || ambassador.currentlyLivingCountry || '';
          const courseName = ambassador.subject || '';
          const universityName = ambassador.currentUniversityName || (ambassador.user && ambassador.user.university) || '';
          
          profileHTML += '<div class="ambassador-card" data-ambassador-index="' + index + '">';
          
          // Avatar - always create placeholder, then try to load image
          profileHTML += '<div class="ambassador-card-avatar-wrapper">';
          if (profileImageUrl) {
            profileHTML += '<img src="' + profileImageUrl + '" alt="' + ambassadorName + '" class="ambassador-card-avatar-img" onerror="this.style.display=\\'none\\'; this.nextElementSibling.style.display=\\'flex\\';">';
          }
          profileHTML += '<div class="ambassador-card-avatar-placeholder" style="' + (profileImageUrl ? 'display: none;' : 'display: flex;') + ' background: #DDDDDD; align-items: center; justify-content: center; color: #999999; font-size: 20px;">👤</div>';
          profileHTML += '</div>';
          
          // Card info section
          profileHTML += '<div class="ambassador-card-info">';
          
          // First line: Name, from country (left), studying in country (right)
          profileHTML += '<div class="ambassador-card-name-row">';
          profileHTML += '<div style="display: flex; align-items: center; gap: 4px;">';
          profileHTML += '<p class="ambassador-card-name">' + ambassadorName + '</p>';
          profileHTML += '<span class="ambassador-card-studying">from</span>';
          if (originCountry) {
            profileHTML += '<span class="ambassador-card-country">' + originCountry + '</span>';
          }
          profileHTML += '</div>';
          if (studyingCountry) {
            profileHTML += '<div style="display: flex; align-items: center; gap: 4px;">';
            profileHTML += '<span class="ambassador-card-studying">studying in</span>';
            profileHTML += '<span class="ambassador-card-country">' + studyingCountry + '</span>';
            profileHTML += '</div>';
          }
          profileHTML += '</div>';
          
          // Second line: studying in, course name, at, university name
          if (courseName || universityName) {
            profileHTML += '<div class="ambassador-card-name-row" style="margin-top: 4px;">';
            profileHTML += '<div style="display: flex; align-items: center; gap: 4px;">';
            profileHTML += '<span class="ambassador-card-studying">studying</span>';
            if (courseName) {
              profileHTML += '<span class="ambassador-card-course">' + courseName + '</span>';
            }
            if (universityName) {
              profileHTML += '<span class="ambassador-card-studying">at</span>';
              profileHTML += '<span class="ambassador-card-university">' + universityName + '</span>';
            }
            profileHTML += '</div>';
            profileHTML += '</div>';
          }
          
          // About me section (3 lines with ellipsis) - aligned with image start
          const aboutText = ambassador.whyStudyingCourse || ambassador.skilsExperience || '';
          if (aboutText) {
            // Escape HTML to prevent issues
            const safeAboutText = aboutText.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
            profileHTML += '<div class="ambassador-card-about">' + safeAboutText + '</div>';
          }
          
          // Ask me a question (right aligned)
          profileHTML += '<div class="ambassador-card-ask" data-card-index="' + index + '">Ask me a question</div>';
          
          profileHTML += '</div>';
          
          profileHTML += '</div>';
        });
        
        ambassadorProfileContent.innerHTML = profileHTML;
        
        // Store ambassadors data for later use
        window.ambassadorsData = ambassadors;
        
        // Add click handlers to "Ask me a question" buttons
        const askButtons = ambassadorProfileContent.querySelectorAll('.ambassador-card-ask');
        
        // Handle "Ask me a question" clicks
        askButtons.forEach((askBtn) => {
          askBtn.addEventListener('click', async function(e) {
            e.stopPropagation(); // Prevent any parent click handlers
            const cardIndex = parseInt(askBtn.getAttribute('data-card-index') || '0');
            const selectedAmbassador = ambassadors[cardIndex];
            currentAmbassadorData = selectedAmbassador;
            
            // Get ambassador info
            const ambassadorId = selectedAmbassador.id || selectedAmbassador.userId || null;
            const ambassadorName = (selectedAmbassador.user && selectedAmbassador.user.fullName) || 
                                  selectedAmbassador.ambassadorName || 
                                  'Unknown';
            
            // Track the chat click with ambassador info
            const clickDataWithAmbassador = {
              ...clickData,
              ambassadorId: ambassadorId,
              ambassadorName: ambassadorName
            };
            
            try {
              const clickResponse = await fetch('${process.env.BASE_URL || 'http://localhost:3001'}/university/widget/chat-click', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(clickDataWithAmbassador)
              });
              const data = await clickResponse.json();
              console.log('💬 Chat click tracked with ambassador:', data);
              window.chatClickId = data.clickId;
              clickDataForAnswers = clickDataWithAmbassador;
            } catch (err) {
              console.log('Could not track chat click:', err);
            }
            
            // Close sidebar and show questions modal
            hideAmbassadorSidebar();
            showChatModal(1, clickDataWithAmbassador);
          });
        });
        
        // Show sidebar
        ambassadorSidebar.style.display = 'flex';
        setTimeout(() => {
          ambassadorSidebar.classList.add('show');
          // Remove loading overlay from chat icon when sidebar is shown
          if (chatIconElement) {
            const loaderElement = document.getElementById('chatIconLoader');
            if (loaderElement) loaderElement.remove();
          }
        }, 10);
        
        // Notify parent window
        notifyParentModalOpen();
      }
      
      function hideAmbassadorSidebar() {
        ambassadorSidebar.classList.remove('show');
        setTimeout(() => {
          ambassadorSidebar.style.display = 'none';
        }, 300);
        currentAmbassadorData = null;
        currentClickData = null;
        if (window.ambassadorsData) {
          delete window.ambassadorsData;
        }
      }
      
      // Close button handler
      const sidebarCloseBtn = document.getElementById('ambassadorSidebarClose');
      if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', function() {
          hideAmbassadorSidebar();
        });
      }
      
      // Card click handlers are added directly in showAmbassadorSidebar function
      // Sidebar closes when clicking outside (handled in the document click listener below)
      
      // Function to notify parent window
      const notifyParentModalOpen = function() {
        try {
          window.parent.postMessage({ type: 'chatModalOpened', widgetId: '${widgetId}' }, '*');
        } catch (e) {
          // Cross-origin - ignore
        }
      };
      
      function showChatModal(questionIndex, clickData) {
        if (!chatModal) {
          console.error('❌ Chat modal element not found!');
          return;
        }
        
        currentQuestionIndex = questionIndex - 1; // Convert to 0-based index
        clickDataForAnswers = clickData;
        chatModalQuestion.textContent = questions[currentQuestionIndex];
        chatModalTextarea.value = '';
        
        // Modal is positioned absolutely below the widget-wrapper
        // CSS handles positioning with top: calc(100% + 20px) and right: 0
        // No need to set inline styles - CSS handles it
        
        // Force display before adding show class for transition
        chatModal.style.display = 'flex';
        setTimeout(() => {
          chatModal.classList.add('show');
        }, 10);
        
        // Notify parent window
        notifyParentModalOpen();
        
        console.log('📱 Chat modal shown', {
          question: questions[currentQuestionIndex],
          hasShowClass: chatModal.classList.contains('show')
        });
      }
      
      function hideChatModal() {
        chatModal.classList.remove('show');
        currentQuestionIndex = 0;
        questionAnswers = { question1: null, question2: null };
        clickDataForAnswers = null;
      }
      
      function sendAnswers() {
        if (!clickDataForAnswers || !window.chatClickId) {
          console.log('No click data or click ID available');
          return;
        }
        
        // Get ambassador info if available
        const ambassadorId = currentAmbassadorData?.id || currentAmbassadorData?.userId || null;
        const ambassadorName = currentAmbassadorData ? (
          (currentAmbassadorData.user && currentAmbassadorData.user.fullName) || 
          currentAmbassadorData.ambassadorName || 
          'Unknown'
        ) : null;
        
        // Send answers to backend
        fetch('${process.env.BASE_URL || 'http://localhost:3001'}/university/widget/chat-click-answers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clickId: window.chatClickId,
            question1Answer: questionAnswers.question1,
            question2Answer: questionAnswers.question2,
            ambassadorId: ambassadorId,
            ambassadorName: ambassadorName
          })
        }).then(response => response.json())
          .then(data => {
            console.log('✅ Answers saved:', data);
          })
          .catch(err => {
            console.log('Could not save answers:', err);
          });
      }
      
      chatModalSkip.addEventListener('click', function() {
        // Skip current question - go to next or close
        if (currentQuestionIndex === 0) {
          // Skipped first question, show second
          currentQuestionIndex = 1;
          chatModalQuestion.textContent = questions[currentQuestionIndex];
          chatModalTextarea.value = '';
        } else {
          // Skipped second question, close modal
          sendAnswers(); // Send whatever answers we have (if any)
          hideChatModal();
        }
      });
      
      chatModalSend.addEventListener('click', function() {
        const answer = chatModalTextarea.value.trim();
        
        if (currentQuestionIndex === 0) {
          // First question
          questionAnswers.question1 = answer || null;
          // Show second question
          currentQuestionIndex = 1;
          chatModalQuestion.textContent = questions[currentQuestionIndex];
          chatModalTextarea.value = '';
        } else {
          // Second question - save and close
          questionAnswers.question2 = answer || null;
          sendAnswers();
          hideChatModal();
        }
      });
      
      // Close modal when clicking outside - check both iframe and parent window
      document.addEventListener('click', function(e) {
        if (chatModal.classList.contains('show') && 
            !chatModal.contains(e.target) && 
            !e.target.closest('.widget-icon[data-icon-name="Chat"]')) {
          // Save answers and close if on second question or if clicking outside modal
          sendAnswers();
          hideChatModal();
        }
        
        // Close sidebar when clicking outside
        if (ambassadorSidebar && ambassadorSidebar.classList.contains('show') && 
            !ambassadorSidebar.contains(e.target) && 
            !e.target.closest('.widget-icon[data-icon-name="Chat"]')) {
          hideAmbassadorSidebar();
        }
      });
      
      // Close modal when clicking outside in parent window
      // Since we're in an iframe, we need to communicate with parent
      window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'closeChatModal') {
          if (chatModal.classList.contains('show')) {
            sendAnswers();
            hideChatModal();
          }
        }
      });
      
      
      // Notify backend that iframe is loaded
      try {
        fetch('${process.env.BASE_URL || 'http://localhost:3001'}/university/widget/iframe-loaded', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            widgetId: '${widgetId}',
            domain: document.referrer || window.location.hostname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          })
        }).catch(err => console.log('Could not notify backend:', err));
      } catch (error) {
        console.log('Iframe loaded notification failed:', error);
      }
    });
    </script>
  </body>
</html>`;
  }

  /**
   * Set university email address
   */
  async setUniversityEmail(userId: string, emailData: SetUniversityEmailDto): Promise<EmailResponseDto> {
    try {
      // Check if email is already taken by another university
      const existingEmail = await this.prisma.universityProfile.findFirst({
        where: {
          email: emailData.email,
          userId: { not: userId }
        }
      });

      if (existingEmail) {
        return {
          success: false,
          message: 'This email is already registered to another university'
        };
      }

      // Update or create university profile with email
      const universityProfile = await this.prisma.universityProfile.upsert({
        where: { userId },
        update: {
          email: emailData.email,
          updatedAt: new Date()
        },
        create: {
          userId,
          email: emailData.email
        }
      });

      this.logger.log(`📧 University email set: ${emailData.email} for user ${userId}`);

      return {
        success: true,
        message: 'University email set successfully',
        email: emailData.email
      };

    } catch (error) {
      this.logger.error(`❌ Failed to set university email: ${error.message}`);
      return {
        success: false,
        message: `Failed to set email: ${error.message}`
      };
    }
  }

  /**
   * Get university email address
   */
  async getUniversityEmail(userId: string): Promise<{ email?: string; hasEmail: boolean }> {
    try {
      const universityProfile = await this.prisma.universityProfile.findUnique({
        where: { userId },
        select: { email: true }
      });

      return {
        email: universityProfile?.email || undefined,
        hasEmail: !!universityProfile?.email
      };

    } catch (error) {
      this.logger.error(`❌ Failed to get university email: ${error.message}`);
      return { hasEmail: false };
    }
  }

  /**
   * Send ambassador invitation
   */
  async sendAmbassadorInvitation(userId: string, invitationData: SendInvitationDto): Promise<InvitationResponseDto> {
    try {
      // Get university profile with email and user name
      const universityProfile = await this.prisma.universityProfile.findUnique({
        where: { userId },
        select: { 
          email: true, 
          user: { 
            select: { fullName: true } 
          } 
        }
      });

      if (!universityProfile?.email) {
        return {
          success: false,
          message: 'University email not set. Please set your email address first.',
          sentTo: invitationData.ambassadorEmail
        };
      }

      // Use provided university name or fallback to user name
      const universityName = invitationData.universityName || universityProfile.user.fullName || 'University';

      // Send invitation email
      const result = await this.emailService.sendAmbassadorInvitation(
        invitationData,
        universityProfile.email,
        universityName
      );

      if (result.success) {
        // Create invitation record in database
        await this.prisma.invitedAmbassador.create({
          data: {
            universityId: userId,
            ambassadorName: invitationData.ambassadorName,
            ambassadorEmail: invitationData.ambassadorEmail,
            status: 'INVITED'
          }
        });

        this.logger.log(`📧 Invitation sent from ${universityName} (${universityProfile.email}) to ${invitationData.ambassadorEmail}`);
        this.logger.log(`📝 Invitation record created in database`);
      }

      return {
        success: result.success,
        message: result.message,
        sentTo: invitationData.ambassadorEmail
      };

    } catch (error) {
      this.logger.error(`❌ Failed to send ambassador invitation: ${error.message}`);
      return {
        success: false,
        message: `Failed to send invitation: ${error.message}`,
        sentTo: invitationData.ambassadorEmail
      };
    }
  }

  /**
   * Get all invited ambassadors for a university
   */
  async getInvitedAmbassadors(userId: string): Promise<InvitationListResponseDto> {
    try {
      const invitations = await this.prisma.invitedAmbassador.findMany({
        where: { universityId: userId },
        orderBy: { invitedAt: 'desc' },
        select: {
          id: true,
          ambassadorName: true,
          ambassadorEmail: true,
          status: true,
          invitedAt: true,
          respondedAt: true
        }
      });

      // Count by status
      const statusCounts = invitations.reduce((acc, invitation) => {
        acc[invitation.status]++;
        return acc;
      }, { INVITED: 0, ACCEPTED: 0, DECLINED: 0, JOINED: 0 });

      this.logger.log(`📊 Retrieved ${invitations.length} invitations for university ${userId}`);

      return {
        invitations: invitations.map(invitation => ({
          id: invitation.id,
          ambassadorName: invitation.ambassadorName,
          ambassadorEmail: invitation.ambassadorEmail,
          status: invitation.status as 'INVITED' | 'ACCEPTED' | 'DECLINED' | 'JOINED',
          invitedAt: invitation.invitedAt.toISOString(),
          respondedAt: invitation.respondedAt?.toISOString()
        })),
        totalCount: invitations.length,
        statusCounts
      };

    } catch (error) {
      this.logger.error(`❌ Failed to get invited ambassadors: ${error.message}`);
      return {
        invitations: [],
        totalCount: 0,
        statusCounts: { INVITED: 0, ACCEPTED: 0, DECLINED: 0, JOINED: 0 }
      };
    }
  }

  /**
   * Update invitation status (for frontend decline/accept handling)
   */
  async updateInvitationStatus(
    ambassadorEmail: string, 
    status: 'ACCEPTED' | 'DECLINED'
  ): Promise<{ success: boolean; message: string }> {
    try {
      const invitation = await this.prisma.invitedAmbassador.findFirst({
        where: { ambassadorEmail }
      });

      if (!invitation) {
        return {
          success: false,
          message: 'Invitation not found'
        };
      }

      await this.prisma.invitedAmbassador.update({
        where: { id: invitation.id },
        data: {
          status,
          respondedAt: new Date()
        }
      });

      this.logger.log(`📝 Invitation status updated to ${status} for ${ambassadorEmail}`);

      return {
        success: true,
        message: `Invitation ${status.toLowerCase()} successfully`
      };

    } catch (error) {
      this.logger.error(`❌ Failed to update invitation status: ${error.message}`);
      return {
        success: false,
        message: `Failed to update status: ${error.message}`
      };
    }
  }

  /**
   * Send bulk ambassador invitations
   */
  async sendBulkAmbassadorInvitations(userId: string, bulkData: BulkInvitationDto): Promise<BulkInvitationResponseDto> {
    try {
      // Get university profile with email and user name
      const universityProfile = await this.prisma.universityProfile.findUnique({
        where: { userId },
        select: { 
          email: true, 
          user: { 
            select: { fullName: true } 
          } 
        }
      });

      if (!universityProfile?.email) {
        return {
          success: false,
          message: 'University email not set. Please set your email address first.',
          totalSent: 0,
          totalFailed: bulkData.ambassadors.length,
          results: bulkData.ambassadors.map(amb => ({
            name: amb.name,
            email: amb.email,
            success: false,
            error: 'University email not set'
          }))
        };
      }

      // Use provided university name or fallback to user name
      const universityName = bulkData.universityName || universityProfile.user.fullName || 'University';

      const results = [];
      let totalSent = 0;
      let totalFailed = 0;

      // Process each ambassador invitation
      for (const ambassador of bulkData.ambassadors) {
        try {
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(ambassador.email)) {
            results.push({
              name: ambassador.name,
              email: ambassador.email,
              success: false,
              error: 'Invalid email format'
            });
            totalFailed++;
            continue;
          }

          // Send invitation email
          const emailResult = await this.emailService.sendAmbassadorInvitation(
            {
              ambassadorName: ambassador.name,
              ambassadorEmail: ambassador.email,
              universityName
            },
            universityProfile.email,
            universityName
          );

          if (emailResult.success) {
            // Create invitation record in database
            await this.prisma.invitedAmbassador.create({
              data: {
                universityId: userId,
                ambassadorName: ambassador.name,
                ambassadorEmail: ambassador.email,
                status: 'INVITED'
              }
            });

            results.push({
              name: ambassador.name,
              email: ambassador.email,
              success: true
            });
            totalSent++;

            this.logger.log(`📧 Bulk invitation sent to ${ambassador.name} (${ambassador.email})`);
          } else {
            results.push({
              name: ambassador.name,
              email: ambassador.email,
              success: false,
              error: emailResult.message
            });
            totalFailed++;
          }

        } catch (error) {
          results.push({
            name: ambassador.name,
            email: ambassador.email,
            success: false,
            error: `Failed to send: ${error.message}`
          });
          totalFailed++;
        }
      }

      this.logger.log(`📊 Bulk invitations completed: ${totalSent} sent, ${totalFailed} failed`);

      return {
        success: totalSent > 0,
        message: `Bulk invitations completed: ${totalSent} sent, ${totalFailed} failed`,
        totalSent,
        totalFailed,
        results
      };

    } catch (error) {
      this.logger.error(`❌ Failed to send bulk invitations: ${error.message}`);
      return {
        success: false,
        message: `Failed to send bulk invitations: ${error.message}`,
        totalSent: 0,
        totalFailed: bulkData.ambassadors.length,
        results: bulkData.ambassadors.map(amb => ({
          name: amb.name,
          email: amb.email,
          success: false,
          error: 'System error'
        }))
      };
    }
  }

  /**
   * Check if an email was invited and get invitation status
   */
  async checkInvitationStatus(email: string): Promise<{ wasInvited: boolean; status?: string; universityName?: string }> {
    try {
      const invitation = await this.prisma.invitedAmbassador.findFirst({
        where: { ambassadorEmail: email },
        include: {
          university: {
            include: {
              user: {
                select: { fullName: true }
              }
            }
          }
        }
      });

      if (!invitation) {
        return { wasInvited: false };
      }

      return {
        wasInvited: true,
        status: invitation.status,
        universityName: invitation.university.user.fullName
      };

    } catch (error) {
      this.logger.error(`❌ Error checking invitation status for ${email}:`, error);
      return { wasInvited: false };
    }
  }
}
