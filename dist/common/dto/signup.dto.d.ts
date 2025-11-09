import { UserRole } from '@prisma/client';
export declare class SignupDto {
    fullName: string;
    email: string;
    university: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
}
