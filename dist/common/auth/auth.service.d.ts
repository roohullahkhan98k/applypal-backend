import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../interfaces/user.interface';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { VerifyPasswordDto } from '../dto/verify-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { PrismaService } from '../../database/prisma.service';
export declare class AuthService {
    private jwtService;
    private prisma;
    private readonly logger;
    constructor(jwtService: JwtService, prisma: PrismaService);
    signup(signupDto: SignupDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    validateUser(payload: UserPayload): Promise<any | null>;
    verifyPassword(userId: string, verifyPasswordDto: VerifyPasswordDto): Promise<{
        isValid: boolean;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
