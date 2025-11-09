export declare class ChatClickDto {
    widgetId: string;
    domain: string;
    userAgent: string;
    timestamp: string;
    ambassadorId?: string;
    ambassadorName?: string;
}
export declare class ChatClickResponseDto {
    success: boolean;
    message: string;
    clickId?: string;
}
export declare class ChatClickAnswersDto {
    clickId: string;
    question1Answer?: string;
    question2Answer?: string;
    ambassadorId?: string;
    ambassadorName?: string;
}
export declare class ChatClickAnswersResponseDto {
    success: boolean;
    message: string;
}
export declare class ChatClickAnalyticsDto {
    totalClicks: number;
    clicks: {
        id: string;
        domain: string;
        ipAddress: string;
        country: string | null;
        ambassadorId: string | null;
        ambassadorName: string | null;
        question1Answer: string | null;
        question2Answer: string | null;
        clickedAt: string;
        createdAt: string;
    }[];
}
