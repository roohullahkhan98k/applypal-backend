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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAccountService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let DeleteAccountService = class DeleteAccountService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async deleteUserAccount(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                ambassadorProfile: {
                    include: {
                        socialLinks: true,
                        following: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.delete({
            where: { id: userId },
        });
        return {
            message: 'Account and all associated data deleted successfully',
            deletedUser: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
            deletedData: {
                ambassadorProfile: user.ambassadorProfile ? 'Deleted' : 'None',
                socialLinks: user.ambassadorProfile?.socialLinks ? 'Deleted' : 'None',
                following: user.ambassadorProfile?.following?.length || 0,
            },
        };
    }
};
exports.DeleteAccountService = DeleteAccountService;
exports.DeleteAccountService = DeleteAccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeleteAccountService);
//# sourceMappingURL=delete-account.service.js.map