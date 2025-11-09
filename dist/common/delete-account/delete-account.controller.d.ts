import { DeleteAccountService } from './delete-account.service';
export declare class DeleteAccountController {
    private deleteAccountService;
    constructor(deleteAccountService: DeleteAccountService);
    deleteMyAccount(req: any): Promise<{
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
