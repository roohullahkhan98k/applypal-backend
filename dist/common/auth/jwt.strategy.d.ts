import { Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { UserPayload } from '../interfaces/user.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(payload: UserPayload): Promise<any>;
}
export {};
