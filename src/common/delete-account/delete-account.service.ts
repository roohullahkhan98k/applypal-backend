import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DeleteAccountService {
  constructor(private prisma: PrismaService) {}

  async deleteUserAccount(userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        ambassadorProfile: {
          include: {
            socialLinks: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete user (cascade delete will handle ambassador profile, social links, and following)
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      message: 'Account and all associated data deleted successfully',
      deletedUser: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      deletedData: {
        ambassadorProfile: user.ambassadorProfile ? 'Deleted' : 'None',
        socialLinks: user.ambassadorProfile?.socialLinks ? 'Deleted' : 'None',
        following: user.ambassadorProfile?.following?.length || 0,
      },
    };
  }
}
