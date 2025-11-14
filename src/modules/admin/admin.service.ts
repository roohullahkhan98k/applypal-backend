import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const [
      totalUsers,
      totalUniversities,
      totalAmbassadors,
      totalChatClicks,
      totalInvitations,
      universityProfiles,
      verifiedWidgets,
      recentChatClicks,
      recentSignups,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'university' } }),
      this.prisma.user.count({ where: { role: 'ambassador' } }),
      this.prisma.chatClick.count(),
      this.prisma.invitedAmbassador.count(),
      this.prisma.universityProfile.findMany({
        select: { widgetId: true, isVerified: true },
      }),
      this.prisma.universityProfile.count({ where: { isVerified: true } }),
      this.prisma.chatClick.count({
        where: {
          clickedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    const activeWidgets = universityProfiles.filter((p) => p.widgetId).length;

    return {
      totalUsers,
      totalUniversities,
      totalAmbassadors,
      totalChatClicks,
      totalInvitations,
      activeWidgets,
      verifiedWidgets,
      recentChatClicks,
      recentSignups,
    };
  }

  /**
   * Get all universities with their statistics
   */
  async getAllUniversities(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [universities, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'university' },
        include: {
          universityProfile: {
            include: {
              _count: {
                select: {
                  invitedAmbassadors: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { role: 'university' } }),
    ]);

    // Get chat click counts for each university
    const universitiesWithStats = await Promise.all(
      universities.map(async (uni) => {
        const widgetId = uni.universityProfile?.widgetId;
        const chatClickCount = widgetId
          ? await this.prisma.chatClick.count({
              where: { widgetId },
            })
          : 0;

        return {
          id: uni.id,
          userId: uni.id,
          fullName: uni.fullName,
          email: uni.email,
          university: uni.university,
          widgetId: uni.universityProfile?.widgetId || null,
          isVerified: uni.universityProfile?.isVerified || false,
          universityEmail: uni.universityProfile?.email || null,
          totalInvitations:
            uni.universityProfile?._count?.invitedAmbassadors || 0,
          totalChatClicks: chatClickCount,
          createdAt: uni.createdAt,
        };
      }),
    );

    return {
      universities: universitiesWithStats,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all ambassadors with their profiles
   */
  async getAllAmbassadors(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [ambassadors, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'ambassador' },
        include: {
          ambassadorProfile: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { role: 'ambassador' } }),
    ]);

    const ambassadorsWithProfiles = ambassadors.map((amb) => ({
      id: amb.ambassadorProfile?.id || null,
      userId: amb.id,
      fullName: amb.fullName,
      email: amb.email,
      university: amb.university,
      subject: amb.ambassadorProfile?.subject || null,
      countryOriginal: amb.ambassadorProfile?.countryOriginal || null,
      countryCurrent: amb.ambassadorProfile?.countryCurrent || null,
      currentlyLivingCountry:
        amb.ambassadorProfile?.currentlyLivingCountry || null,
      currentUniversityName:
        amb.ambassadorProfile?.currentUniversityName || null,
      profileImage: amb.ambassadorProfile?.profileImage || null,
      hasProfile: !!amb.ambassadorProfile,
      createdAt: amb.createdAt,
    }));

    return {
      ambassadors: ambassadorsWithProfiles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all chat clicks/messages
   */
  async getAllChatClicks(page: number = 1, limit: number = 100) {
    const skip = (page - 1) * limit;

    const [chatClicks, total] = await Promise.all([
      this.prisma.chatClick.findMany({
        skip,
        take: limit,
        orderBy: { clickedAt: 'desc' },
      }),
      this.prisma.chatClick.count(),
    ]);

    // Get university names for each chat click
    const chatClicksWithUniversity = await Promise.all(
      chatClicks.map(async (click) => {
        const universityProfile = await this.prisma.universityProfile.findUnique(
          {
            where: { widgetId: click.widgetId },
            include: { user: true },
          },
        );

        return {
          id: click.id,
          widgetId: click.widgetId,
          domain: click.domain,
          ipAddress: click.ipAddress,
          country: click.country,
          ambassadorId: click.ambassadorId,
          ambassadorName: click.ambassadorName,
          question1Answer: click.question1Answer,
          question2Answer: click.question2Answer,
          clickedAt: click.clickedAt,
          createdAt: click.createdAt,
          universityName: universityProfile?.user?.fullName || 'Unknown',
        };
      }),
    );

    return {
      chatClicks: chatClicksWithUniversity,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all invitations
   */
  async getAllInvitations(page: number = 1, limit: number = 100) {
    const skip = (page - 1) * limit;

    const [invitations, total] = await Promise.all([
      this.prisma.invitedAmbassador.findMany({
        include: {
          university: {
            include: {
              user: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { invitedAt: 'desc' },
      }),
      this.prisma.invitedAmbassador.count(),
    ]);

    const invitationsWithUniversity = invitations.map((inv) => ({
      id: inv.id,
      universityId: inv.universityId,
      universityName: inv.university.user.fullName,
      ambassadorName: inv.ambassadorName,
      ambassadorEmail: inv.ambassadorEmail,
      status: inv.status,
      invitedAt: inv.invitedAt,
      respondedAt: inv.respondedAt,
    }));

    return {
      invitations: invitationsWithUniversity,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all users (universities and ambassadors)
   */
  async getAllUsers(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        include: {
          ambassadorProfile: {
            select: { id: true },
          },
          universityProfile: {
            select: { id: true, widgetId: true, isVerified: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        university: user.university,
        role: user.role,
        hasAmbassadorProfile: !!user.ambassadorProfile,
        hasUniversityProfile: !!user.universityProfile,
        widgetId: user.universityProfile?.widgetId || null,
        isVerified: user.universityProfile?.isVerified || false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get analytics by country
   */
  async getAnalyticsByCountry() {
    const chatClicks = await this.prisma.chatClick.findMany({
      select: { country: true },
    });

    const countryStats = chatClicks.reduce((acc, click) => {
      const country = click.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countryStats)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get widget analytics
   */
  async getWidgetAnalytics() {
    const universityProfiles = await this.prisma.universityProfile.findMany({
      include: {
        user: true,
        _count: {
          select: {
            invitedAmbassadors: true,
          },
        },
      },
    });

    const widgetsWithStats = await Promise.all(
      universityProfiles.map(async (profile) => {
        const chatClickCount = profile.widgetId
          ? await this.prisma.chatClick.count({
              where: { widgetId: profile.widgetId },
            })
          : 0;

        return {
          widgetId: profile.widgetId,
          universityName: profile.user.fullName,
          universityEmail: profile.email,
          isVerified: profile.isVerified,
          totalInvitations: profile._count.invitedAmbassadors,
          totalChatClicks: chatClickCount,
          createdAt: profile.createdAt,
        };
      }),
    );

    return widgetsWithStats;
  }

  /**
   * Delete a user (admin only)
   */
  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'admin') {
      throw new Error('Cannot delete admin user');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully', deletedUser: user };
  }

  /**
   * Get user by ID with full details
   */
  async getUserDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        ambassadorProfile: {
          include: {
            socialLinks: true,
            following: true,
          },
        },
        universityProfile: {
          include: {
            _count: {
              select: {
                invitedAmbassadors: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    let chatClickCount = 0;
    if (user.universityProfile?.widgetId) {
      chatClickCount = await this.prisma.chatClick.count({
        where: { widgetId: user.universityProfile.widgetId },
      });
    }

    return {
      ...user,
      chatClickCount,
    };
  }
}

