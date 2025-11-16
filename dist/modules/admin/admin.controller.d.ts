import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalUniversities: number;
        totalAmbassadors: number;
        totalChatClicks: number;
        totalInvitations: number;
        activeWidgets: number;
        verifiedWidgets: number;
        recentChatClicks: number;
        recentSignups: number;
    }>;
    getAllUniversities(page?: string, limit?: string): Promise<{
        universities: {
            id: string;
            userId: string;
            fullName: string;
            email: string;
            university: string;
            widgetId: string;
            isVerified: boolean;
            universityEmail: string;
            totalInvitations: number;
            totalChatClicks: number;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAllAmbassadors(page?: string, limit?: string): Promise<{
        ambassadors: {
            id: string;
            userId: string;
            fullName: string;
            email: string;
            university: string;
            subject: string;
            countryOriginal: string;
            countryCurrent: string;
            currentlyLivingCountry: string;
            currentUniversityName: string;
            profileImage: string;
            hasProfile: boolean;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAllChatClicks(page?: string, limit?: string): Promise<{
        chatClicks: {
            id: string;
            widgetId: string;
            domain: string;
            ipAddress: string;
            country: string;
            ambassadorId: string;
            ambassadorName: string;
            question1Answer: string;
            question2Answer: string;
            clickedAt: Date;
            createdAt: Date;
            universityName: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAllInvitations(page?: string, limit?: string): Promise<{
        invitations: {
            id: string;
            universityId: string;
            universityName: string;
            ambassadorName: string;
            ambassadorEmail: string;
            status: import(".prisma/client").$Enums.InvitationStatus;
            invitedAt: Date;
            respondedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAllUsers(page?: string, limit?: string): Promise<{
        users: {
            id: string;
            fullName: string;
            email: string;
            university: string;
            role: import(".prisma/client").$Enums.UserRole;
            hasAmbassadorProfile: boolean;
            hasUniversityProfile: boolean;
            widgetId: string;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getAnalyticsByCountry(): Promise<{
        country: string;
        count: number;
    }[]>;
    getWidgetAnalytics(): Promise<{
        widgetId: string;
        universityName: string;
        universityEmail: string;
        isVerified: boolean;
        totalInvitations: number;
        totalChatClicks: number;
        createdAt: Date;
    }[]>;
    getUserDetails(userId: string): Promise<{
        chatClickCount: number;
        ambassadorProfile: {
            socialLinks: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                facebook: string | null;
                instagram: string | null;
                tiktok: string | null;
                x: string | null;
                linkedin: string | null;
                youtube: string | null;
                ambassadorId: string;
            };
            following: {
                id: string;
                createdAt: Date;
                ambassadorId: string;
                platform: string;
                username: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            subject: string | null;
            countryOriginal: string | null;
            countryCurrent: string | null;
            calendlyLink: string | null;
            writtenContent: string | null;
            writtenDetails: string | null;
            dob: Date | null;
            gender: string | null;
            languages: string[];
            currentlyLivingCountry: string | null;
            phoneNumber: string | null;
            leaveAPYear: number | null;
            previousSchoolName: string | null;
            currentlyUniversityStudent: string | null;
            currentUniversityName: string | null;
            services: string[];
            whyStudyingCourse: string | null;
            skilsExperience: string | null;
            hobbiesInterests: string | null;
            caringCauses: string | null;
            accomplishmentsProudOf: string | null;
            answerQ1: string | null;
            answerQ2: string | null;
            answerQ3: string | null;
            answerQ4: string | null;
            question1: string | null;
            question2: string | null;
            question3: string | null;
            isRegisteredAmbassador: string | null;
            profileImage: string | null;
            userId: string;
        };
        universityProfile: {
            _count: {
                invitedAmbassadors: number;
            };
        } & {
            email: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            widgetId: string | null;
            isVerified: boolean;
            widgetConfig: import("@prisma/client/runtime/library").JsonValue | null;
        };
        university: string;
        fullName: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        id: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(userId: string): Promise<{
        message: string;
        deletedUser: {
            university: string;
            fullName: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: string;
            passwordHash: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
