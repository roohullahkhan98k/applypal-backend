import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAmbassadorProfileDto, UpdateAmbassadorProfileDto } from './dto/ambassador-profile.dto';

@Injectable()
export class AmbassadorService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: string, profileData: CreateAmbassadorProfileDto, file?: Express.Multer.File) {
    // Check if profile already exists
    const existingProfile = await this.prisma.ambassadorProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('Ambassador profile already exists for this user');
    }

    // Create profile with social links and following
    const { social, fullName, email, ...profileInfo } = profileData;

    // Handle profile image
    const profileImagePath = file ? `/uploads/ambassador-profiles/${file.filename}` : profileData.profileImage || null;

    const profile = await this.prisma.ambassadorProfile.create({
      data: {
        userId,
        subject: profileInfo.subject,
        countryOriginal: profileInfo.countryOriginal,
        countryCurrent: profileInfo.countryCurrent,
        currentlyLivingCountry: profileInfo.currentlyLivingCountry,
        phoneNumber: profileInfo.phoneNumber,
        dob: profileData.dob ? new Date(profileData.dob) : null,
        gender: profileInfo.gender,
        languages: profileInfo.languages || [],
        leaveAPYear: profileInfo.leaveAPYear,
        previousSchoolName: profileInfo.previousSchoolName,
        currentlyUniversityStudent: profileInfo.currentlyUniversityStudent,
        currentUniversityName: profileInfo.currentUniversityName,
        calendlyLink: profileInfo.calendlyLink,
        writtenContent: profileInfo.writtenContent,
        writtenDetails: profileInfo.writtenDetails,
        profileImage: profileImagePath,
        services: profileInfo.services || [],
        whyStudyingCourse: profileInfo.whyStudyingCourse,
        skilsExperience: profileInfo.skilsExperience,
        hobbiesInterests: profileInfo.hobbiesInterests,
        caringCauses: profileInfo.caringCauses,
        accomplishmentsProudOf: profileInfo.accomplishmentsProudOf,
        answerQ1: profileInfo.answerQ1,
        answerQ2: profileInfo.answerQ2,
        answerQ3: profileInfo.answerQ3,
        answerQ4: profileInfo.answerQ4,
        question1: profileInfo.question1,
        question2: profileInfo.question2,
        question3: profileInfo.question3,
        isRegisteredAmbassador: profileInfo.isRegisteredAmbassador,
        socialLinks: social ? {
          create: {
            facebook: social.facebook,
            instagram: social.instagram,
            tiktok: social.tiktok,
            x: social.x,
            linkedin: social.linkedin,
            youtube: social.youtube,
          }
        } : undefined,
        following: social?.following ? {
          create: social.following.map(follow => ({
            platform: 'general',
            username: follow,
          }))
        } : undefined,
      },
      include: {
        user: true,
        socialLinks: true,
        following: true,
      },
    });

    return profile;
  }

  async updateProfile(userId: string, profileData: UpdateAmbassadorProfileDto, file?: Express.Multer.File) {
    const { social, fullName, email, ...profileInfo } = profileData;

    // Check if profile exists
    const existingProfile = await this.prisma.ambassadorProfile.findUnique({
      where: { userId },
      include: { socialLinks: true, following: true },
    });

    if (!existingProfile) {
      throw new NotFoundException('Ambassador profile not found');
    }

    // Handle profile image
    const profileImagePath = file ? `/uploads/ambassador-profiles/${file.filename}` : (profileData.profileImage !== undefined ? profileData.profileImage : undefined);

    // Update profile
    const updatedProfile = await this.prisma.ambassadorProfile.update({
      where: { userId },
      data: {
        subject: profileInfo.subject,
        countryOriginal: profileInfo.countryOriginal,
        countryCurrent: profileInfo.countryCurrent,
        currentlyLivingCountry: profileInfo.currentlyLivingCountry,
        phoneNumber: profileInfo.phoneNumber,
        dob: profileData.dob ? new Date(profileData.dob) : null,
        gender: profileInfo.gender,
        languages: profileInfo.languages || [],
        leaveAPYear: profileInfo.leaveAPYear,
        previousSchoolName: profileInfo.previousSchoolName,
        currentlyUniversityStudent: profileInfo.currentlyUniversityStudent,
        currentUniversityName: profileInfo.currentUniversityName,
        calendlyLink: profileInfo.calendlyLink,
        writtenContent: profileInfo.writtenContent,
        writtenDetails: profileInfo.writtenDetails,
        profileImage: profileImagePath,
        services: profileInfo.services || [],
        whyStudyingCourse: profileInfo.whyStudyingCourse,
        skilsExperience: profileInfo.skilsExperience,
        hobbiesInterests: profileInfo.hobbiesInterests,
        caringCauses: profileInfo.caringCauses,
        accomplishmentsProudOf: profileInfo.accomplishmentsProudOf,
        answerQ1: profileInfo.answerQ1,
        answerQ2: profileInfo.answerQ2,
        answerQ3: profileInfo.answerQ3,
        answerQ4: profileInfo.answerQ4,
        question1: profileInfo.question1,
        question2: profileInfo.question2,
        question3: profileInfo.question3,
        isRegisteredAmbassador: profileInfo.isRegisteredAmbassador,
        socialLinks: social ? {
          upsert: {
            create: {
              facebook: social.facebook,
              instagram: social.instagram,
              tiktok: social.tiktok,
              x: social.x,
              linkedin: social.linkedin,
              youtube: social.youtube,
            },
            update: {
              facebook: social.facebook,
              instagram: social.instagram,
              tiktok: social.tiktok,
              x: social.x,
              linkedin: social.linkedin,
              youtube: social.youtube,
            },
          }
        } : undefined,
      },
      include: {
        user: true,
        socialLinks: true,
        following: true,
      },
    });

    // Update following if provided
    if (social?.following) {
      // Delete existing following
      await this.prisma.following.deleteMany({
        where: { ambassadorId: existingProfile.id },
      });

      // Create new following
      await this.prisma.following.createMany({
        data: social.following.map(follow => ({
          ambassadorId: existingProfile.id,
          platform: 'general',
          username: follow,
        })),
      });
    }

    return updatedProfile;
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.ambassadorProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        socialLinks: true,
        following: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Ambassador profile not found');
    }

    return profile;
  }

  async getAllProfiles() {
    return this.prisma.ambassadorProfile.findMany({
      include: {
        user: true,
        socialLinks: true,
        following: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteProfile(userId: string) {
    const profile = await this.prisma.ambassadorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Ambassador profile not found');
    }

    await this.prisma.ambassadorProfile.delete({
      where: { userId },
    });

    return { message: 'Ambassador profile deleted successfully' };
  }

}
