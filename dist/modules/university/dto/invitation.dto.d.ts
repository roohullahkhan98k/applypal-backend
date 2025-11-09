export declare class InvitedAmbassadorDto {
    id: string;
    ambassadorName: string;
    ambassadorEmail: string;
    status: 'INVITED' | 'ACCEPTED' | 'DECLINED' | 'JOINED';
    invitedAt: string;
    respondedAt?: string;
}
export declare class InvitationListResponseDto {
    invitations: InvitedAmbassadorDto[];
    totalCount: number;
    statusCounts: {
        INVITED: number;
        ACCEPTED: number;
        DECLINED: number;
        JOINED: number;
    };
}
export declare class UpdateInvitationStatusDto {
    status: 'ACCEPTED' | 'DECLINED';
}
