import { AuthService } from './auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { VerifyPasswordDto } from '../dto/verify-password.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    getProfile(req: any): Promise<{
        id: any;
        fullName: any;
        email: any;
        university: any;
        role: any;
        createdAt: any;
    }>;
    verifyPassword(req: any, verifyPasswordDto: VerifyPasswordDto): Promise<{
        isValid: boolean;
    }>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
