export declare class AdminDashboardStatsDto {
    totalUsers: number;
    totalUniversities: number;
    totalAmbassadors: number;
    totalChatClicks: number;
    totalInvitations: number;
    activeWidgets: number;
    verifiedWidgets: number;
    recentChatClicks: number;
    recentSignups: number;
}
export declare class AdminUniversityListDto {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    university: string;
    widgetId?: string;
    isVerified: boolean;
    universityEmail?: string;
    totalInvitations: number;
    totalChatClicks: number;
    createdAt: Date;
}
export declare class AdminAmbassadorListDto {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    university: string;
    subject?: string;
    countryOriginal?: string;
    countryCurrent?: string;
    currentUniversityName?: string;
    profileImage?: string;
    hasProfile: boolean;
    createdAt: Date;
}
export declare class AdminChatClickDto {
    id: string;
    widgetId: string;
    domain: string;
    ipAddress: string;
    country?: string;
    ambassadorId?: string;
    ambassadorName?: string;
    question1Answer?: string;
    question2Answer?: string;
    clickedAt: Date;
    createdAt: Date;
    universityName?: string;
}
export declare class AdminInvitationDto {
    id: string;
    universityId: string;
    universityName: string;
    ambassadorName: string;
    ambassadorEmail: string;
    status: string;
    invitedAt: Date;
    respondedAt?: Date;
}
