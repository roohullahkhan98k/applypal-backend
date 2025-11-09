import { UserRole } from '@prisma/client';
export declare class AuthResponseDto {
    accessToken: string;
    user: {
        id: string;
        fullName: string;
        email: string;
        university: string;
        role: UserRole;
    };
}
