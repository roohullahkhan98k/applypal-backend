export declare class SetUniversityEmailDto {
    email: string;
}
export declare class SendInvitationDto {
    ambassadorName: string;
    ambassadorEmail: string;
    universityName?: string;
}
export declare class EmailResponseDto {
    success: boolean;
    message: string;
    email?: string;
}
export declare class InvitationResponseDto {
    success: boolean;
    message: string;
    sentTo: string;
}
export declare class AmbassadorDto {
    name: string;
    email: string;
}
export declare class BulkInvitationDto {
    ambassadors: AmbassadorDto[];
    universityName?: string;
}
export declare class BulkInvitationResponseDto {
    success: boolean;
    message: string;
    totalSent: number;
    totalFailed: number;
    results: {
        name: string;
        email: string;
        success: boolean;
        error?: string;
    }[];
}
