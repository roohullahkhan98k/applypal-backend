import { PrismaService } from '../../database/prisma.service';
export declare class DeleteAccountService {
    private prisma;
    constructor(prisma: PrismaService);
    deleteUserAccount(userId: string): Promise<{
        message: string;
        deletedUser: {
            id: string;
            fullName: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
        deletedData: {
            ambassadorProfile: string;
            socialLinks: string;
            following: number;
        };
    }>;
}
