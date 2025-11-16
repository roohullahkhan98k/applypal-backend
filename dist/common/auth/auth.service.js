"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../../database/prisma.service");
let AuthService = AuthService_1 = class AuthService {
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async signup(signupDto) {
        const { fullName, email, university, password, confirmPassword, role } = signupDto;
        if (role === 'admin') {
            throw new common_1.ConflictException('Admin accounts cannot be created via signup. Please contact system administrator.');
        }
        if (password !== confirmPassword) {
            throw new common_1.ConflictException('Passwords do not match');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            const roleTexts = {
                ambassador: 'Ambassador',
                university: 'University',
                admin: 'Admin',
            };
            const roleText = roleTexts[existingUser.role] || existingUser.role;
            throw new common_1.ConflictException(`This email is already registered as a ${roleText}. Please use a different email or login with your existing account.`);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                fullName,
                email,
                university,
                passwordHash: hashedPassword,
                role: role,
            },
        });
        if (role === 'ambassador') {
            try {
                const acceptedInvitations = await this.prisma.invitedAmbassador.findMany({
                    where: {
                        ambassadorEmail: email,
                        status: 'ACCEPTED'
                    }
                });
                if (acceptedInvitations.length > 0) {
                    await this.prisma.invitedAmbassador.updateMany({
                        where: {
                            ambassadorEmail: email,
                            status: 'ACCEPTED'
                        },
                        data: {
                            status: 'JOINED',
                            respondedAt: new Date()
                        }
                    });
                    this.logger.log(`📝 Updated invitation status to JOINED for ${email}`);
                }
                else {
                    await this.prisma.invitedAmbassador.updateMany({
                        where: {
                            ambassadorEmail: email,
                            status: 'INVITED'
                        },
                        data: {
                            status: 'ACCEPTED',
                            respondedAt: new Date()
                        }
                    });
                    this.logger.log(`📝 Updated invitation status to ACCEPTED for ${email}`);
                }
            }
            catch (error) {
                this.logger.warn(`⚠️ Could not update invitation status for ${email}: ${error.message}`);
            }
        }
        const payload = {
            sub: newUser.id,
            email: newUser.email,
            role: newUser.role,
            fullName: newUser.fullName,
            university: newUser.university,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            user: {
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
                university: newUser.university,
                role: newUser.role,
            },
        };
    }
    async login(loginDto) {
        const { email, password, role } = loginDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!existingUser) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (existingUser.role !== role) {
            const roleTexts = {
                ambassador: 'Ambassador',
                university: 'University',
                admin: 'Admin',
            };
            const currentRoleText = roleTexts[existingUser.role] || existingUser.role;
            const requestedRoleText = roleTexts[role] || role;
            throw new common_1.UnauthorizedException(`This email is registered as a ${currentRoleText}, not as a ${requestedRoleText}. Please login with the correct role.`);
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
            fullName: existingUser.fullName,
            university: existingUser.university,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            user: {
                id: existingUser.id,
                fullName: existingUser.fullName,
                email: existingUser.email,
                university: existingUser.university,
                role: existingUser.role,
            },
        };
    }
    async validateUser(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        return user || null;
    }
    async verifyPassword(userId, verifyPasswordDto) {
        const { currentPassword } = verifyPasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        return { isValid: isPasswordValid };
    }
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword, confirmPassword } = changePasswordDto;
        if (newPassword !== confirmPassword) {
            throw new common_1.BadRequestException('New password and confirm password do not match');
        }
        if (currentPassword === newPassword) {
            throw new common_1.BadRequestException('New password must be different from current password');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: hashedNewPassword,
            },
        });
        return { message: 'Password changed successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map