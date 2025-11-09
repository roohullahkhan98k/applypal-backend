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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AmbassadorService = class AmbassadorService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createProfile(userId, profileData, file) {
        const existingProfile = await this.prisma.ambassadorProfile.findUnique({
            where: { userId },
        });
        if (existingProfile) {
            throw new common_1.ConflictException('Ambassador profile already exists for this user');
        }
        const { social, fullName, email, ...profileInfo } = profileData;
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
    async updateProfile(userId, profileData, file) {
        const { social, fullName, email, ...profileInfo } = profileData;
        const existingProfile = await this.prisma.ambassadorProfile.findUnique({
            where: { userId },
            include: { socialLinks: true, following: true },
        });
        if (!existingProfile) {
            throw new common_1.NotFoundException('Ambassador profile not found');
        }
        const profileImagePath = file ? `/uploads/ambassador-profiles/${file.filename}` : (profileData.profileImage !== undefined ? profileData.profileImage : undefined);
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
        if (social?.following) {
            await this.prisma.following.deleteMany({
                where: { ambassadorId: existingProfile.id },
            });
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
    async getProfile(userId) {
        const profile = await this.prisma.ambassadorProfile.findUnique({
            where: { userId },
            include: {
                user: true,
                socialLinks: true,
                following: true,
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Ambassador profile not found');
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
    async deleteProfile(userId) {
        const profile = await this.prisma.ambassadorProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Ambassador profile not found');
        }
        await this.prisma.ambassadorProfile.delete({
            where: { userId },
        });
        return { message: 'Ambassador profile deleted successfully' };
    }
};
exports.AmbassadorService = AmbassadorService;
exports.AmbassadorService = AmbassadorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AmbassadorService);
//# sourceMappingURL=ambassador.service.js.map